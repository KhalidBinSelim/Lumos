import { useState, useEffect } from "react";

type PlanType = "free" | "monthly" | "semiannual";

interface SubscriptionStatus {
  plan: PlanType;
  active: boolean;
  expiresAt?: string;
}

interface SubscriptionsProps {
  onClose: () => void;
  onUpgrade: (planType: PlanType) => void;
}

export default function Subscriptions({ onClose, onUpgrade }: SubscriptionsProps) {
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionStatus>({
      plan: "free",
      active: true,
    });

  useEffect(() => {
    // Load subscription from localStorage
    const stored = localStorage.getItem("lumosSubscription");
    if (stored) {
      setCurrentSubscription(JSON.parse(stored));
    }
  }, []);

  const plans = [
    {
      id: "free" as PlanType,
      name: "Lumos Free",
      price: 0,
      period: "month",
      description: "Perfect for getting started with your scholarship search.",
      features: [
        "Basic Scholarship Matching",
        "Profile Building",
        "Deadline Tracking",
      ],
      buttonText: "Current Plan",
      highlighted: false,
    },
    {
      id: "monthly" as PlanType,
      name: "Lumos Premium",
      price: 14.99,
      period: "month",
      description: "Supercharge your applications with AI tools.",
      features: [
        "Everything in Free",
        "AI Essay Copilot",
        "Unlimited Matches",
        "Priority Support",
      ],
      buttonText: "Upgrade to Monthly",
      highlighted: true,
    },
    {
      id: "semiannual" as PlanType,
      name: "Lumos Premium",
      price: 59.99,
      period: "6 months",
      description: "Save ~33% with semi-annual billing.",
      features: [
        "All Premium Features",
        "Exclusive Webinars",
        "Early Access to New Tools",
      ],
      buttonText: "Upgrade to 6-Month",
      highlighted: false,
      badge: "BEST VALUE",
    },
  ];

  const handleUpgrade = (planId: PlanType) => {
    if (planId === currentSubscription.plan) return;
    onUpgrade(planId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-2xl border border-[var(--color-border)] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--color-text-primary)]">Subscription Plans</h1>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Choose the plan that fits your scholarship journey
            </p>
          </div>

          {/* Current Subscription Card */}
          <div className="mb-12 p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-500)]/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-[var(--color-primary-500)]">
                workspace_premium
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">
              Current Subscription
            </h2>
            
            <p className="text-[var(--color-text-secondary)] mb-4">
              {plans.find((p) => p.id === currentSubscription.plan)?.name} -{" "}
              <span className="text-[var(--color-primary-500)]">
                ${plans.find((p) => p.id === currentSubscription.plan)?.price}
                /{plans.find((p) => p.id === currentSubscription.plan)?.period}
              </span>
              {currentSubscription.expiresAt && (
                <span className="block text-sm text-[var(--color-text-secondary)] mt-1">
                  Renews on {currentSubscription.expiresAt}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 justify-center bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-sm">
                check_circle
              </span>
              <span className="text-green-400 font-medium text-sm">Active</span>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentSubscription.plan;
              const isUpgrade =
                (currentSubscription.plan === "free" && plan.id !== "free") ||
                (currentSubscription.plan === "monthly" &&
                  plan.id === "semiannual");

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 flex flex-col relative overflow-hidden transition ${
                    plan.highlighted
                      ? "bg-[var(--color-bg-secondary)] border border-[var(--color-primary-500)]/30 shadow-lg shadow-[var(--color-primary-500)]/10"
                      : plan.badge
                      ? "bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-[var(--color-secondary-500)]/40 shadow-xl shadow-[var(--color-secondary-500)]/20"
                      : "bg-[var(--color-bg-secondary)]/40 border border-[var(--color-border)]"
                  } hover:border-[var(--color-primary-500)]/50`}
                >
                  {plan.badge && (
                    <div className="absolute top-0 right-0 bg-[var(--color-secondary-500)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[var(--color-text-primary)]">${plan.price}</span>
                      <span className="text-[var(--color-text-secondary)]">/{plan.period}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm"
                      >
                        <span
                          className={`material-symbols-outlined text-lg shrink-0 ${
                            plan.badge ? "text-[var(--color-secondary-400)]" : "text-[var(--color-primary-400)]"
                          }`}
                        >
                          check_circle
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                      isCurrent
                        ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] cursor-not-allowed"
                        : isUpgrade
                        ? plan.badge
                          ? "bg-[var(--color-secondary-600)] text-white hover:bg-[var(--color-secondary-500)] shadow-lg shadow-[var(--color-secondary-600)]/20"
                          : "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-500)] shadow-lg shadow-[var(--color-primary-600)]/20"
                        : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-500)]/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-[var(--color-primary-500)]">
                info
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2 text-[var(--color-text-primary)]">
              Need help choosing a plan?
            </h3>
            
            <p className="text-[var(--color-text-secondary)] mb-6">
              Our team is here to help you find the perfect plan for your
              scholarship journey. Contact us for personalized recommendations.
            </p>
            
            <button className="px-6 py-2.5 rounded-full bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-500)] transition font-medium shadow-lg shadow-[var(--color-primary-600)]/20">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
