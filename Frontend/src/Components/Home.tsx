import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Subscriptions from "./Subscriptions";
import CheckoutPage from "./CheckoutPage";
import PaymentSuccess from "./PaymentSuccess";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";

export default function Home() {
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "semiannual">("monthly");

  const scholarship_id = localStorage.setItem("scholarship_id", "692f060dd6f40252a7bd99c7");

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSubscriptionsClick={() => setShowSubscriptionsModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onHelpClick={() => setShowHelpModal(true)}
        />

        <main className="flex-1 overflow-y-auto relative p-8">
          {/* background glow */}
          <div className="absolute inset-0">
            <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/30 blur-[200px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/30 blur-[200px] rounded-full" />
          </div>

          {/* content container */}
          <div className="relative z-10 space-y-8">
            {/* Welcome / header card */}
            <section className="rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/30 shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)] backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Welcome back, Khalid!
                  </h1>
                  <p className="text-slate-400 text-sm text-left">
                    Last login: Today at 9:32 AM
                  </p>
                </div>
                <button className="px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)] transition">
                  ✕ Dismiss
                </button>
              </div>
            </section>

            {/* Stats */}
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: "monetization_on",
                  title: "Potential Awards",
                  value: "$142.5K",
                  color: "from-blue-500 to-indigo-400",
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
                  className="group rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-blue-600/40 hover:shadow-[0_0_30px_-12px_rgba(99,102,241,0.6)] transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-105 transition`}
                  >
                    <span className="material-symbols-outlined">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">
                      {stat.value}
                    </h3>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Action Required */}
            <section className="rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/40 shadow-[0_0_40px_-15px_rgba(67,56,202,0.6)] backdrop-blur-md space-y-5">
              <h2 className="text-xl font-semibold">⚠️ Actions Required</h2>

              <div className="grid gap-4">
                {[
                  {
                    title: "Smith Scholarship - Due in 3 days",
                    detail: "Essay draft at 60% • Missing: LOR",
                    btn: "Continue Application →",
                    color: "from-blue-500 to-indigo-500",
                  },
                  {
                    title: "Johnson Grant - Incomplete Profile",
                    detail: "Add GPA to qualify",
                    btn: "Update Profile →",
                    color: "from-indigo-600 to-purple-500",
                  },
                ].map((action) => (
                  <div
                    key={action.title}
                    className="flex flex-col sm:flex-row justify-between border border-slate-700/70 bg-slate-900/50 rounded-2xl p-5 hover:border-blue-500/40 transition"
                  >
                    <div>
                      <p className="font-semibold text-white">{action.title}</p>
                      <p className="text-slate-400 text-sm">{action.detail}</p>
                    </div>
                    <button
                      className={`mt-3 sm:mt-0 px-5 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${action.color} hover:scale-[1.03] transition`}
                    >
                      {action.btn}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Matches */}
            <section className="rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/40 shadow-[0_0_40px_-12px_rgba(37,99,235,0.4)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  🔥 Top Matches For You
                </h2>
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All →
                </a>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Tech Leaders Scholarship",
                    amount: "$5,000",
                    date: "Feb 15, 2024",
                    match: "89%",
                    color: "from-blue-400 to-indigo-400",
                  },
                  {
                    title: "Women in STEM Award",
                    amount: "$3,000",
                    date: "Mar 1, 2024",
                    match: "82%",
                    color: "from-pink-500 to-rose-400",
                  },
                ].map((sch) => (
                  <div
                    key={sch.title}
                    className="rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-blue-500/40 p-6 transition shadow-inner"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">
                          {sch.title}
                        </h3>
                        <p className="text-sm text-slate-400">
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
                      <button className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Summary */}
            <section className="rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md shadow-[0_0_40px_-15px_rgba(99,102,241,0.5)] text-left">
              <h2 className="text-xl font-semibold mb-5">📊 Recent Activity</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                <div>
                  <p className="text-slate-400 mb-1">Today</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Saved 2 new scholarships</li>
                    <li>Essay draft updated for Smith Scholarship</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Yesterday</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Started Tech Leaders application</li>
                    <li>Found 5 new matches</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-slate-400 text-sm pt-8 pb-6 border-t border-slate-800/60">
              Need help?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Chat with us
              </a>{" "}
              •{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                FAQs
              </a>{" "}
              •{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Tutorials
              </a>
            </footer>
          </div>
        </main>
      </div>

      {/* Subscription Modals */}
      {showSubscriptionsModal && (
        <Subscriptions
          onClose={() => setShowSubscriptionsModal(false)}
          onUpgrade={(planType) => {
            setSelectedPlan(planType);
            setShowSubscriptionsModal(false);
            setShowCheckoutModal(true);
          }}
        />
      )}

      {showCheckoutModal && (
        <CheckoutPage
          planType={selectedPlan}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setShowCheckoutModal(false);
            setShowPaymentSuccessModal(true);
          }}
        />
      )}

      {showPaymentSuccessModal && (
        <PaymentSuccess
          onClose={() => setShowPaymentSuccessModal(false)}
          onGoToDashboard={() => {
            setShowPaymentSuccessModal(false);
          }}
          onManageSubscription={() => {
            setShowPaymentSuccessModal(false);
            setShowSubscriptionsModal(true);
          }}
          onShowLogin={() => {
            setShowPaymentSuccessModal(false);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
