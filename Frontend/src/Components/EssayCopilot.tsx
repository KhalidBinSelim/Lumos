import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

export default function EssayCopilot() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [tone, setTone] = useState("Conversational & Personal");
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  
  // Mock Data
  const scholarship = {
    title: "Tech Leaders Scholarship",
    requirement: "500-750 words",
    prompt: "Describe a specific way you plan to use technology to create positive social change in your community or the world. Include examples of leadership experiences that have prepared you for this goal."
  };

  const handleGenerate = () => {
    navigate('/essay-copilot2');
  };

  const handleSkip = () => {
    setEssayContent("");
    setWordCount(0);
    setStep(2);
  };

  return (
    <DashboardLayout>
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none sticky top-0">
        <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6">
        
        {/* Step 1: Setup */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link to="/applications" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition mb-4">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Application
            </Link>

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✍️</span>
                <h1 className="text-xl font-bold text-[var(--color-text-primary)]">AI ESSAY COPILOT</h1>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-[var(--color-text-secondary)] text-sm">
                <span className="font-medium text-[var(--color-text-primary)]">{scholarship.title}</span>
                <span className="hidden md:block">•</span>
                <span>Essay Requirement: {scholarship.requirement}</span>
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Essay Prompt</h2>
              <p className="text-lg text-[var(--color-text-primary)] italic leading-relaxed">
                "{scholarship.prompt}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">How AI Copilot Works</h2>
                <ul className="space-y-4">
                  {[
                    "We analyze your profile and the prompt",
                    "AI generates a personalized draft",
                    "You edit and refine to match your voice",
                    "Save multiple versions as you improve"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--color-text-primary)]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-3 bg-[var(--color-primary-500)]/10 rounded-xl border border-[var(--color-primary-500)]/20 text-sm text-[var(--color-primary-500)] flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Your authentic story + AI structure = Winning essay
                </div>
              </div>

              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Writing Style Preference</h2>
                <div className="space-y-3">
                  {[
                    "Formal & Professional",
                    "Conversational & Personal",
                    "Passionate & Energetic",
                    "Reflective & Thoughtful"
                  ].map((t) => (
                    <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${tone === t ? "bg-[var(--color-primary-500)]/20 border-[var(--color-primary-500)]" : "bg-[var(--color-bg-primary)]/50 border-[var(--color-border)] hover:border-[var(--color-text-secondary)]"}`}>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${tone === t ? "border-[var(--color-primary-500)]" : "border-[var(--color-text-secondary)]"}`}>
                        {tone === t && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-500)]" />}
                      </div>
                      <input 
                        type="radio" 
                        name="tone" 
                        className="hidden" 
                        checked={tone === t} 
                        onChange={() => setTone(t)} 
                      />
                      <span className={`text-sm font-medium ${tone === t ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Quick Questions (Optional)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">What tech project are you most proud of?</label>
                  <input type="text" className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] outline-none" placeholder="e.g. Built a website for local animal shelter" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">What social issue matters most to you?</label>
                  <input type="text" className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] outline-none" placeholder="e.g. Digital literacy in underserved communities" />
                </div>
              </div>
              <div className="mt-4 text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                Skip these if you prefer - AI will use your profile
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button 
                onClick={handleSkip}
                className="px-6 py-3 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition"
              >
                Skip & Write Myself
              </button>
              <button 
                onClick={handleGenerate}
                className="px-8 py-3 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white font-bold shadow-lg shadow-[var(--color-primary-500)]/20 transition flex items-center gap-2"
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
            <div className="flex items-center justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-t-2xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition" title="Back">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="h-6 w-px bg-[var(--color-border)] mx-1" />
                <button className="p-2 hover:bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition flex items-center gap-2">
                  <span className="material-symbols-outlined">save</span>
                  <span className="hidden sm:inline text-sm">Save</span>
                </button>
                <button className="p-2 hover:bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition" title="Download">
                  <span className="material-symbols-outlined">download</span>
                </button>
                <span className="text-xs text-[var(--color-text-secondary)] ml-2">Auto-saved 2 min ago ✓</span>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] hidden md:block">
                <span className="font-medium text-[var(--color-text-primary)]">{scholarship.title}</span>
              </div>
            </div>

            {/* Formatting Bar */}
            <div className="bg-[var(--color-bg-primary)]/50 border-x border-b border-[var(--color-border)] p-2 flex items-center gap-1 overflow-x-auto">
              {["format_bold", "format_italic", "format_underlined", "format_align_left", "format_list_bulleted"].map((icon) => (
                <button key={icon} className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
              <div className="h-5 w-px bg-[var(--color-border)] mx-2" />
              <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-medium transition">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI Assist ▼
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden border-x border-[var(--color-border)] bg-[var(--color-bg-primary)]/50">
              {/* Versions Panel (Left) */}
              <div className="hidden lg:block w-64 border-r border-[var(--color-border)] p-4 overflow-y-auto">
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Versions</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/30 cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-[var(--color-primary-500)]">Current Draft</span>
                      <span className="text-xs text-[var(--color-primary-500)]/60">Now</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{wordCount} words</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-secondary)] cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Version 1</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">2h ago</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">520 words</div>
                  </div>
                  <button className="w-full py-2 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)] text-xs font-medium transition flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span> Save New Version
                  </button>
                </div>
              </div>

              {/* Editor Area (Center) */}
              <div className="flex-1 flex flex-col relative">
                <textarea 
                  className="flex-1 w-full bg-transparent p-6 resize-none outline-none text-[var(--color-text-primary)] leading-relaxed font-serif text-lg"
                  placeholder="Start writing your essay here..."
                  value={essayContent}
                  onChange={(e) => {
                    setEssayContent(e.target.value);
                    setWordCount(e.target.value.trim().split(/\s+/).length);
                  }}
                />
                <div className="absolute bottom-4 right-6 bg-[var(--color-bg-secondary)] backdrop-blur-md border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-secondary)] flex items-center gap-3">
                  <span>{wordCount} / 750 words</span>
                  <div className="w-20 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary-500)] rounded-full" style={{ width: `${Math.min((wordCount / 750) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* AI Suggestions (Right) */}
              <div className="hidden xl:block w-72 border-l border-[var(--color-border)] p-4 overflow-y-auto bg-[var(--color-bg-secondary)]/20">
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lightbulb</span> AI Suggestions
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">⚡</span>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Improve Specificity</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3">Add a concrete example of a "leadership experience" mentioned in paragraph 2.</p>
                    <button className="w-full py-1.5 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-xs text-[var(--color-text-primary)] transition">Apply Suggestion</button>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-[var(--color-primary-500)] text-lg">🎯</span>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Strengthen Conclusion</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3">Connect your final thought back to the "social change" theme more explicitly.</p>
                    <button className="w-full py-1.5 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-xs text-[var(--color-text-primary)] transition">Apply Suggestion</button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                  <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Essay Analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--color-text-secondary)]">Prompt Fit</span>
                        <span className="text-[var(--color-primary-500)] font-bold">8.5/10</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary-500)] rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--color-text-secondary)]">Clarity</span>
                        <span className="text-[var(--color-primary-500)] font-bold">9/10</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary-500)] rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] text-xs font-medium transition">
                    Get Detailed Feedback
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Bar */}
            <div className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] p-4 rounded-b-2xl flex items-center justify-between">
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm font-medium transition">Preview</button>
                <button className="px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm font-medium transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">spellcheck</span> Grammar Check
                </button>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm font-medium transition">Mark as Complete</button>
                <button className="px-6 py-2 rounded-lg bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20 flex items-center gap-2">
                  Save & Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
