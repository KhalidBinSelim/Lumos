import os
import json
import contextlib
import io
import uvicorn
import nest_asyncio
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyngrok import ngrok
from pymongo import MongoClient
from bson import ObjectId

# --- Google Gen AI & ADK Imports ---
from google import genai
from google.genai import types
from google.adk.agents import Agent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner

# --- Secrets Management (Kaggle/Env specific) ---
try:
    from kaggle_secrets import UserSecretsClient
    try:
        GOOGLE_API_KEY = "AIzaSyBlYBzV-QW3a28736xZeA2_EpSyetAxmA8"
        MONGO_URL = "mongodb+srv://rayhanulamint2_db_user:typrOKP8m2D4JI5D@cluster0.stnxpls.mongodb.net/?appName=Cluster0"
        os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
    except Exception:
        pass
except ImportError:
    # If running locally, ensure these are set in your env or replace strings below
    MONGO_URL = os.environ.get("mongo_url", "your_connection_string_here")

if "GOOGLE_API_KEY" not in os.environ:
    print("WARNING: GOOGLE_API_KEY not found in environment.")

# --- Configuration ---
DB_NAME = "test"
USERS_COLLECTION = "users"
SCHOLARSHIPS_COLLECTION = "scholarships"
TARGET_USER_ID = "692e7c90134f8b80aaa3efba"
SCHOLARSHIP_ID = '692e7c9a134f8b80aaa3efbd'

# --- Global State ---
# We store the context here so we don't recalculate it on every request
app_state = {
    "u_soft": "",
    "s_soft": "",
    "db_connected": False
}

# --- Database Helper Functions ---
def get_mongo_db():
    try:
        client = MongoClient(MONGO_URL)
        return client[DB_NAME]
    except Exception as e:
        print(f"MongoDB Connection Error: {e}")
        return None

def find_doc_by_id(db, collection_name, doc_id):
    try:
        collection = db[collection_name]
        return collection.find_one({"_id": ObjectId(doc_id)})
    except Exception as e:
        print(f"Error fetching {collection_name}: {e}")
        return None

def extract_text_from_response(response):
    """Robustly extracts text string from ADK response objects."""
    if isinstance(response, str): return response.strip()
    if isinstance(response, list) and response:
        return extract_text_from_response(response[-1])
    if hasattr(response, 'content'):
        if hasattr(response.content, 'parts'):
            return response.content.parts[0].text.strip()
        return str(response.content).strip()
    return str(response).strip()

# --- FastAPI Setup ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply nest_asyncio to allow nested event loops (crucial for Colab/Kaggle)
nest_asyncio.apply()

# --- Startup Event: Load Context ---
@app.on_event("startup")
async def startup_event():
    print("Server starting... Connecting to DB and building context.")
    db = get_mongo_db()
    

    user_doc = find_doc_by_id(db, USERS_COLLECTION, TARGET_USER_ID)
    scholar_doc = find_doc_by_id(db, SCHOLARSHIPS_COLLECTION, SCHOLARSHIP_ID)

    if not user_doc or not scholar_doc:
        print("WARNING: User or Scholarship not found.")
        return

    print("Data fetched. Running ContextAgent...")

    # Define Context Agent
    retry_config=types.HttpRetryOptions(
    attempts=5,  # Maximum retry attempts
    exp_base=7,  # Delay multiplier
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504], # Retry on these HTTP errors
)
    
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
    
    # Capture output safely
    with contextlib.redirect_stdout(io.StringIO()):
        response = await runner.run_debug('') # Empty input to trigger instruction processing
    
    raw_text = extract_text_from_response(response)
    clean_json = raw_text.replace("json", "").replace("", "").strip()
    
    try:
        data = json.loads(clean_json)
        app_state["u_soft"] = data.get("user_soft_context", "")
        app_state["s_soft"] = data.get("scholarship_soft_context", "")
        app_state["db_connected"] = True
        print("Context generated successfully!")
    except json.JSONDecodeError:
        print("ERROR: Failed to parse Context Agent JSON output.")

# --- Pydantic Models ---
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
            .loader {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 2s linear infinite;
                display: none;
                margin: 0 auto;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white shadow-xl rounded-lg p-8 max-w-2xl w-full">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">AI Scholarship Essayist</h1>
            <p class="text-gray-500 mb-6 text-center">Refine your essay by providing specific instructions below.</p>
            
            <div class="mb-4">
                <label for="prompt" class="block text-sm font-medium text-gray-700 mb-2">Your Instruction / Prompt</label>
                <textarea id="prompt" rows="3" 
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="E.g., 'Focus on my leadership experience' or 'Make the tone more emotional'."></textarea>
            </div>
            
            <button onclick="generateEssay()" 
                class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition duration-300">
                Generate Essay
            </button>

            <div class="mt-8">
                <div id="loader" class="loader"></div>
                <div id="result-container" class="hidden">
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Generated Essay:</h2>
                    <div id="essay-output" class="bg-gray-50 p-6 rounded-md border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed"></div>
                </div>
            </div>
        </div>

        <script>
            async function generateEssay() {
                const prompt = document.getElementById('prompt').value;
                const loader = document.getElementById('loader');
                const resultContainer = document.getElementById('result-container');
                const output = document.getElementById('essay-output');

                if (!prompt.trim()) {
                    alert("Please enter a prompt.");
                    return;
                }

                // UI Reset
                loader.style.display = 'block';
                resultContainer.classList.add('hidden');
                output.innerText = "";

                try {
                    const response = await fetch('/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_prompt: prompt })
                    });
                    
                    const data = await response.json();
                    
                    if (data.essay) {
                        output.innerText = data.essay;
                        resultContainer.classList.remove('hidden');
                    } else {
                        output.innerText = "Error: " + (data.error || "Unknown error occurred");
                        resultContainer.classList.remove('hidden');
                    }
                } catch (error) {
                    output.innerText = "Network Error: " + error.message;
                    resultContainer.classList.remove('hidden');
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
    if not app_state["db_connected"] or not app_state["u_soft"]:
        return {"error": "Context not loaded. Please check database connection."}

    # Define Essay Agent with loaded context
    # Note: We create the agent here to inject the specific user prompt logic
    # The 'instruction' sets the persona and context.
    # The 'runner.run(input)' passes the user's dynamic prompt.
    
    instruction_text = f"""
    You are a persuasive academic writer and scholarship consultant.
    
    CONTEXT DATA:
    1. User Profile: {app_state['u_soft']}
    2. Scholarship Requirements: {app_state['s_soft']}
    3. user prompt
    
    TASK:
    Write a scholarship essay (200-300 words).
    
    GUIDELINES:
    1. Identify intersections between User Profile and Scholarship Requirements.
    2. Adhere strictly to the user's prompt provided in the input.
    3. Output ONLY the essay text. No filler.
    """

    retry_config = types.HttpRetryOptions(attempts=3, exp_base=2, initial_delay=1)
    
    essay_agent = Agent(
        name="EssayAgent",
        model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
        instruction=instruction_text
    )

    runner = InMemoryRunner(agent=essay_agent)
    
    print(f"Generating essay for prompt: {request.user_prompt}")
    
    with contextlib.redirect_stdout(io.StringIO()):
        # Pass the dynamic prompt as the input to the agent
        response = await runner.run_debug(request.user_prompt)

    final_essay = extract_text_from_response(response)
    
    return {"essay": final_essay}

# --- Main Execution ---
if __name__ == "__main__":
    # Set your Ngrok Auth Token here if you haven't done it via CLI
    ngrok.set_auth_token('2yPMn1U5LqQGUSA8gDEVFk70ZtI_Cq3fGU9CJrkJE16fCPJ2')
    
    # Open a ngrok tunnel to the dev server
    public_url = ngrok.connect(8000).public_url
    print(f"Ngrok Tunnel Active: {public_url}")

    # Start the server
    uvicorn.run(app, host="0.0.0.0", port=8000)
