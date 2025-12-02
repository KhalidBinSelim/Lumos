// Uses Tailwind CSS classes and Material Symbols (loaded in index.html)
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
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
  
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] transition-colors duration-300">
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
      <header className="fixed top-0 w-full z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/20">
              <span className="material-symbols-outlined text-white text-2xl">
                school
              </span>
            </div>
            <span className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
              Lumos
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors"
            >
              About
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <span className="material-symbols-outlined text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors">light_mode</span>
              ) : (
                <span className="material-symbols-outlined text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors">dark_mode</span>
              )}
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-[var(--color-border)]">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors transition-colors bg-transparent border-none"
              >
                Sign in
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="px-5 py-2.5 rounded-lg bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-medium transition-all shadow-lg shadow-[var(--color-primary-500)]/25 hover:shadow-[var(--color-primary-500)]/40 hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary-500)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-[var(--color-secondary-500)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-[var(--color-primary-400)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-100)]/10 border border-[var(--color-primary-500)]/20 text-[var(--color-primary-500)] text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-500)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary-500)]"></span>
                  </span>
                  New: AI Essay Copilot 2.0
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]">
                  Fund Your Future with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-400)]">
                    AI-Powered
                  </span>{" "}
                  Scholarships
                </h1>
                <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Stop searching, start winning. Lumos matches you with high-value
                  opportunities and helps you write winning essays in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-semibold text-lg transition-all shadow-xl shadow-[var(--color-primary-500)]/20 hover:shadow-[var(--color-primary-500)]/40 hover:-translate-y-1"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-semibold text-lg transition-all shadow-xl shadow-[var(--color-primary-500)]/20 hover:shadow-[var(--color-primary-500)]/40 hover:-translate-y-1"
                  >
                    View Demo
                  </button>
                </div>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-[var(--color-text-secondary)] text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)]">check_circle</span>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)]">check_circle</span>
                    <span>14-day free trial</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 relative"
              >
                <div className="relative z-10 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl shadow-black/20 p-2">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
                    alt="Student Success"
                    className="rounded-xl w-full h-auto object-cover"
                  />
                  
                  {/* Floating Stats Card */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-6 -left-6 bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)] shadow-xl flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--color-primary-500)]">payments</span>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-text-secondary)]">Total Won</div>
                      <div className="text-xl font-bold text-[var(--color-text-primary)]">$12M+</div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-primary-500)]/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-secondary-500)]/20 rounded-full blur-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-24 bg-[var(--color-bg-secondary)]/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text-primary)]">
                The Scholarship Search is Broken
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Students waste hundreds of hours searching for scholarships they'll
                never win. Lumos changes the game with intelligent matching and
                automation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "search_off",
                  title: "Endless Searching",
                  desc: "Stop sifting through thousands of irrelevant listings.",
                },
                {
                  icon: "edit_note",
                  title: "Essay Fatigue",
                  desc: "No more writing the same essay from scratch 50 times.",
                },
                {
                  icon: "sentiment_dissatisfied",
                  title: "Missed Deadlines",
                  desc: "Never lose an opportunity to a forgotten calendar alert.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-6 mx-auto">
                    <span className="material-symbols-outlined text-[var(--color-text-secondary)] text-3xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-center">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--color-text-primary)]">
              Powerful Features to Win More Awards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "search", title: "Smart Match", desc: "AI eligibility reasoning explains fit and flags missing criteria." },
                { icon: "edit", title: "Essay Copilot", desc: "Personalized prompts and drafting tools preserve your voice." },
                { icon: "smart_toy", title: "Auto-Apply", desc: "Autofill forms where supported and submit applications faster." },
                { icon: "leaderboard", title: "Track Progress", desc: "Deadline management and priority ranking help you focus." },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] hover:border-[var(--color-primary-500)]/50 transition-all group"
                >
                  <div className="text-4xl text-[var(--color-primary-500)] mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact & Stats */}
        <section className="py-24 bg-[var(--color-bg-secondary)]/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--color-text-primary)]">
              Proven Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "15-25%", label: "Increase in awards per user" },
                { value: "30-40%", label: "Reduction in application time" },
                { value: "20-30%", label: "Improvement in on-time submissions" },
                { value: "235M+", label: "Students in our global market" },
              ].map((stat, index) => (
                <div key={index} className="p-8 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center">
                  <div className="text-4xl font-bold text-[var(--color-primary-500)] mb-2">{stat.value}</div>
                  <p className="text-[var(--color-text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--color-text-primary)]">
              Powered by Advanced Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "code",
                  title: "Modern Stack",
                  items: ["React & Next.js Frontend", "FastAPI Backend", "MongoDB Atlas Database"],
                },
                {
                  icon: "smart_toy",
                  title: "AI & ML Tools",
                  items: ["GPT-4 & Claude 3.5", "Vector Search & Ranking", "OCR & Form Processing"],
                },
                {
                  icon: "security",
                  title: "Security & Scale",
                  items: ["Global CDN Delivery", "Real-time Analytics", "Enterprise Security"],
                },
              ].map((tech, index) => (
                <div key={index} className="p-8 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
                  <div className="flex flex-col items-center text-center mb-6">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-5xl mb-4">
                      {tech.icon}
                    </span>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{tech.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {tech.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm">
                        <span className="material-symbols-outlined text-[var(--color-primary-500)] text-base">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Users */}
        <section id="about" className="py-24 bg-[var(--color-bg-secondary)]/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--color-text-primary)]">
              Who We Help
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "school", title: "High School Students", desc: "Find undergraduate scholarships, plan your college funding, and get essay help." },
                { icon: "menu_book", title: "Undergraduates", desc: "Discover major-specific grants, research funding, and tuition assistance." },
                { icon: "school", title: "Graduate Students", desc: "Access fellowships, research grants, and professional development awards." },
              ].map((user, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                  <div className="w-16 h-16 mx-auto bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-3xl">
                      {user.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                    {user.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {user.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--color-text-primary)]">
              What students are saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--color-bg-secondary)]/40 rounded-xl p-6 border border-[var(--color-bg-secondary)] hover:border-[var(--color-primary-500)]/30 transition flex flex-col items-center text-center"
              >
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[var(--color-primary-500)]/80 to-[var(--color-indigo-600)]/80 flex items-center justify-center text-xl font-bold text-white">
                    SJ
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">Sarah Johnson</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Class of 2025</div>
                  </div>
                </div>
                <blockquote className="text-[var(--color-text-primary)]">
                  "Lumos helped me win $15,000 in scholarships. The essay
                  copilot saved me weeks of work and made my applications
                  stronger."
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-[var(--color-primary-500)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--color-bg-secondary)]/40 rounded-xl p-6 border border-[var(--color-bg-secondary)] hover:border-[var(--color-primary-500)]/30 transition flex flex-col items-center text-center"
              >
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[var(--color-primary-500)]/80 to-[var(--color-indigo-600)]/80 flex items-center justify-center text-xl font-bold text-white">
                    MP
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">Michael Park</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Class of 2024</div>
                  </div>
                </div>
                <blockquote className="text-[var(--color-text-primary)]">
                  "The AI matching is incredible. Found scholarships I never
                  knew existed and explained exactly why I qualified. Already
                  won 3 awards!"
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-[var(--color-primary-500)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--color-bg-secondary)]/40 rounded-xl p-6 border border-[var(--color-bg-secondary)] hover:border-[var(--color-primary-500)]/30 transition flex flex-col items-center text-center"
              >
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[var(--color-primary-500)]/80 to-[var(--color-indigo-600)]/80 flex items-center justify-center text-xl font-bold text-white">
                    AR
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">Aisha Rahim</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Class of 2024</div>
                  </div>
                </div>
                <blockquote className="text-[var(--color-text-primary)]">
                  "The deadline tracking and auto-fill features are game
                  changers. I've applied to twice as many scholarships in half
                  the time."
                </blockquote>
                <div className="mt-4 flex items-center justify-center gap-1 text-[var(--color-primary-500)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-[var(--color-bg-secondary)]/50">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-[var(--color-text-primary)]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[var(--color-text-secondary)] text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your journey. Start for free and upgrade
              when you're ready to accelerate your scholarship search.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--color-bg-secondary)]/40 rounded-2xl p-8 border border-[var(--color-bg-secondary)] flex flex-col hover:border-[var(--color-primary-500)]/30 transition relative overflow-hidden group"
              >
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Lumos Free
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">$0</span>
                    <span className="text-[var(--color-text-secondary)]">/month</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                    Perfect for getting started with your scholarship search.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    Basic Scholarship Matching
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    Profile Building
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    Deadline Tracking
                  </li>
                </ul>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full py-3 rounded-lg bg-[var(--color-primary-600)] text-white font-medium hover:bg-[var(--color-primary-500)] transition shadow-lg shadow-[var(--color-primary-600)]/20"
                >
                  Get Started
                </button>
              </motion.div>

              {/* Monthly Plan */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--color-bg-secondary)]/60 rounded-2xl p-8 border border-[var(--color-primary-500)]/30 flex flex-col hover:border-[var(--color-primary-500)]/60 transition relative overflow-hidden shadow-lg shadow-[var(--color-primary-500)]/10"
              >
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Lumos Premium
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      $14.99
                    </span>
                    <span className="text-[var(--color-text-secondary)]">/month</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                    Supercharge your applications with AI tools.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    Everything in Free
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    AI Essay Copilot
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
                      check_circle
                    </span>
                    Unlimited Matches
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg shrink-0">
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
                  className="w-full py-3 rounded-lg bg-[var(--color-primary-600)] text-white font-medium hover:bg-[var(--color-primary-500)] transition shadow-lg shadow-[var(--color-primary-600)]/20"
                >
                  Subscribe Monthly
                </button>
              </motion.div>

              {/* 6-Month Plan */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-linear-to-b from-[var(--color-bg-secondary)]/80 to-[var(--color-bg-primary)]/80 rounded-2xl p-8 border border-[var(--color-indigo-600)]/40 flex flex-col hover:border-[var(--color-indigo-600)]/70 transition relative overflow-hidden shadow-xl shadow-[var(--color-indigo-600)]/20"
              >
                <div className="absolute top-0 right-0 bg-[var(--color-indigo-600)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <div className="mb-6 text-center flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Lumos Premium
                  </h3>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      $59.99
                    </span>
                    <span className="text-[var(--color-text-secondary)]">/6 months</span>
                  </div>
                  <p className="text-[var(--color-primary-100)] text-sm mt-4">
                    Save ~33% with semi-annual billing.
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-indigo-600)] text-lg shrink-0">
                      check_circle
                    </span>
                    All Premium Features
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-indigo-600)] text-lg shrink-0">
                      check_circle
                    </span>
                    Exclusive Webinars
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm">
                    <span className="material-symbols-outlined text-[var(--color-indigo-600)] text-lg shrink-0">
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
                  className="w-full py-3 rounded-lg bg-[var(--color-indigo-600)] text-white font-medium hover:bg-[var(--color-indigo-600)]/90 transition shadow-lg shadow-[var(--color-indigo-600)]/20"
                >
                  Subscribe 6-Month
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="w-full px-6 text-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="max-w-2xl mx-auto bg-linear-to-r from-[var(--color-bg-secondary)]/60 to-[var(--color-bg-primary)]/40 p-10 rounded-2xl border border-[var(--color-bg-secondary)]"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Ready to fund your education?
              </h3>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Sign up free to start getting tailored scholarship matches and
                AI-powered application help.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#signup"
                  className="px-6 py-3 rounded-full bg-linear-to-r from-[var(--color-primary-600)] to-[var(--color-indigo-600)] text-white font-semibold shadow"
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
                  className="px-6 py-3 rounded-full bg-linear-to-r from-[var(--color-primary-800)] to-[var(--color-indigo-100)] text-white font-semibold shadow"
                >
                  Watch demo
                </a>
              </div>
              <div className="mt-3 text-[var(--color-text-secondary)] text-sm">
                No credit card required
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-bg-secondary)] py-8 bg-[var(--color-bg-primary)]">
        <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[var(--color-text-secondary)]">
            © 2025 Lumos. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <a
              href="#about"
              onClick={(e) =>
                handleInfoClick(
                  e,
                  "About Lumos",
                  "info",
                  <>
                    <p>
                      Lumos is dedicated to democratizing access to education funding.
                      Our mission is to help every student find and win the scholarships
                      they deserve.
                    </p>
                    <p>
                      Founded in 2025, we combine advanced AI technology with human
                      expertise to simplify the scholarship search and application process.
                    </p>
                  </>
                )
              }
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"
            >
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
                    <p className="text-sm text-[var(--color-text-secondary)] mt-4">
                      Last updated: December 2025
                    </p>
                  </>
                )
              }
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"
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
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"
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
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"
            >
              Blog
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
