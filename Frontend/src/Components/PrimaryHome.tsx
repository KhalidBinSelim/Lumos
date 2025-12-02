import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep4 from "./OnboardingStep4";
import OnboardingStep5 from "./OnboardingStep5";

export default function Welcome() {
  // const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showOnboardingStep2Modal, setShowOnboardingStep2Modal] =
    useState(false);
  const [showOnboardingStep3Modal, setShowOnboardingStep3Modal] =
    useState(false);
  const [showOnboardingStep4Modal, setShowOnboardingStep4Modal] =
    useState(false);
  const [showOnboardingStep5Modal, setShowOnboardingStep5Modal] =
    useState(false);
  
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user || "{}");
  console.log(userObject.firstName, userObject.email);

  return (
    <DashboardLayout>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-8 p-8">
        {/* Welcome Card */}
        <section className="rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-xl backdrop-blur-md text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
            Welcome to Lumos!
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg sm:text-xl mb-6">
            Let's build your profile in 5 minutes to start finding
            scholarships that match you perfectly.
          </p>

          <p className="text-[var(--color-text-secondary)] text-left mb-6">We'll ask about:</p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] text-left space-y-1 mb-6">
            <li>✓ Academic background</li>
            <li>✓ Interests & activities</li>
            <li>✓ Demographics (optional, increases matches by 40%)</li>
            <li>✓ Upload resume/transcript (optional)</li>
          </ul>
          <p className="text-[var(--color-text-secondary)] mb-6">
            🔒 Your data is private and never shared
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // setShowWelcomeModal(false);
                setShowOnboardingModal(true);
              }}
              className="w-full py-3 px-6 rounded-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-semibold hover:scale-[1.02] transition shadow-lg shadow-[var(--color-primary-500)]/20"
            >
              Start Building Profile →
            </button>
            <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] text-sm mt-2 sm:mt-0 transition">
              Skip for Now
            </button>
          </div>
          {/* Onboarding Step 1 Modal */}
          {showOnboardingModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8">
                <button
                  onClick={() => setShowOnboardingModal(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]/40"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                </button>
                <OnboardingStep1
                  onBack={() => {
                    setShowOnboardingModal(false);
                    // setShowWelcomeModal(true);
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8">
                <button
                  onClick={() => setShowOnboardingStep2Modal(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]/40"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8">
                <button
                  onClick={() => setShowOnboardingStep3Modal(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]/40"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8">
                <button
                  onClick={() => setShowOnboardingStep4Modal(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]/40"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8">
                <button
                  onClick={() => setShowOnboardingStep5Modal(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]/40"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
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
        </section>
      </div>
    </DashboardLayout>
  );
}
