import { useEffect } from "react";

export type InfoModalContent = {
  title: string;
  icon: string;
  content: React.ReactNode;
};

type InfoModalProps = {
  data: InfoModalContent;
  onClose: () => void;
};

export default function InfoModal({ data, onClose }: InfoModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary-500)]">
              {data.icon}
            </span>
            {data.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 text-[var(--color-text-secondary)] leading-relaxed space-y-4">
          {data.content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex justify-end bg-[var(--color-bg-primary)]/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] transition font-medium shadow-lg shadow-[var(--color-primary-500)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
