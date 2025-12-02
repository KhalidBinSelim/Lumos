import React, { useState, useMemo } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

// Types
type ApplicationStatus = "In Progress" | "Submitted" | "Won" | "Rejected";

interface Application {
  id: number;
  title: string;
  amount: number;
  deadline?: string; // For In Progress/Submitted
  submittedDate?: string; // For Submitted
  wonDate?: string; // For Won
  notifiedDate?: string; // For Rejected
  decisionBy?: string;
  status: ApplicationStatus;
  progress?: number;
  org: string;
  requirements?: { label: string; status: "completed" | "pending" | "missing" | "draft"; details?: string }[];
  confirmationNumber?: string;
  nextSteps?: string[];
  awardDetails?: { amount: string; disbursement: string; expected: string };
  feedback?: string;
  notes?: string;
}

// Mock Data
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: "Tech Leaders Scholarship",
    org: "Tech Foundation Inc.",
    amount: 5000,
    deadline: "2024-02-15",
    status: "In Progress",
    progress: 60,
    requirements: [
      { label: "Application form", status: "completed" },
      { label: "Resume", status: "completed" },
      { label: "Essay", status: "draft", details: "450/500 words" },
      { label: "Transcript", status: "missing" },
      { label: "Letter of Rec", status: "pending", details: "1/1" },
    ],
    notes: "Last updated: 2 hours ago",
  },
  {
    id: 2,
    title: "Women in STEM Award",
    org: "Future Innovators",
    amount: 3000,
    deadline: "2024-03-01",
    status: "In Progress",
    progress: 25,
    requirements: [
      { label: "Application form", status: "completed" },
      { label: "Essay", status: "missing" },
      { label: "Research project", status: "missing" },
      { label: "Transcript", status: "missing" },
    ],
    notes: "Last updated: 1 day ago",
  },
  {
    id: 3,
    title: "Community Service Leaders",
    org: "Global Impact Fund",
    amount: 2500,
    deadline: "2024-02-08",
    status: "In Progress",
    progress: 40,
    requirements: [
      { label: "Application form", status: "completed" },
      { label: "Essay", status: "draft", details: "Outline created" },
      { label: "Service hours verification", status: "missing" },
      { label: "Letter of Rec", status: "missing" },
    ],
    notes: "Last updated: 5 days ago",
  },
  {
    id: 4,
    title: "Innovation Grant",
    org: "Tech Forward",
    amount: 10000,
    submittedDate: "2024-01-10",
    decisionBy: "2024-02-28",
    status: "Submitted",
    confirmationNumber: "INV-2024-8572",
    requirements: [
        { label: "Application form", status: "completed" },
        { label: "Essay (750 words)", status: "completed" },
        { label: "Project proposal", status: "completed" },
        { label: "2 Letters of recommendation", status: "completed" },
        { label: "Official transcript", status: "completed" },
    ],
    nextSteps: [
        "Finalists notified: Feb 15",
        "Interviews: Feb 20-25",
        "Winners announced: Feb 28"
    ]
  },
  {
    id: 5,
    title: "Future Leaders Award",
    org: "Leadership Corp",
    amount: 4000,
    submittedDate: "2023-12-20",
    decisionBy: "2024-01-31",
    status: "Submitted",
    confirmationNumber: "FLA-2023-4291",
    nextSteps: [
        "Received - Dec 20",
        "Under Review - Dec 28",
        "Final Review - Jan 15 (Current)",
        "Decision - Jan 31"
    ]
  },
  {
    id: 6,
    title: "Academic Excellence Scholarship",
    org: "Education First",
    amount: 5000,
    wonDate: "2024-01-05",
    status: "Won",
    awardDetails: {
        amount: "$5,000 (one-time)",
        disbursement: "Direct to school",
        expected: "August 2024 (Fall semester)"
    }
  },
  {
    id: 7,
    title: "State Merit Scholarship",
    org: "State Dept of Ed",
    amount: 2000,
    notifiedDate: "2023-12-15",
    status: "Rejected",
    feedback: "Due to high volume of qualified applicants, we were unable to award all deserving students. We encourage you to reapply next year."
  }
];

export default function MyApplications() {
  const [activeTab, setActiveTab] = useState<"All" | ApplicationStatus>("In Progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Deadline");
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null); // ID of app to delete
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // ID of app with open dropdown

  // Filter & Sort Logic
  const filteredApps = useMemo(() => {
    let apps = MOCK_APPLICATIONS;

    if (activeTab !== "All") {
      apps = apps.filter(app => app.status === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      apps = apps.filter(app => app.title.toLowerCase().includes(q) || app.org.toLowerCase().includes(q));
    }

    return apps.sort((a, b) => {
        // Simple mock sort logic
        if (sortOption === "Deadline") {
            return (new Date(a.deadline || a.decisionBy || "2099-12-31").getTime()) - (new Date(b.deadline || b.decisionBy || "2099-12-31").getTime());
        }
        if (sortOption === "Amount") {
            return b.amount - a.amount;
        }
        return 0;
    });
  }, [activeTab, searchQuery, sortOption]);

  const stats = useMemo(() => {
    return {
        total: MOCK_APPLICATIONS.length,
        inProgress: MOCK_APPLICATIONS.filter(a => a.status === "In Progress").length,
        submitted: MOCK_APPLICATIONS.filter(a => a.status === "Submitted").length,
        won: MOCK_APPLICATIONS.filter(a => a.status === "Won").length,
        rejected: MOCK_APPLICATIONS.filter(a => a.status === "Rejected").length,
        wonAmount: MOCK_APPLICATIONS.filter(a => a.status === "Won").reduce((acc, curr) => acc + curr.amount, 0)
    };
  }, []);

  const getDaysLeft = (dateStr?: string) => {
      if (!dateStr) return 0;
      const diff = new Date(dateStr).getTime() - new Date().getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleDelete = () => {
      alert(`Deleted application ${showDeleteModal}`);
      setShowDeleteModal(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden font-sans">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6" onClick={() => setOpenDropdown(null)}>
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none sticky top-0">
                <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/10 blur-[200px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/10 blur-[200px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-6">
                
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">My Applications</h1>
                    <p className="text-slate-400">Track and manage your scholarship applications</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-sm mb-1">Total Applications</div>
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-sm mb-1">In Progress</div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-sm mb-1">Submitted</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.submitted}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-sm mb-1">Won</div>
                        <div className="text-2xl font-bold text-emerald-400">{stats.won} <span className="text-sm font-normal text-slate-400">(${stats.wonAmount.toLocaleString()})</span></div>
                    </div>
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 border border-slate-800 p-2 rounded-2xl">
                    <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide">
                        {(["All", "In Progress", "Submitted", "Won", "Rejected"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${activeTab === tab ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                            >
                                {tab} <span className="ml-1 opacity-60 text-xs">
                                    ({tab === "All" ? stats.total : tab === "In Progress" ? stats.inProgress : tab === "Submitted" ? stats.submitted : tab === "Won" ? stats.won : stats.rejected})
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-lg">search</span>
                            <input 
                                type="text" 
                                placeholder="Search apps..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none cursor-pointer"
                        >
                            <option>Deadline</option>
                            <option>Amount</option>
                            <option>Progress</option>
                        </select>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApps.length > 0 ? (
                        filteredApps.map((app) => (
                            <div key={app.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative group hover:border-slate-700 transition">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{app.title}</h3>
                                        <div className="flex items-center gap-3 text-sm mt-1">
                                            <span className="text-emerald-400 font-medium">💰 ${app.amount.toLocaleString()}</span>
                                            <span className="text-slate-500">•</span>
                                            <span className="text-slate-300">
                                                {app.status === "In Progress" && `📅 Due: ${new Date(app.deadline!).toLocaleDateString(undefined, {month:'short', day:'numeric'})} (${getDaysLeft(app.deadline)} days)`}
                                                {app.status === "Submitted" && `📅 Submitted: ${new Date(app.submittedDate!).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}`}
                                                {app.status === "Won" && `🏆 Won: ${new Date(app.wonDate!).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}`}
                                                {app.status === "Rejected" && `❌ Notified: ${new Date(app.notifiedDate!).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === app.id ? null : app.id); }}
                                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openDropdown === app.id && (
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                <div className="py-1">
                                                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                                                        <span>📧</span> Email to Myself
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                                                        <span>📋</span> Duplicate Application
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                                                        <span>🗓️</span> Set Custom Reminder
                                                    </button>
                                                    <div className="h-px bg-slate-800 my-1" />
                                                    <button className="w-full px-4 py-2 text-left text-sm text-amber-400 hover:bg-slate-800 flex items-center gap-2">
                                                        <span>⏸️</span> Pause Application
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowDeleteModal(app.id)}
                                                        className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                                                    >
                                                        <span>🗑️</span> Delete Application
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body based on Status */}
                                {app.status === "In Progress" && (
                                    <>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">Progress</span>
                                                <span className="text-white font-medium">{app.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${app.progress}%` }} />
                                            </div>
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                In Progress
                                                {getDaysLeft(app.deadline) < 7 && <span className="ml-1 text-rose-400 font-bold">- Urgent!</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            {app.requirements?.map((req, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm">
                                                    <span className="mt-0.5">
                                                        {req.status === "completed" ? "✅" : req.status === "draft" ? "🟡" : "❌"}
                                                    </span>
                                                    <div className="flex-1">
                                                        <span className={`text-slate-300 ${req.status === "completed" ? "line-through opacity-60" : ""}`}>{req.label}</span>
                                                        {req.details && <span className="text-slate-500 ml-2 text-xs">({req.details})</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {app.status === "Submitted" && (
                                    <>
                                        <div className="mb-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Submitted - Under Review
                                            </div>
                                            <div className="text-sm text-slate-300">
                                                Decision by: <span className="text-white font-medium">{new Date(app.decisionBy!).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-4">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requirements Submitted</div>
                                            <ul className="space-y-1">
                                                {app.requirements?.map((req, i) => (
                                                    <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                        {req.label}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Confirmation #: <span className="text-slate-300 font-mono">{app.confirmationNumber}</span></span>
                                                <button className="text-blue-400 hover:text-blue-300">📧 Email</button>
                                            </div>
                                        </div>

                                        {app.nextSteps && (
                                            <div className="mb-4">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Application Status Timeline</div>
                                                <div className="space-y-2">
                                                    {app.nextSteps.map((step, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                            <span>{i === 0 || i === 1 ? "✅" : i === 2 ? "🟡" : "⏳"}</span>
                                                            {step}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {app.status === "Won" && (
                                    <>
                                        <div className="mb-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">🎉</span>
                                                <span className="font-bold text-emerald-400">Awarded!</span>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Amount:</span>
                                                    <span className="text-white font-medium">{app.awardDetails?.amount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Disbursement:</span>
                                                    <span className="text-white font-medium">{app.awardDetails?.disbursement}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Expected:</span>
                                                    <span className="text-white font-medium">{app.awardDetails?.expected}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps Required</div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800" /> Accept award by Jan 31, 2024
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800" /> Complete W-9 form
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <span className="text-emerald-400">✓</span> Thank you letter sent
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {app.status === "Rejected" && (
                                    <>
                                        <div className="mb-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-400 mb-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                Not Selected
                                            </div>
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                <p className="text-slate-400 text-sm italic">"{app.feedback}"</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">What's Next?</div>
                                            <div className="flex flex-wrap gap-2">
                                                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition">Find Similar Scholarships</button>
                                                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition">Set Reapplication Reminder</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                                    <span className="text-xs text-slate-500">{app.notes || `Last updated: ${new Date().toLocaleDateString()}`}</span>
                                    <div className="flex gap-3">
                                        {app.status === "In Progress" && (
                                            <>
                                                <Link to="/details" className="text-sm font-medium text-slate-300 hover:text-white transition">View Details</Link>
                                                <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition">Continue Application</button>
                                            </>
                                        )}
                                        {app.status === "Submitted" && (
                                            <>
                                                <button className="text-sm font-medium text-slate-300 hover:text-white transition">Track Status</button>
                                                <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition">View Submission</button>
                                            </>
                                        )}
                                        {app.status === "Won" && (
                                            <>
                                                <Link to="/details" className="text-sm font-medium text-slate-300 hover:text-white transition">View Details</Link>
                                                <button className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition">Accept Award</button>
                                            </>
                                        )}
                                        {app.status === "Rejected" && (
                                            <>
                                                <button className="text-sm font-medium text-slate-300 hover:text-white transition">Archive</button>
                                                <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition">View Submission</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 rounded-3xl border border-slate-800 bg-slate-900/30 border-dashed">
                            <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                                <span className="text-4xl">📝</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Applications Found</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-6">
                                {activeTab === "All" 
                                    ? "Start applying to scholarships to see them here. We'll track your progress and remind you of deadlines."
                                    : `You don't have any applications in the "${activeTab}" status.`
                                }
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link to="/discovery" className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-900/20">
                                    Discover Scholarships →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* Delete Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-2">Delete Application?</h3>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
                        <p className="text-rose-400 font-medium mb-2">⚠️ This will permanently delete:</p>
                        <ul className="list-disc list-inside text-sm text-rose-300/80 space-y-1">
                            <li>All progress and drafts</li>
                            <li>Essay drafts</li>
                            <li>Uploaded documents</li>
                            <li>Checklist data</li>
                        </ul>
                        <p className="text-xs text-rose-400 mt-3 font-medium">This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowDeleteModal(null)}
                            className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="flex-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-lg shadow-rose-900/20"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
