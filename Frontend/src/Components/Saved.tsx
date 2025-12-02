import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";
import SubscriptionModal from "./SubscriptionModal";
import { Link } from "react-router-dom";

// Mock Data
const SAVED_SCHOLARSHIPS = [
  {
    id: 1,
    title: "Tech Leaders Scholarship",
    org: "Tech Foundation Inc.",
    amount: 5000,
    deadline: "2024-02-15",
    match: 89,
    tags: ["CS major", "3.8 GPA", "First-gen"],
    requirements: ["Essay (500w)", "Transcript", "1 LOR"],
    saved: true,
  },
  {
    id: 4,
    title: "NextGen Coding Grant",
    org: "DevWorld",
    amount: 1000,
    deadline: "2024-04-10",
    match: 95,
    tags: ["Coding", "Project-based"],
    requirements: ["GitHub Portfolio"],
    saved: true,
  },
];

export default function Saved() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const filteredScholarships = SAVED_SCHOLARSHIPS.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-white">Saved Scholarships</h1>
              <p className="text-slate-400">Manage your saved opportunities</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">
                search
              </span>
              <input
                type="text"
                placeholder="Search saved..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* List */}
            <div className="grid gap-4">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                              {scholarship.title}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                              {scholarship.org}
                            </p>
                          </div>
                          <button className="p-2 rounded-full hover:bg-slate-800 text-blue-400 hover:text-white transition">
                            <span className="material-symbols-outlined fill-current">
                              bookmark
                            </span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <span className="text-emerald-400">💰</span>
                            <span className="font-semibold">
                              ${scholarship.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <span className="text-blue-400">📅</span>
                            <span>
                              {new Date(scholarship.deadline).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-medium text-slate-300">
                              ⭐ {scholarship.match}% Match
                            </span>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full max-w-[150px] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  scholarship.match >= 80
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500"
                                }`}
                                style={{ width: `${scholarship.match}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                        <Link
                          to="/details"
                          className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition text-center flex items-center justify-center"
                        >
                          View Details
                        </Link>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-900/20 text-center">
                          Start Application
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 rounded-3xl border border-slate-800 bg-slate-900/30 border-dashed">
                  <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                    <span className="text-4xl">🔖</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Saved Scholarships
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6">
                    You haven't saved any scholarships yet. Browse the discovery
                    page to find opportunities.
                  </p>
                  <Link
                    to="/discovery"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-900/20"
                  >
                    Discover Scholarships →
                  </Link>
                </div>
              )}
            </div>
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
