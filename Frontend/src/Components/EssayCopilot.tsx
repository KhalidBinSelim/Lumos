import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";
import SubscriptionModal from "./SubscriptionModal";
import { Link } from "react-router-dom";

export default function EssayCopilot() {
  const [step, setStep] = useState<1 | 2>(1);
  const [tone, setTone] = useState("Conversational & Personal");
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Mock Data
  const scholarship = {
    title: "Tech Leaders Scholarship",
    requirement: "500-750 words",
    prompt: "Describe a specific way you plan to use technology to create positive social change in your community or the world. Include examples of leadership experiences that have prepared you for this goal."
  };

  const handleGenerate = () => {
    // Mock generation
    setEssayContent(`Growing up as a first-generation college student, I've witnessed firsthand how technology can bridge gaps in education and opportunity. My journey began not with a sleek laptop, but with a shared community center computer where I wrote my first line of code. That moment didn't just teach me syntax; it taught me possibility.

In my community, access to information was a luxury. I saw brilliant minds stifled simply because they lacked the tools to express their potential. This observation sparked my passion for "Tech for All," a student organization I founded in my junior year of high school. We started small, refurbishing donated computers for local families, but the vision was always bigger.

Leadership, to me, isn't about standing in front of a crowd; it's about empowering others to stand beside you. As president of Tech for All, I organized weekend coding workshops for over 50 middle school students. One specific Saturday stands out. A young girl named Maya, who had never touched a keyboard before, created a simple website about her love for gardening. The pride in her eyes was a reflection of the power of digital literacy.

I plan to use technology to scale this impact. My goal is to develop an open-source platform that connects under-resourced schools with tech mentors and hardware donations. By leveraging cloud computing and mobile-first design, we can democratize access to computer science education, ensuring that the next generation of innovators reflects the diversity of our world.

This scholarship would not just support my education; it would invest in a future where technology serves as a ladder for social mobility, rather than a barrier.`);
    setWordCount(245); // Mock count
    setStep(2);
  };

  const handleSkip = () => {
    setEssayContent("");
    setWordCount(0);
    setStep(2);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden font-sans">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          onSubscriptionsClick={() => setShowSubscriptionModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onHelpClick={() => setShowHelpModal(true)}
        />

        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6">
          {/* Background Glow */}
          <div className="absolute inset-0 pointer-events-none sticky top-0">
            <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/10 blur-[200px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/10 blur-[200px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            
            {/* Step 1: Setup */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link to="/applications" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Application
                </Link>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✍️</span>
                    <h1 className="text-xl font-bold text-white">AI ESSAY COPILOT</h1>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">{scholarship.title}</span>
                    <span className="hidden md:block">•</span>
                    <span>Essay Requirement: {scholarship.requirement}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Essay Prompt</h2>
                  <p className="text-lg text-slate-200 italic leading-relaxed">
                    "{scholarship.prompt}"
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">How AI Copilot Works</h2>
                    <ul className="space-y-4">
                      {[
                        "We analyze your profile and the prompt",
                        "AI generates a personalized draft",
                        "You edit and refine to match your voice",
                        "Save multiple versions as you improve"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-sm text-blue-300 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Your authentic story + AI structure = Winning essay
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Writing Style Preference</h2>
                    <div className="space-y-3">
                      {[
                        "Formal & Professional",
                        "Conversational & Personal",
                        "Passionate & Energetic",
                        "Reflective & Thoughtful"
                      ].map((t) => (
                        <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${tone === t ? "bg-blue-600/20 border-blue-500" : "bg-slate-800/50 border-slate-700 hover:border-slate-600"}`}>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${tone === t ? "border-blue-500" : "border-slate-500"}`}>
                            {tone === t && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                          </div>
                          <input 
                            type="radio" 
                            name="tone" 
                            className="hidden" 
                            checked={tone === t} 
                            onChange={() => setTone(t)} 
                          />
                          <span className={`text-sm font-medium ${tone === t ? "text-white" : "text-slate-400"}`}>{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Questions (Optional)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">What tech project are you most proud of?</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-500 outline-none" placeholder="e.g. Built a website for local animal shelter" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">What social issue matters most to you?</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-500 outline-none" placeholder="e.g. Digital literacy in underserved communities" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Skip these if you prefer - AI will use your profile
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button 
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-xl text-slate-400 hover:text-white font-medium transition"
                  >
                    Skip & Write Myself
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 transition flex items-center gap-2"
                  >
                    Generate Draft with AI <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Editor */}
            {step === 2 && (
              <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
                {/* Editor Toolbar */}
                <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-t-2xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition" title="Back">
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="h-6 w-px bg-slate-800 mx-1" />
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-2">
                      <span className="material-symbols-outlined">save</span>
                      <span className="hidden sm:inline text-sm">Save</span>
                    </button>
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition" title="Download">
                      <span className="material-symbols-outlined">download</span>
                    </button>
                    <span className="text-xs text-slate-500 ml-2">Auto-saved 2 min ago ✓</span>
                  </div>
                  <div className="text-sm text-slate-400 hidden md:block">
                    <span className="font-medium text-slate-300">{scholarship.title}</span>
                  </div>
                </div>

                {/* Formatting Bar */}
                <div className="bg-slate-800/50 border-x border-b border-slate-800 p-2 flex items-center gap-1 overflow-x-auto">
                  {["format_bold", "format_italic", "format_underlined", "format_align_left", "format_list_bulleted"].map((icon) => (
                    <button key={icon} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition">
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </button>
                  ))}
                  <div className="h-5 w-px bg-slate-700 mx-2" />
                  <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI Assist ▼
                  </button>
                </div>

                <div className="flex-1 flex overflow-hidden border-x border-slate-800 bg-slate-950/50">
                  {/* Versions Panel (Left) */}
                  <div className="hidden lg:block w-64 border-r border-slate-800 p-4 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Versions</h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-blue-400">Current Draft</span>
                          <span className="text-xs text-blue-300/60">Now</span>
                        </div>
                        <div className="text-xs text-slate-400">{wordCount} words</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-slate-300">Version 1</span>
                          <span className="text-xs text-slate-500">2h ago</span>
                        </div>
                        <div className="text-xs text-slate-500">520 words</div>
                      </div>
                      <button className="w-full py-2 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-medium transition flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span> Save New Version
                      </button>
                    </div>
                  </div>

                  {/* Editor Area (Center) */}
                  <div className="flex-1 flex flex-col relative">
                    <textarea 
                      className="flex-1 w-full bg-transparent p-6 resize-none outline-none text-slate-200 leading-relaxed font-serif text-lg"
                      placeholder="Start writing your essay here..."
                      value={essayContent}
                      onChange={(e) => {
                        setEssayContent(e.target.value);
                        setWordCount(e.target.value.trim().split(/\s+/).length);
                      }}
                    />
                    <div className="absolute bottom-4 right-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 flex items-center gap-3">
                      <span>{wordCount} / 750 words</span>
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((wordCount / 750) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions (Right) */}
                  <div className="hidden xl:block w-72 border-l border-slate-800 p-4 overflow-y-auto bg-slate-900/20">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">lightbulb</span> AI Suggestions
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-yellow-400 text-lg">⚡</span>
                          <span className="text-sm font-medium text-slate-200">Improve Specificity</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Add a concrete example of a "leadership experience" mentioned in paragraph 2.</p>
                        <button className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition">Apply Suggestion</button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-emerald-400 text-lg">🎯</span>
                          <span className="text-sm font-medium text-slate-200">Strengthen Conclusion</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Connect your final thought back to the "social change" theme more explicitly.</p>
                        <button className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition">Apply Suggestion</button>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Essay Analysis</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Prompt Fit</span>
                            <span className="text-emerald-400 font-bold">8.5/10</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Clarity</span>
                            <span className="text-blue-400 font-bold">9/10</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "90%" }} />
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition">
                        Get Detailed Feedback
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Sticky Bar */}
                <div className="bg-slate-900 border-t border-slate-800 p-4 rounded-b-2xl flex items-center justify-between">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition">Preview</button>
                    <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">spellcheck</span> Grammar Check
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-sm font-medium transition">Mark as Complete</button>
                    <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-900/20 flex items-center gap-2">
                      Save & Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Modals */}
      {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
