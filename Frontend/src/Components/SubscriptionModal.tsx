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
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">
              price_check
            </span>
            Subscription Plans
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Plan Notice */}
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-4">
            <span className="material-symbols-outlined text-blue-400 text-2xl">
              info
            </span>
            <div>
              <h4 className="font-semibold text-white mb-1">
                Current Plan: Free
              </h4>
              <p className="text-slate-400 text-sm">
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
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-slate-700 bg-slate-800/40"
                } ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    CURRENT
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">/ {plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  disabled={plan.current}
                  className={`w-full py-3 rounded-xl font-medium transition ${
                    plan.current
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:scale-[1.02] shadow-lg shadow-blue-600/20"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  {plan.current ? "Current Plan" : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">
                  Can I cancel anytime?
                </h4>
                <p className="text-slate-400 text-sm">
                  Yes! You can cancel your Premium subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-slate-400 text-sm">
                  We accept all major credit cards, debit cards, and PayPal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-b-2xl">
          <p className="text-sm text-slate-400">
            Questions? <button className="text-blue-400 hover:text-blue-300">Contact support</button>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
