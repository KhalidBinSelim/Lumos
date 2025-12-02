import { useEffect, useState } from "react";

interface SubscriptionData {
  plan: string;
  active: boolean;
  expiresAt?: string;
}

interface PaymentSuccessProps {
  onClose: () => void;
  onGoToDashboard: () => void;
  onManageSubscription: () => void;
  onShowLogin: () => void;
}

export default function PaymentSuccess({
  onClose,
  onGoToDashboard,
  onManageSubscription,
  onShowLogin,
}: PaymentSuccessProps) {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);

  useEffect(() => {
    // Load subscription data from localStorage
    const stored = localStorage.getItem("lumosSubscription");
    if (stored) {
      setSubscriptionData(JSON.parse(stored));
    }
  }, []);

  const handleGoToDashboard = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lumosUserAuth");
    if (isLoggedIn) {
      onGoToDashboard();
    } else {
      onShowLogin();
    }
  };

  const getPlanDetails = () => {
    if (!subscriptionData) return { name: "", price: 0, period: "" };

    const plans: Record<string, { name: string; price: number; period: string }> = {
      free: { name: "Lumos Free", price: 0, period: "month" },
      monthly: { name: "Lumos Premium", price: 14.99, period: "month" },
      semiannual: { name: "Lumos Premium", price: 59.99, period: "6 months" },
    };

    return plans[subscriptionData.plan] || plans.free;
  };

  const planDetails = getPlanDetails();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white rounded-2xl border border-slate-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-8 py-12">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 mb-6">
              <span className="material-symbols-outlined text-6xl text-green-500">
                check_circle
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-slate-400 text-lg">
              Your subscription has been activated
            </p>
          </div>

          {/* Subscription Details Card */}
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 mb-6">
            <h2 className="text-xl font-semibold mb-6">Subscription Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Plan</span>
                <span className="font-semibold">{planDetails.name}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Amount</span>
                <span className="font-semibold text-2xl text-blue-400">
                  ${planDetails.price}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Billing Cycle</span>
                <span className="font-semibold">
                  {planDetails.period === "month" ? "Monthly" : "Every 6 months"}
                </span>
              </div>

              {subscriptionData?.expiresAt && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Next Billing Date</span>
                  <span className="font-semibold">
                    {subscriptionData.expiresAt}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30 mb-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-blue-400 text-3xl">
                info
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-blue-400 mt-0.5">
                      check
                    </span>
                    A confirmation email has been sent to your inbox
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-blue-400 mt-0.5">
                      check
                    </span>
                    You now have access to all premium features
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-blue-400 mt-0.5">
                      check
                    </span>
                    Start exploring AI-powered scholarship matching
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition flex items-center justify-center gap-2 font-medium"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Go to Dashboard
            </button>
            <button
              onClick={onManageSubscription}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition flex items-center justify-center gap-2 font-medium"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              Manage Subscription
            </button>
          </div>

          {/* Support Link */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm">
              Questions about your subscription?{" "}
              <button className="text-blue-400 hover:text-blue-300 underline">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
