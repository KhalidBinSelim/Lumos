import { useState } from "react";

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  const faqs = [
    {
      q: "How does the scholarship matching work?",
      a: "Our AI analyzes your profile (grades, interests, demographics) and compares it against our database of scholarships to find the best fits.",
    },
    {
      q: "Is Lumos free to use?",
      a: "Yes! You can search for scholarships and build your profile for free. We also offer a Premium plan with advanced AI essay tools.",
    },
    {
      q: "Can I edit my profile after signing up?",
      a: "Absolutely. You can update your academic info, interests, and documents at any time from your profile settings.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-text-secondary)]">
              help
            </span>
            Help & Support
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 py-4 text-sm font-medium transition relative ${
              activeTab === "faq" ? "text-[var(--color-primary-500)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            FAQs
            {activeTab === "faq" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-500)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 py-4 text-sm font-medium transition relative ${
              activeTab === "contact" ? "text-[var(--color-primary-500)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Contact Support
            {activeTab === "contact" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-500)]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "faq" ? (
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)]"
                >
                  <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">{faq.q}</h4>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
              <div className="mt-8 text-center">
                <p className="text-[var(--color-text-secondary)] mb-4">Still have questions?</p>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] font-medium"
                >
                  Contact our support team &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/20 flex items-start gap-4">
                <span className="material-symbols-outlined text-[var(--color-primary-500)] text-2xl">
                  support_agent
                </span>
                <div>
                  <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    We're here to help
                  </h4>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Our team typically responds within 24 hours.
                  </p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing Question</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition resize-none"
                    placeholder="Describe your issue..."
                  />
                </div>
                <button className="w-full py-3 rounded-lg bg-[var(--color-primary-600)] text-white font-medium hover:bg-[var(--color-primary-500)] transition shadow-lg shadow-[var(--color-primary-500)]/20">
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
