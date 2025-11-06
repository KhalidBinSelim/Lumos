import { useState } from "react";
import OnboardingStep1 from "./OnboardingStep1";

function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [showOnboardingStep, setShowOnboardingStep] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-8 overflow-y-auto max-h-[90vh] hide-scrollbar">
          {showOnboardingStep ? (
            <div className="min-h-[500px]">
              <OnboardingStep1
                onBack={() => setShowOnboardingStep(false)}
                onNext={(data) => {
                  console.log("Form data:", data);
                  // Handle the next step here
                }}
              />
            </div>
          ) : (
            <>
              {/* Welcome content */}
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

              {/* Illustration */}
              <div className="relative h-64 mb-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-linear-to-tr from-blue-500/10 to-indigo-500/10 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-linear-to-bl from-blue-600/5 to-indigo-600/5 translate-x-12 -translate-y-4" />
                </div>

                <div className="relative h-full flex items-center justify-center">
                  {/* Document stack */}
                  <div className="absolute transform -rotate-6 -translate-x-16 translate-y-4">
                    <div className="w-24 h-32 rounded-lg bg-linear-to-tr from-slate-800 to-slate-700 border border-slate-600 shadow-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        description
                      </span>
                    </div>
                  </div>
                  <div className="absolute transform rotate-6 translate-x-16 translate-y-6">
                    <div className="w-24 h-32 rounded-lg bg-linear-to-tr from-slate-800 to-slate-700 border border-slate-600 shadow-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        article
                      </span>
                    </div>
                  </div>

                  {/* Central student icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transform scale-150" />
                    <div className="relative w-36 h-36 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 border-4 border-white/10 shadow-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-white">
                        school
                      </span>
                    </div>
                    <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-green-500 border-4 border-slate-900 shadow-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-white">
                        done
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-2 justify-center mb-8 text-slate-400">
                <span className="material-symbols-outlined">lock</span>
                Your data is private and never shared
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowOnboardingStep(true)}
                  className="w-full py-3 px-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition"
                >
                  Start Building Profile
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 transition"
                >
                  Skip for Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Landing page content */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Find Your Perfect Scholarship with Lumos
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Let us match you with scholarships that fit your unique profile. Start
          your journey to educational funding today.
        </p>
        <button
          onClick={() => setShowWelcomeModal(true)}
          className="py-3 px-8 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition"
        >
          Get Started
        </button>
      </div>

      {/* Welcome modal */}
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
    </div>
  );
}
