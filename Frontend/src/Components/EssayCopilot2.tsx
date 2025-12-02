import { useState } from 'react';
import { 
  Plus, CheckCircle, ChevronDown, Search, 
  Bell, User, ArrowRight, FileText, Send, Bot, User as UserIcon,
  ChevronLeft, Save, Download, Bold, Italic, Underline, AlignLeft, List, Sparkles, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EssayCopilot2() {
  const [activeVersion, setActiveVersion] = useState('current');
  const [wordCount, setWordCount] = useState(545);
  const [targetWordCount, setTargetWordCount] = useState(750);
  
  // Mock Data
  const versions = [
    { id: 'current', label: 'Current Draft', words: 545, time: 'Just now', active: true },
    { id: 'v1', label: 'Version 1 (Original)', words: 520, time: '2 hours ago', active: false },
  ];

  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hi! I'm your essay copilot. How can I help you improve your draft today?" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg = { id: Date.now(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // Mock AI response
    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, role: 'ai', text: "That's a great point! You could expand on that by providing a specific example from your experience." };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans overflow-hidden transition-colors duration-300">
      
      {/* --- HEADER (Fixed) --- */}
      <header className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)] h-16 flex items-center px-6 justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-[var(--color-primary-500)]">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary-500)]/20">
              <span className="material-symbols-outlined text-lg">school</span>
            </div>
            Lumos
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-sm focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent outline-none w-64 transition-all placeholder-[var(--color-text-secondary)]/50 text-[var(--color-text-primary)]"
            />
          </div>
          <button className="relative p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[var(--color-bg-primary)]"></span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer p-1 pr-2 hover:bg-[var(--color-bg-secondary)] rounded-full border border-transparent hover:border-[var(--color-border)] transition-all">
            <div className="w-8 h-8 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-[var(--color-primary-600)] font-bold">JD</div>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </div>
        </div>
      </header>

      {/* --- EDITOR TOOLBAR --- */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-6 w-px bg-[var(--color-border)]"></div>
            <div className="flex items-center gap-2">
                <button className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors" title="Save">
                    <Save className="w-4 h-4" />
                </button>
                <button className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                </button>
                <span className="text-xs text-[var(--color-text-secondary)] ml-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Auto-saved 2 min ago
                </span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="text-sm font-bold text-[var(--color-text-primary)]">Tech Leaders Scholarship</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Essay Prompt • 500-750 words</div>
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]"></div>
             {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 bg-[var(--color-bg-primary)] p-1 rounded-lg border border-[var(--color-border)]">
                <button className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-[var(--color-border)] mx-1"></div>
                <button className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors flex items-center gap-1">
                    <AlignLeft className="w-4 h-4" /> <ChevronDown className="w-3 h-3" />
                </button>
                <button className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors"><List className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-[var(--color-border)] mx-1"></div>
                <button className="px-2 py-1.5 text-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 hover:bg-[var(--color-primary-500)]/20 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                    <Sparkles className="w-3 h-3" /> AI Assist <ChevronDown className="w-3 h-3" />
                </button>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (3-Column Grid) --- */}
      <div className="flex-1 overflow-hidden flex">
        
        {/* LEFT: VERSIONS PANEL */}
        <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col">
            <div className="p-4 border-b border-[var(--color-border)]">
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Versions</h3>
                
                <div className="space-y-3">
                    {versions.map(v => (
                        <div key={v.id} className={`p-3 rounded-xl border transition-all cursor-pointer ${v.active ? 'bg-[var(--color-bg-primary)] border-[var(--color-primary-500)] shadow-sm' : 'border-transparent hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-border)]'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-semibold ${v.active ? 'text-[var(--color-primary-500)]' : 'text-[var(--color-text-primary)]'}`}>
                                    {v.label === 'Current Draft' ? '📝 Current Draft' : '📄 Version 1'}
                                </span>
                                {v.active && <span className="w-2 h-2 rounded-full bg-[var(--color-primary-500)] mt-1.5"></span>}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)] mb-2">{v.words} words • {v.time}</div>
                            <div className="flex gap-2">
                                {v.active ? (
                                    <button className="text-xs bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] px-2 py-1 rounded font-medium hover:bg-[var(--color-primary-500)]/20 transition-colors w-full">Edit</button>
                                ) : (
                                    <>
                                        <button className="text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] px-2 py-1 rounded hover:text-[var(--color-text-primary)] transition-colors flex-1">View</button>
                                        <button className="text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] px-2 py-1 rounded hover:text-[var(--color-text-primary)] transition-colors flex-1">Restore</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 py-2 border border-dashed border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-500)] transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-3 h-3" /> Save New Version
                </button>
            </div>
        </div>

        {/* CENTER: EDITOR AREA */}
        <div className="flex-1 bg-[var(--color-bg-primary)] relative flex flex-col">
            {/* Editor Canvas */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="max-w-3xl mx-auto bg-[var(--color-bg-secondary)]/30 min-h-[800px] p-8 md:p-12 rounded-xl border border-[var(--color-border)] shadow-sm">
                    <p className="text-[var(--color-text-primary)] text-lg leading-relaxed outline-none" contentEditable suppressContentEditableWarning>
                        Growing up as a first-generation college student, I've witnessed firsthand how technology can bridge gaps in education and opportunity. My journey began not in a high-tech lab, but in a small community library where I accessed the internet for the first time. That glowing screen wasn't just a portal to information; it was a window to a future I hadn't dared to imagine.
                        <br/><br/>
                        As I delved deeper into computer science, I realized that code is more than just syntax and logic—it's a language of empowerment. I started a coding club at my local high school, aiming to demystify technology for students who, like me, felt like outsiders in the digital world. We started with simple HTML pages, but soon moved on to building apps that solved real community problems, like a ride-share coordinator for elderly residents.
                        <br/><br/>
                        Leading this initiative taught me that true innovation isn't just about building the fastest algorithm, but about building solutions that are accessible and inclusive. I want to use my degree to develop educational software that adapts to different learning styles, ensuring that no student is left behind due to a lack of resources or personalized attention.
                        <br/><br/>
                        Receiving the Tech Leaders Scholarship would not only alleviate the financial burden of my tuition but also connect me with a network of mentors who share my vision. I am committed to paying this opportunity forward, continuing to mentor young students and advocating for diversity in the tech industry.
                    </p>
                </div>
            </div>

            {/* Word Count Floating Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-bg-secondary)]/90 backdrop-blur-md border border-[var(--color-border)] px-6 py-3 rounded-full shadow-xl flex items-center gap-6 z-20">
                <div className="flex flex-col">
                    <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                        <span>Word Count</span>
                        <span>{wordCount} / {targetWordCount}</span>
                    </div>
                    <div className="w-32 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-400)] rounded-full" style={{ width: `${(wordCount / targetWordCount) * 100}%` }}></div>
                    </div>
                </div>
                <div className="h-8 w-px bg-[var(--color-border)]"></div>
                <div className="text-xs font-medium text-[var(--color-text-secondary)]">
                    <span className="text-emerald-500 font-bold">73%</span> of target
                </div>
            </div>
            <div className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" /> Preview
            </button>
            <button className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Run Grammar Check
            </button>
        </div>
        <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors">
                Mark as Complete
            </button>
            <button className="px-6 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg text-sm font-bold shadow-lg shadow-[var(--color-primary-500)]/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Save <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>
        </div>

        {/* RIGHT: AI CHAT */}
        <div className="w-80 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] flex flex-col">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />
                <h3 className="font-bold text-[var(--color-text-primary)]">AI Copilot</h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                            {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                            msg.role === 'user' 
                            ? 'bg-[var(--color-primary-500)] text-white rounded-tr-none' 
                            : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask for suggestions..." 
                        className="w-full pl-4 pr-10 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-xs text-center text-[var(--color-text-secondary)] mt-2 opacity-70">
                    AI can make mistakes. Review generated text.
                </div>
            </div>
        </div>

      </div>

      {/* --- BOTTOM BAR (Sticky) --- */}
      

    </div>
  );
}
