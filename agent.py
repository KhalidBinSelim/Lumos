import os
import json
import contextlib
import io
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId

# --- Google Gen AI Imports ---
# ensure google-genai or your specific ADK package is in requirements.txt
from google.adk.runners import InMemoryRunner
from google.adk.models.google_llm import Gemini
from google.adk.agents import Agent
from google.genai import types

# --- Configuration ---
PORT = 7680  # Hugging Face Spaces default port
DB_NAME = "test"
USERS_COLLECTION = "users"
SCHOLARSHIPS_COLLECTION = "scholarships"
TARGET_USER_ID = "692e7c90134f8b80aaa3efba"
SCHOLARSHIP_ID = '692e7c9a134f8b80aaa3efbd'

# --- Secrets Management ---
# Set these in Hugging Face -> Settings -> Variables and Secrets
GOOGLE_API_KEY = 'AIzaSyBlYBzV-QW3a28736xZeA2_EpSyetAxmA8'
MONGO_URL = 'mongodb+srv://rayhanulamint2_db_user:typrOKP8m2D4JI5D@cluster0.stnxpls.mongodb.net/?appName=Cluster0'
# --- Global State ---
app_state = {
    "u_soft": "",
    "s_soft": "",
    "db_connected": False
}
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# --- Database Helpers ---
def get_mongo_db():
    if not MONGO_URL:
        print("❌ MONGO_URL is missing.")
        return None
    try:
        client = MongoClient(MONGO_URL)
        return client[DB_NAME]
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        return None

def find_doc_by_id(db, collection_name, doc_id):
    try:
        collection = db[collection_name]
        return collection.find_one({"_id": ObjectId(doc_id)})
    except Exception as e:
        print(f"❌ Error fetching {collection_name}: {e}")
        return None

def extract_text_from_response(response):
    """Helper to parse Gemini response objects."""
    if isinstance(response, str):
        return response.strip()
    if isinstance(response, list) and response:
        return extract_text_from_response(response[-1])
    if hasattr(response, 'content'):
        if hasattr(response.content, 'parts'):
            return response.content.parts[0].text.strip()
        return str(response.content).strip()
    return str(response).strip()

# --- Lifespan Manager (Startup logic) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Server starting...")
    
    if not GOOGLE_API_KEY:
        print("⚠ WARNING: GOOGLE_API_KEY is not set.")
    
    db = get_mongo_db()

    user_doc = find_doc_by_id(db, USERS_COLLECTION, TARGET_USER_ID)
    scholar_doc = find_doc_by_id(db, SCHOLARSHIPS_COLLECTION, SCHOLARSHIP_ID)

    if not user_doc or not scholar_doc:
        print("⚠ User or Scholarship data not found in DB.")
        yield
        return

    print("✅ Data fetched. Generating context...")

    try:
        retry_config = types.HttpRetryOptions(attempts=3, initial_delay=1)
        context_agent = Agent(
            name="ContextAgent",
            model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
            instruction=f"""
            You are a Data Distiller.
            User Data: {user_doc}
            Scholarship Data: {scholar_doc}
            TASK: Extract soft skills, mission, values, and goals. Exclude hard numbers.
            OUTPUT: RAW JSON with keys "user_soft_context" and "scholarship_soft_context".
            """,
        )

        runner = InMemoryRunner(agent=context_agent)
        
        # Capture stdout to prevent console clutter, run the agent
        with contextlib.redirect_stdout(io.StringIO()):
            response = await runner.run_debug('')

        clean_json = extract_text_from_response(response).replace("json", "").replace("", "").strip()
        data = json.loads(clean_json)
        
        app_state["u_soft"] = data.get("user_soft_context", "")
        app_state["s_soft"] = data.get("scholarship_soft_context", "")
        app_state["db_connected"] = True
        print("✅ Context generated successfully!")

    except Exception as e:
        print(f"❌ Context generation failed: {e}")
        # Fallback to raw data
        app_state["u_soft"] = str(user_doc)
        app_state["s_soft"] = str(scholar_doc)
        app_state["db_connected"] = True

    yield
    print("🛑 Shutting down...")

# --- FastAPI Setup ---
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[""], allow_methods=[""], allow_headers=["*"],
)

class PromptRequest(BaseModel):
    user_prompt: str

# --- Routes ---
@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scholarship Essay Generator</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite; display: none; margin: 0 auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white shadow-xl rounded-lg p-8 max-w-2xl w-full">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">AI Scholarship Essayist</h1>
            <div class="mb-4">
                <textarea id="prompt" rows="3" class="w-full p-3 border border-gray-300 rounded-md" placeholder="E.g., 'Focus on my leadership experience'"></textarea>
            </div>
            <button onclick="generateEssay()" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700">Generate Essay</button>
            <div class="mt-8">
                <div id="loader" class="loader"></div>
                <div id="result-container" class="hidden">
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Generated Essay:</h2>
                    <div id="essay-output" class="bg-gray-50 p-6 rounded-md border border-gray-200 text-gray-700 whitespace-pre-wrap"></div>
                </div>
            </div>
        </div>
        <script>
            async function generateEssay() {
                const prompt = document.getElementById('prompt').value;
                const loader = document.getElementById('loader');
                const result = document.getElementById('result-container');
                const output = document.getElementById('essay-output');
                if (!prompt.trim()) { alert("Please enter a prompt."); return; }
                
                loader.style.display = 'block'; 
                result.classList.add('hidden'); 
                output.innerText = "";
                
                try {
                    const response = await fetch('/generate', {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_prompt: prompt })
                    });
                    const data = await response.json();
                    output.innerText = data.essay || ("Error: " + data.error);
                    result.classList.remove('hidden');
                } catch (e) { 
                    output.innerText = "Error: " + e.message; 
                    result.classList.remove('hidden'); 
                } finally { 
                    loader.style.display = 'none'; 
                }
            }
        </script>
    </body>
    </html>
    """

@app.post("/generate")
async def generate_essay(request: PromptRequest):
    # if not app_state["db_connected"]:
    #     return {"error": "Database not connected or data missing."}

    instruction_text = f"""
    You are a persuasive academic writer.
    CONTEXT:
    1. User: {app_state['u_soft']}
    2. Scholarship: {app_state['s_soft']}
    USER REQUEST: "{request.user_prompt}"
    TASK: Write a 200-300 word scholarship essay strictly following the USER REQUEST.
    OUTPUT: Only the essay text.
    """

    retry_config = types.HttpRetryOptions(attempts=3, initial_delay=1)
    essay_agent = Agent(
        name="EssayAgent",
        model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
        instruction=instruction_text
    )

    runner = InMemoryRunner(agent=essay_agent)
    
    with contextlib.redirect_stdout(io.StringIO()):
        response = await runner.run_debug('')

    return {"essay": extract_text_from_response(response)}


uvicorn.run(app, host="0.0.0.0", port=PORT)