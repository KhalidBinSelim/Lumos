import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { scholarshipsApi } from "../api/scholarships";
import type { Scholarship } from "../api/scholarships";

interface TopMatchScholarship {
  id: string;
  title: string;
  amount: string;
  date: string;
  match: string;
  color: string;
}

export default function Home() {
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user || "{}");

  // Check if welcome was previously dismissed
  const wasDismissed = localStorage.getItem("welcomeDismissed") === "true";
  const [showWelcome, setShowWelcome] = useState(!wasDismissed);

  const [topMatches, setTopMatches] = useState<TopMatchScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-hide welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome && !wasDismissed) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem("welcomeDismissed", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome, wasDismissed]);

  // Handle manual dismissal
  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("welcomeDismissed", "true");
  };

  useEffect(() => {
    const fetchTopMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use recommended if user is authenticated, otherwise use featured
        const token = localStorage.getItem("token");
        let response;

        if (token && userObject?.id) {
          // Get recommended scholarships (top matches based on user profile)
          response = await scholarshipsApi.getRecommendedScholarships(2);
        } else {
          // Get featured scholarships
          response = await scholarshipsApi.getFeaturedScholarships(2);
        }

        // Transform API response to match component format
        const transformed: TopMatchScholarship[] = response.data.map((sch: Scholarship) => {
          const matchScore = sch.match || sch.matchScore || 0;

          // Determine color based on match score
          let color = "from-[var(--color-primary-400)] to-[var(--color-primary-500)]";
          if (matchScore >= 90) {
            color = "from-green-500 to-emerald-400";
          } else if (matchScore >= 80) {
            color = "from-[var(--color-primary-400)] to-[var(--color-primary-500)]";
          } else {
            color = "from-pink-500 to-rose-400";
          }

          // Format amount
          const amountStr = sch.amountDisplay || `$${sch.amount.toLocaleString()}`;

          // Format date
          const deadlineDate = new Date(sch.deadline);
          const dateStr = deadlineDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return {
            id: sch._id,
            title: sch.title,
            amount: amountStr,
            date: dateStr,
            match: `${matchScore}%`,
            color: color,
          };
        });

        setTopMatches(transformed);
      } catch (err: any) {
        console.error("Error fetching top matches:", err);
        setError(err.message || "Failed to load top matches");
        // Fallback to empty array or show error state
        setTopMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMatches();
  }, [userObject?.id]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden transition-colors duration-300">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto relative p-8">
          {/* background glow */}
          <div className="absolute inset-0">
            <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/20 blur-[200px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/20 blur-[200px] rounded-full" />
          </div>

          {/* content container */}
          <div className="relative z-10 space-y-8">
            {/* Welcome / header card */}
            {showWelcome && (
              <section className="rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 shadow-[0_0_40px_-10px_var(--color-primary-500)/20] backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                      Welcome back!
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-sm text-left">
                      Last login: Today at 9:32 AM
                    </p>
                  </div>
                  <button
                    onClick={handleDismissWelcome}
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white text-sm font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_-5px_var(--color-primary-500)/60] transition"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </section>
            )}

            {/* Stats */}
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: "monetization_on",
                  title: "Potential Awards",
                  value: "$142.5K",
                  color: "from-[var(--color-primary-500)] to-[var(--color-primary-400)]",
                },
                {
                  icon: "bookmarks",
                  title: "Saved Scholarships",
                  value: "12",
                  color: "from-green-500 to-emerald-400",
                },
                {
                  icon: "schedule",
                  title: "Deadlines This Week",
                  value: "5",
                  color: "from-orange-400 to-amber-300",
                },
              ].map((stat) => (
                <div
                  key={stat.title}
                  className="group rounded-2xl p-6 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 hover:border-[var(--color-primary-500)]/40 hover:shadow-[0_0_30px_-12px_var(--color-primary-500)/60] transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-105 transition`}
                  >
                    <span className="material-symbols-outlined">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {stat.value}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-sm">{stat.title}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Action Required */}
            <section className="rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 shadow-[0_0_40px_-15px_var(--color-primary-500)/40] backdrop-blur-md space-y-5">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">⚠️ Actions Required</h2>

              <div className="grid gap-4">
                {[
                  {
                    title: "Smith Scholarship - Due in 3 days",
                    detail: "Essay draft at 60% • Missing: LOR",
                    btn: "Continue Application →",
                    color: "from-[var(--color-primary-100)] to-[var(--color-primary-700)]",
                    link: "/essay-copilot2",
                  },
                  {
                    title: "Johnson Grant - Incomplete Profile",
                    detail: "Add GPA to qualify",
                    btn: "Update Profile →",
                    color: "from-[var(--color-primary-600)] to-[var(--color-secondary-500)]",
                  },
                ].map((action) => (
                  <div
                    key={action.title}
                    className="flex flex-col sm:flex-row justify-between border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 rounded-2xl p-5 hover:border-[var(--color-primary-500)]/40 transition"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">{action.title}</p>
                      <p className="text-[var(--color-text-secondary)] text-sm">{action.detail}</p>
                    </div>
                    {action.link ? (
                      <Link
                        to={action.link}
                        className={`mt-3 sm:mt-0 px-5 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${action.color} hover:scale-[1.03] transition text-center whitespace-nowrap`}
                      >
                        {action.btn}
                      </Link>
                    ) : (
                      <button
                        className={`mt-3 sm:mt-0 px-5 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${action.color} hover:scale-[1.03] transition`}
                      >
                        {action.btn}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Top Matches */}
            <section className="rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 shadow-[0_0_40px_-12px_var(--color-primary-500)/30]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  🔥 Top Matches For You
                </h2>
                <Link
                  to="/discovery"
                  className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] text-sm"
                >
                  View All →
                </Link>
              </div>

              {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border)] p-6 animate-pulse"
                    >
                      <div className="h-6 bg-[var(--color-bg-primary)] rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-[var(--color-bg-primary)] rounded w-1/2 mb-3"></div>
                      <div className="h-6 bg-[var(--color-bg-primary)] rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  <p className="mb-4">⚠️ {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg bg-[var(--color-primary-500)] text-white text-sm hover:bg-[var(--color-primary-600)] transition"
                  >
                    Retry
                  </button>
                </div>
              ) : topMatches.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  <p>No top matches found. Check back later!</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {topMatches.map((sch) => (
                    <div
                      key={sch.id}
                      className="rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border)] hover:border-[var(--color-primary-500)]/40 p-6 transition shadow-inner"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[var(--color-text-primary)]">
                            {sch.title}
                          </h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            💰 {sch.amount} • 📅 Due: {sch.date}
                          </p>
                          <div
                            className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${sch.color} text-white`}
                          >
                            ⭐ {sch.match} Match
                          </div>
                        </div>
                        <button className="material-symbols-outlined text-pink-500">
                          favorite
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-5">
                        <Link
                          to={`/details/${sch.id}`}
                          onClick={() => localStorage.setItem('scholarshipId', sch.id)}
                          className="px-4 py-2 rounded-full bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border)]"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/essay-copilot"
                          className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-200)] hover:bg-[var(--color-primary-800)] text-white text-sm font-medium text-center"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Summary */}
            <section className="rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 backdrop-blur-md shadow-[0_0_40px_-15px_var(--color-primary-500)/40] text-left">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-5">📊 Recent Activity</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-[var(--color-text-secondary)]">
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Today</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Saved 2 new scholarships</li>
                    <li>Essay draft updated for Smith Scholarship</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Yesterday</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Started Tech Leaders application</li>
                    <li>Found 5 new matches</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-[var(--color-text-secondary)] text-sm pt-8 pb-6 border-t border-[var(--color-border)]">
              Need help?{" "}
              <a href="#" className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)]">
                Chat with us
              </a>{" "}
              •{" "}
              <a href="#" className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)]">
                FAQs
              </a>{" "}
              •{" "}
              <a href="#" className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)]">
                Tutorials
              </a>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
