import { useEffect } from "react";

type DemoModalProps = {
  onClose: () => void;
};

export default function DemoModal({ onClose }: DemoModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">
              play_circle
            </span>
            Lumos Demo
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Video Embed */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src="https://drive.google.com/file/d/1yz5cVlQFrB8wd3VcIGeDMKdW56r0qBJp/preview"
            width="100%"
            height="100%"
            allow="autoplay"
            title="Lumos Demo Video"
            className="border-0"
          ></iframe>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
