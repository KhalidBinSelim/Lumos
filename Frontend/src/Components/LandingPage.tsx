// Uses Tailwind CSS classes and Material Symbols (loaded in index.html)
import { useState } from "react";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep4 from "./OnboardingStep4";
import OnboardingStep5 from "./OnboardingStep5";
import Signup from "./Signup";
import Login from "./Login";
import DemoModal from "./DemoModal";
import InfoModal, { type InfoModalContent } from "./InfoModal";
import Subscriptions from "./Subscriptions";
import CheckoutPage from "./CheckoutPage";
import PaymentSuccess from "./PaymentSuccess";

export default function LandingPage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showOnboardingStep2Modal, setShowOnboardingStep2Modal] =
    useState(false);
  const [showOnboardingStep3Modal, setShowOnboardingStep3Modal] =
    useState(false);
  const [showOnboardingStep4Modal, setShowOnboardingStep4Modal] =
    useState(false);
  const [showOnboardingStep5Modal, setShowOnboardingStep5Modal] =
    useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<InfoModalContent>({
    title: "",
    icon: "",
    content: null,
  });

  // Subscription modal states
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "semiannual">("monthly");

  const handleInfoClick = (
    e: React.MouseEvent,
    title: string,
    icon: string,
    content: React.ReactNode
  ) => {
    e.preventDefault();
    setInfoModalContent({ title, icon, content });
    setShowInfoModal(true);
  };

  return (
    <div className="min-h-screen text-slate-100 bg-linear-to-b from-slate-900 via-[#071029] to-black">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="p-8">
              {/* Close button */}
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {/* Modal content */}
              <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl text-blue-400">
                    waving_hand
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to Lumos!
                </h2>
                <p className="text-lg text-slate-300">
                  Let's build your profile in 5 minutes to start finding
                  scholarships that match you perfectly.
                </p>
              </div>

              {/* Illustration
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 rounded-full bg-linear-to-tr from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-blue-400">
                    school
                  </span>
                </div>
              </div> */}

              {/* Requirements list */}
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-4">
                  We'll ask about:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-green-400">
                      check_circle
                    </span>
                    Academic background
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-green-400">
                      check_circle
                    </span>
                    Interests & activities
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-green-400">
                      check_circle
                    </span>
                    Demographics (optional, increases matches by 40%)
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-green-400">
                      check_circle
                    </span>
                    Upload resume/transcript (optional)
                  </li>
                </ul>
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-2 justify-center mb-8 text-slate-400">
                <span className="material-symbols-outlined">lock</span>
                Your data is private and never shared
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    setShowOnboardingModal(true);
                  }}
                  className="w-full py-3 px-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition"
                >
                  Start Building Profile
                </button>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-slate-400 hover:text-slate-200 transition"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <Signup
              onClose={() => setShowSignupModal(false)}
              onSignIn={() => {
                setShowSignupModal(false);
                setShowLoginModal(true); // ✅ Switch to Login modal
              }}
            />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <Login
              onClose={() => setShowLoginModal(false)}
              onSignUp={() => {
                setShowLoginModal(false);
                setShowSignupModal(true); // ✅ Switch back to Signup modal
              }}
            />
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemoModal && (
        <DemoModal onClose={() => setShowDemoModal(false)} />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal
          data={infoModalContent}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {/* Onboarding Step 1 Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8">
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <OnboardingStep1
              onBack={() => {
                setShowOnboardingModal(false);
                setShowWelcomeModal(true);
              }}
              onNext={() => {
                setShowOnboardingModal(false);
                setShowOnboardingStep2Modal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Onboarding Step 2 Modal */}
      {showOnboardingStep2Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8">
            <button
              onClick={() => setShowOnboardingStep2Modal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <OnboardingStep2
              onBack={() => {
                setShowOnboardingStep2Modal(false);
                setShowOnboardingModal(true);
              }}
              onNext={() => {
                setShowOnboardingStep2Modal(false);
                setShowOnboardingStep3Modal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Onboarding Step 3 Modal */}
      {showOnboardingStep3Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8">
            <button
              onClick={() => setShowOnboardingStep3Modal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <OnboardingStep3
              onBack={() => {
                setShowOnboardingStep3Modal(false);
                setShowOnboardingStep2Modal(true);
              }}
              onNext={() => {
                setShowOnboardingStep3Modal(false);
                setShowOnboardingStep4Modal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Onboarding Step 4 Modal */}
      {showOnboardingStep4Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8">
            <button
              onClick={() => setShowOnboardingStep4Modal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <OnboardingStep4
              onBack={() => {
                setShowOnboardingStep4Modal(false);
                setShowOnboardingStep3Modal(true);
              }}
              onSkip={() => {
                setShowOnboardingStep4Modal(false);
              }}
              onNext={() => {
                setShowOnboardingStep4Modal(false);
                setShowOnboardingStep5Modal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Onboarding Step 5 Modal */}
      {showOnboardingStep5Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8">
            <button
              onClick={() => setShowOnboardingStep5Modal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <OnboardingStep5
              onBack={() => {
                setShowOnboardingStep5Modal(false);
                setShowOnboardingStep4Modal(true);
              }}
              onSkip={() => {
                setShowOnboardingStep5Modal(false);
              }}
              onComplete={() => {
                setShowOnboardingStep5Modal(false);
              }}
            />
          </div>
        </div>
      )}

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
            // Navigate to dashboard - for now just close
          }}
          onManageSubscription={() => {
            setShowPaymentSuccessModal(false);
            setShowSubscriptionsModal(true);
          }}
          onShowLogin={() => {
            setShowPaymentSuccessModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/60 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="inline-block w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 shadow-lg" />
            <span className="text-xl font-extrabold tracking-tight">Lumos</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-slate-300">
            <a href="#how" className="hover:text-blue-400 transition">
              How it works
            </a>
            <a href="#features" className="hover:text-blue-400 transition">
              Features
            </a>
            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLoginModal(true); // ✅ open Login modal
              }}
              className="px-4 py-2 rounded-md bg-linear-to-r from-blue-600 to-indigo-500 shadow-md text-white font-semibold hover:scale-[1.01] transition"
            >
              <span className="text-white">Sign in</span>
            </a>
          </nav>

          <div className="md:hidden">
            <button className="p-2 rounded-md bg-slate-800/50">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="w-full px-6 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-blue-300 to-indigo-400">
                Find Scholarships That Find You
              </h1>

              <p className="mt-6 text-slate-300 text-lg">
                Lumos uses AI-powered eligibility reasoning and personalized
                essay assistance to match you to scholarships, explain why you
                qualify, and help you apply — so you never miss another
                opportunity.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                <a
                  href="#signup"
                  onClick={() => setShowWelcomeModal(true)}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  <span className="material-symbols-outlined text-white">
                    bolt
                  </span>
                  <span className="text-white">Get started</span>
                </a>

                <a
                  href="#demo"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDemoModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-700 text-slate-200 hover:border-blue-500 transition"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch 2-min demo
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    check_circle
                  </span>
                  10,000+ scholarships
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    smart_toy
                  </span>
                  AI essay copilot
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    calendar_month
                  </span>
                  No fees, free forever
                </li>
              </ul>
            </div>

            <div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-linear-to-br from-slate-800 to-slate-900 p-6">
                <div className="absolute -left-16 -top-16 w-72 h-72 bg-linear-to-tr from-blue-500/20 to-indigo-500/10 rounded-full filter blur-3xl" />
                <div className="relative z-10">
                  <div className="rounded-lg bg-linear-to-br from-slate-900/50 to-slate-800/30 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-slate-400">
                          Matches found
                        </div>
                        <div className="text-3xl font-bold text-white">
                          1,248
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Top match</div>
                        <div className="text-lg font-semibold text-blue-300">
                          STEM Scholars Fund
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-900/60 rounded-md">
                        <div className="text-xs text-slate-400">Deadline</div>
                        <div className="text-sm font-medium">Oct 15, 2025</div>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-md">
                        <div className="text-xs text-slate-400">Award</div>
                        <div className="text-sm font-medium">$5,000</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-400">
                    Preview: AI explains why you match and drafts suggested
                    answers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section id="how" className="py-16">
          <div className="w-full px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Problem */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  The Problem
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-400">
                        warning
                      </span>
                      <p className="text-slate-300">
                        Billions in scholarships go unclaimed annually
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-400">
                        schedule
                      </span>
                      <p className="text-slate-300">
                        Students waste time on irrelevant scholarships and miss
                        deadlines
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-400">
                        error
                      </span>
                      <p className="text-slate-300">
                        Scholarship data is fragmented, outdated, and
                        eligibility is hard to parse
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Solution */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Our Solution
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-400 shrink-0 mt-1">
                        auto_awesome
                      </span>
                      <p className="text-slate-300 text-sm">
                        <span className="font-semibold text-white text-base">
                          AI-Powered Eligibility Reasoning
                        </span>{" "}
                        explains matches and flags missing criteria with clarity
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-400 shrink-0 mt-1">
                        psychology
                      </span>
                      <p className="text-slate-300 text-sm">
                        <span className="font-semibold text-white text-base">
                          Learning-to-Rank Engine
                        </span>{" "}
                        optimizes recommendations based on award likelihood
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-400 shrink-0 mt-1">
                        verified
                      </span>
                      <p className="text-slate-300 text-sm">
                        <span className="font-semibold text-white text-base">
                          Trust & Freshness Layer
                        </span>{" "}
                        Ensures only verified, current opportunities are shown
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-slate-900/30 py-16">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-white mb-8">
              Powerful features to win more awards
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Smart match</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  AI eligibility reasoning explains fit and flags missing
                  criteria so you know where to focus.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">edit</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Essay copilot</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Personalized prompts and drafting tools preserve your voice
                  while saving hours of work.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Auto-apply</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Autofill forms where supported and submit applications faster
                  and more accurately.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">leaderboard</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Track progress</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Deadline management, status tracking, and priority ranking
                  help you focus on high-value awards.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Impact & Stats */}
        <section className="py-16 bg-slate-900/30">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Proven Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-blue-400">15-25%</div>
                <p className="mt-2 text-slate-300">
                  Increase in scholarships awarded per active user
                </p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-blue-400">30-40%</div>
                <p className="mt-2 text-slate-300">
                  Reduction in time spent per application
                </p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-blue-400">20-30%</div>
                <p className="mt-2 text-slate-300">
                  Improvement in on-time submissions
                </p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-blue-400">235M+</div>
                <p className="mt-2 text-slate-300">
                  Students in our global target market
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powered by Advanced Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    code
                  </span>
                  <h3 className="text-lg font-semibold">Modern Stack</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    React & Next.js Frontend
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    FastAPI Backend
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    MongoDB Atlas Database
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    smart_toy
                  </span>
                  <h3 className="text-lg font-semibold">AI & ML Tools</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    GPT-4 & Claude 3.5
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    Vector Search & Ranking
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    OCR & Form Processing
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    security
                  </span>
                  <h3 className="text-lg font-semibold">Security & Scale</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    Global CDN Delivery
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    Real-time Analytics
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-green-400 text-sm">
                      check_circle
                    </span>
                    Enterprise Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Target Users */}
        <section id="about" className="py-16 bg-slate-900/30">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Who We Help
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    school
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Students</h3>
                    <p className="mt-2 text-slate-300">
                      High school and college students looking to discover and
                      win more scholarships. Our AI-powered tools help you find
                      matches and complete applications efficiently.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    diversity_3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      First-Generation Students
                    </h3>
                    <p className="mt-2 text-slate-300">
                      Get expert guidance on eligibility, essay writing, and
                      deadline management. We help overcome financial and
                      informational barriers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    support_agent
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      Counselors & Parents
                    </h3>
                    <p className="mt-2 text-slate-300">
                      Track student progress, manage deadlines, and provide
                      better guidance with our comprehensive tools and insights.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-4xl">
                    language
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      International Students
                    </h3>
                    <p className="mt-2 text-slate-300">
                      Access multilingual support and country-specific templates
                      to find and apply for global education funding
                      opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              What students are saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-800 hover:border-blue-500/30 transition flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500/80 to-indigo-500/80 flex items-center justify-center text-xl font-bold text-white">
                    SJ
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-slate-400">Class of 2025</div>
                  </div>
                </div>
                <blockquote className="text-slate-100">
                  "Lumos helped me win $15,000 in scholarships. The essay
                  copilot saved me weeks of work and made my applications
                  stronger."
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-blue-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-800 hover:border-blue-500/30 transition flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500/80 to-indigo-500/80 flex items-center justify-center text-xl font-bold text-white">
                    MP
                  </div>
                  <div>
                    <div className="font-semibold">Michael Park</div>
                    <div className="text-sm text-slate-400">Class of 2024</div>
                  </div>
                </div>
                <blockquote className="text-slate-100">
                  "The AI matching is incredible. Found scholarships I never
                  knew existed and explained exactly why I qualified. Already
                  won 3 awards!"
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-blue-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-800 hover:border-blue-500/30 transition flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500/80 to-indigo-500/80 flex items-center justify-center text-xl font-bold text-white">
                    AR
                  </div>
                  <div>
                    <div className="font-semibold">Aisha Rahim</div>
                    <div className="text-sm text-slate-400">Class of 2024</div>
                  </div>
                </div>
                <blockquote className="text-slate-100">
                  "The deadline tracking and auto-fill features are game
                  changers. I've applied to twice as many scholarships in half
                  the time."
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-blue-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-slate-900/50">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your journey. Start for free and upgrade
              when you're ready to accelerate your scholarship search.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700 flex flex-col hover:border-blue-500/30 transition relative overflow-hidden group">
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Lumos Free
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-4">
                    Perfect for getting started with your scholarship search.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Basic Scholarship Matching
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Profile Building
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Deadline Tracking
                  </li>
                </ul>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-800 transition"
                >
                  Get Started
                </button>
              </div>

              {/* Monthly Plan */}
              <div className="bg-slate-800/60 rounded-2xl p-8 border border-blue-500/30 flex flex-col hover:border-blue-500/60 transition relative overflow-hidden shadow-lg shadow-blue-900/10">
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Lumos Premium
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-white">
                      $14.99
                    </span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-4">
                    Supercharge your applications with AI tools.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Everything in Free
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    AI Essay Copilot
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Unlimited Matches
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Priority Support
                  </li>
                </ul>
                <button 
                  onClick={() => {
                    setSelectedPlan("monthly");
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                >
                  Subscribe Monthly
                </button>
              </div>

              {/* 6-Month Plan */}
              <div className="bg-linear-to-b from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-indigo-500/40 flex flex-col hover:border-indigo-500/70 transition relative overflow-hidden shadow-xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Lumos Premium
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-white">
                      $59.99
                    </span>
                    <span className="text-slate-400">/6 months</span>
                  </div>
                  <p className="text-indigo-200 text-sm mt-4">
                    Save ~33% with semi-annual billing.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-indigo-400 text-lg shrink-0">
                      check_circle
                    </span>
                    All Premium Features
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-indigo-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Exclusive Webinars
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-indigo-400 text-lg shrink-0">
                      check_circle
                    </span>
                    Early Access to New Tools
                  </li>
                </ul>
                <button 
                  onClick={() => {
                    setSelectedPlan("semiannual");
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                >
                  Subscribe 6-Month
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="w-full px-6 text-center">
            <div className="max-w-2xl mx-auto bg-linear-to-r from-slate-900/60 to-slate-800/40 p-10 rounded-2xl border border-slate-800">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Ready to fund your education?
              </h3>
              <p className="mt-4 text-slate-300">
                Sign up free to start getting tailored scholarship matches and
                AI-powered application help.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#signup"
                  className="px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow"
                  onClick={(event) => {
                    event.preventDefault();
                    setShowSignupModal(true);
                  }}
                >
                  <span className="text-white">Create free account</span>
                </a>
                <a
                  href="#demo"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDemoModal(true);
                  }}
                  className="px-6 py-3 rounded-full border border-slate-700 text-slate-200"
                >
                  Watch demo
                </a>
              </div>
              <div className="mt-3 text-slate-400 text-sm">
                No credit card required
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400">
            © 2025 Lumos. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <a href="#about" className="text-slate-300 hover:text-blue-400">
              About
            </a>
            <a
              href="#privacy"
              onClick={(e) =>
                handleInfoClick(
                  e,
                  "Privacy Policy",
                  "lock",
                  <>
                    <p>
                      At Lumos, we take your privacy seriously. We only collect
                      information necessary to provide you with scholarship
                      matches and improve our services.
                    </p>
                    <p>
                      We do not sell your personal data to third parties. Your
                      academic and demographic information is encrypted and stored
                      securely.
                    </p>
                    <p className="text-sm text-slate-400 mt-4">
                      Last updated: December 2025
                    </p>
                  </>
                )
              }
              className="text-slate-300 hover:text-blue-400"
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(e) =>
                handleInfoClick(
                  e,
                  "Terms of Service",
                  "gavel",
                  <>
                    <p>
                      By using Lumos, you agree to our terms of service. Our
                      platform is designed to assist students in finding and
                      applying for scholarships.
                    </p>
                    <p>
                      While we strive for accuracy, scholarship details are subject
                      to change by the providers. We are not responsible for
                      third-party decisions.
                    </p>
                  </>
                )
              }
              className="text-slate-300 hover:text-blue-400"
            >
              Terms
            </a>
            <a
              href="#blog"
              onClick={(e) =>
                handleInfoClick(
                  e,
                  "Lumos Blog",
                  "rss_feed",
                  <>
                    <p>
                      Welcome to the Lumos Blog! Here we share tips on writing
                      winning essays, interview strategies, and success stories
                      from our community.
                    </p>
                    <p>
                      Check back soon for our latest guide: "Top 10 STEM
                      Scholarships for 2026".
                    </p>
                  </>
                )
              }
              className="text-slate-300 hover:text-blue-400"
            >
              Blog
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
