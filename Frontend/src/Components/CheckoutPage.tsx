import { useState } from "react";
import React from "react";

type PlanType = "free" | "monthly" | "semiannual";

interface PlanDetails {
  name: string;
  price: number;
  period: string;
  features: string[];
}

const PLANS: Record<PlanType, PlanDetails> = {
  free: {
    name: "Lumos Free",
    price: 0,
    period: "month",
    features: [
      "Basic Scholarship Matching",
      "Profile Building",
      "Deadline Tracking",
    ],
  },
  monthly: {
    name: "Lumos Premium",
    price: 14.99,
    period: "month",
    features: [
      "Everything in Free",
      "AI Essay Copilot",
      "Unlimited Matches",
      "Priority Support",
    ],
  },
  semiannual: {
    name: "Lumos Premium",
    price: 59.99,
    period: "6 months",
    features: [
      "All Premium Features",
      "Exclusive Webinars",
      "Early Access to New Tools",
    ],
  },
};

interface CheckoutPageProps {
  planType: PlanType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutPage({ planType, onClose, onSuccess }: CheckoutPageProps) {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">(
    "card"
  );
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const plan = PLANS[planType] || PLANS.monthly;

  const handleProcessPayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save subscription to localStorage
    const subscription = {
      plan: planType,
      active: true,
      expiresAt: new Date(
        Date.now() +
          (planType === "semiannual" ? 180 : 30) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    };
    localStorage.setItem("lumosSubscription", JSON.stringify(subscription));

    onSuccess();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Plan Summary</h2>
      <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-slate-400 mt-1">
              Billed {plan.period === "month" ? "monthly" : "every 6 months"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${plan.price}</div>
            <div className="text-slate-400 text-sm">/{plan.period}</div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4 text-center">
          <h4 className="font-semibold mb-3">Included Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center justify-center gap-2 text-slate-300">
                <span className="material-symbols-outlined text-blue-400 text-sm">
                  check_circle
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setPaymentMethod("card")}
          className={`p-4 rounded-xl border transition ${
            paymentMethod === "card"
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">
              credit_card
            </span>
            <span className="font-medium">Credit Card</span>
          </div>
        </button>
        <button
          onClick={() => setPaymentMethod("paypal")}
          className={`p-4 rounded-xl border transition ${
            paymentMethod === "paypal"
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">
              account_balance_wallet
            </span>
            <span className="font-medium">PayPal</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Information</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            type="text"
            value={billingInfo.fullName}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, fullName: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            value={billingInfo.email}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="john@example.com"
            required
          />
        </div>

        {paymentMethod === "card" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={billingInfo.cardNumber}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, cardNumber: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={billingInfo.expiry}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, expiry: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV *</label>
                <input
                  type="text"
                  value={billingInfo.cvv}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, cvv: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </>
        )}

        {paymentMethod === "paypal" && (
          <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-symbols-outlined text-blue-400 text-2xl">
                info
              </span>
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">
                  PayPal Payment
                </h4>
                <p className="text-sm text-slate-300">
                  You will be redirected to PayPal to complete your purchase securely.
                  Make sure you have access to your PayPal account.
                </p>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  PayPal Email *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="your-paypal@email.com"
                  required
                />
              </div>
              <div className="text-xs text-slate-400">
                <span className="material-symbols-outlined text-xs align-middle mr-1">
                  lock
                </span>
                PayPal login will be required on their secure platform during checkout.
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Address *</label>
          <input
            type="text"
            value={billingInfo.address}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, address: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="123 Main St"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City *</label>
            <input
              type="text"
              value={billingInfo.city}
              onChange={(e) =>
                setBillingInfo({ ...billingInfo, city: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="San Francisco"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={billingInfo.zipCode}
              onChange={(e) =>
                setBillingInfo({ ...billingInfo, zipCode: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="94103"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country *</label>
          <select
            value={billingInfo.country}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, country: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="BD">Bangladesh</option>
            <option value="IN">India</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white rounded-2xl border border-slate-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((s, index) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${
                        step >= s
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-slate-700 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {step > s ? (
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                      ) : (
                        s
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-2">
                      {s === 1 ? "Plan" : s === 2 ? "Payment" : "Billing"}
                    </span>
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-0.5 mb-5 ${
                        step > s ? "bg-blue-500" : "bg-slate-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 mb-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition flex items-center gap-2"
              >
                Continue
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            ) : (
              <button
                onClick={handleProcessPayment}
                disabled={processing}
                className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-500 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      lock
                    </span>
                    Complete Purchase
                  </>
                )}
              </button>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
