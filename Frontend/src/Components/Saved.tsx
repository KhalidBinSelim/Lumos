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
    <div className="flex flex-col h-screen w-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden font-sans transition-colors duration-300">
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
            <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Saved Scholarships</h1>
              <p className="text-[var(--color-text-secondary)]">Manage your saved opportunities</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] material-symbols-outlined">
                search
              </span>
              <input
                type="text"
                placeholder="Search saved..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] outline-none transition"
              />
            </div>

            {/* List */}
            <div className="grid gap-4">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="group relative bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-primary-500)]/30 hover:bg-[var(--color-bg-secondary)]/80 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-500)] transition">
                              {scholarship.title}
                            </h3>
                            <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                              {scholarship.org}
                            </p>
                          </div>
                          <button className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-primary-500)] hover:text-[var(--color-text-primary)] transition">
                            <span className="material-symbols-outlined fill-current">
                              bookmark
                            </span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                            <span className="text-[var(--color-primary-500)]">💰</span>
                            <span className="font-semibold">
                              ${scholarship.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                            <span className="text-[var(--color-primary-500)]">📅</span>
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
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                              ⭐ {scholarship.match}% Match
                            </span>
                            <div className="flex-1 h-2 bg-[var(--color-bg-primary)] rounded-full max-w-[150px] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  scholarship.match >= 80
                                    ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]"
                                    : "bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-500)]"
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
                          className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-medium transition text-center flex items-center justify-center border border-[var(--color-border)]"
                        >
                          View Details
                        </Link>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20 text-center">
                          Start Application
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 border-dashed">
                  <div className="inline-flex p-4 rounded-full bg-[var(--color-bg-primary)]/50 mb-4">
                    <span className="text-4xl">🔖</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                    No Saved Scholarships
                  </h3>
                  <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                    You haven't saved any scholarships yet. Browse the discovery
                    page to find opportunities.
                  </p>
                  <Link
                    to="/discovery"
                    className="px-6 py-2 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20"
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
