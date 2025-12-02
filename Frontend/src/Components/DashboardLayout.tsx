import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Subscriptions from "./Subscriptions";
import CheckoutPage from "./CheckoutPage";
import PaymentSuccess from "./PaymentSuccess";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "semiannual">("monthly");

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden transition-colors duration-300 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary-500)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[var(--color-secondary-500)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-[var(--color-primary-400)]/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            onSubscriptionsClick={() => setShowSubscriptionsModal(true)}
            onSettingsClick={() => setShowSettingsModal(true)}
            onHelpClick={() => setShowHelpModal(true)}
          />

          <main className="flex-1 overflow-y-auto relative">
              {children}
          </main>
        </div>
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
