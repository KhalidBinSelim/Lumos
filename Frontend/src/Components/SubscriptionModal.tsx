import { useState } from "react";

interface SubscriptionModalProps {
  onClose: () => void;
}

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);

  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Access to 10,000+ scholarships",
        "Basic profile matching",
        "Deadline reminders",
        "Application tracking",
        "Email support"
      ],
      current: true
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: "$9.99",
      period: "per month",
      features: [
        "Everything in Free",
        "AI Essay Writing Assistant",
        "Advanced match algorithm",
        "Priority support",
        "Unlimited saved scholarships",
        "Custom deadline management",
        "Document templates"
      ],
      current: false,
      popular: true
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-text-secondary)]">
              price_check
            </span>
            Subscription Plans
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Plan Notice */}
          <div className="mb-6 p-4 rounded-xl bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/20 flex items-start gap-4">
            <span className="material-symbols-outlined text-[var(--color-primary-500)] text-2xl">
              info
            </span>
            <div>
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">
                Current Plan: Free
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm">
                You're currently on the Free plan. Upgrade to Premium for advanced features!
              </p>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 transition-all ${
                  plan.popular
                    ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-primary)]/40"
                } ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-[var(--color-primary-500)]"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--color-primary-500)]/20 border border-[var(--color-primary-500)]/30 text-[var(--color-primary-500)] text-xs font-bold">
                    CURRENT
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      {plan.price}
                    </span>
                    <span className="text-[var(--color-text-secondary)]">/ {plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[var(--color-primary-500)] mt-0.5">✓</span>
                      <span className="text-[var(--color-text-secondary)] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  disabled={plan.current}
                  className={`w-full py-3 rounded-xl font-medium transition ${
                    plan.current
                      ? "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white hover:scale-[1.02] shadow-lg shadow-[var(--color-primary-500)]/20"
                      : "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                  }`}
                >
                  {plan.current ? "Current Plan" : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)]">
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                  Can I cancel anytime?
                </h4>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Yes! You can cancel your Premium subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)]">
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  We accept all major credit cards, debit cards, and PayPal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-secondary)]/50 rounded-b-2xl">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Questions? <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)]">Contact support</button>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
