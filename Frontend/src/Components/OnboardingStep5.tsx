import { useEffect, useRef, useState } from "react";

type UploadState = "idle" | "dragging" | "uploading" | "error" | "success";

interface FileItem {
  id: string;
  name: string;
  sizeLabel: string;
}

interface ExtractStatus {
  inProgress: boolean;
  progress: number; // 0-100
  completeMsg?: string;
}

interface OnboardingStep5Props {
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export default function OnboardingStep5({ onBack, onSkip, onComplete }: OnboardingStep5Props) {
  const [resumeState, setResumeState] = useState<UploadState>("idle");
  const [resumeFile, setResumeFile] = useState<FileItem | null>(null);
  const [resumeProgress, setResumeProgress] = useState(0);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [extract, setExtract] = useState<ExtractStatus>({ inProgress: false, progress: 0 });

  const [transcriptState, setTranscriptState] = useState<UploadState>("idle");
  const [otherDocs, setOtherDocs] = useState<FileItem[]>([]);

  const [processingScreen, setProcessingScreen] = useState<"idle" | "processing" | "done">("idle");
  const processingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) window.clearTimeout(processingTimerRef.current);
    };
  }, []);

  const handleDrop = (files: FileList | null, target: "resume" | "transcript" | "other") => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 10) {
      if (target === "resume") {
        setResumeState("error");
        setResumeError("File size exceeds 10MB limit");
      } else if (target === "transcript") {
        setTranscriptState("error");
      }
      return;
    }
    const item: FileItem = { id: crypto.randomUUID(), name: file.name, sizeLabel: `${sizeMb.toFixed(1)}MB` };
    if (target === "resume") {
      setResumeError(null);
      setResumeFile(item);
      setResumeState("uploading");
      setResumeProgress(0);
      // Fake upload progress
      const start = Date.now();
      const interval = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round(20 + (elapsed / 2000) * 80));
        setResumeProgress(pct);
        if (pct >= 100) {
          window.clearInterval(interval);
          setResumeState("success");
          // Start fake extraction
          setExtract({ inProgress: true, progress: 0 });
          const t0 = Date.now();
          const ext = window.setInterval(() => {
            const epct = Math.min(100, Math.round((Date.now() - t0) / 30));
            setExtract({ inProgress: epct < 100, progress: epct, completeMsg: epct >= 100 ? "Complete! Found 6 items" : undefined });
            if (epct >= 100) window.clearInterval(ext);
          }, 100);
        }
      }, 120);
    } else if (target === "transcript") {
      setTranscriptState("success");
    } else {
      setOtherDocs((prev) => [...prev, item]);
    }
  };

  const startProcessing = () => {
    setProcessingScreen("processing");
    // Simulate 30s processing screen
    processingTimerRef.current = window.setTimeout(() => {
      setProcessingScreen("done");
    }, 30000) as unknown as number;
  };

  const stopProcessing = () => {
    if (processingTimerRef.current) window.clearTimeout(processingTimerRef.current);
    setProcessingScreen("done");
  };

  const renderDropZone = (
    state: UploadState,
    onFiles: (files: FileList | null) => void,
    opts?: { compact?: boolean }
  ) => {
    const compact = opts?.compact;
    if (state === "error") {
      return (
        <div className="rounded-lg border border-rose-500/60 bg-rose-500/10 p-4 text-sm">
          <div className="font-medium">❌ Upload failed</div>
          <div className="text-slate-300">File size exceeds 10MB limit</div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onFiles(null)}
              className="px-3 py-1.5 rounded-md border border-slate-700 text-slate-200 hover:border-slate-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    if (state === "uploading") {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <div>⏳ Uploading {resumeFile?.name}...</div>
            <button type="button" className="text-slate-300 hover:text-white">Cancel Upload</button>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500" style={{ width: `${resumeProgress}%` }} />
          </div>
          <div className="mt-1 text-xs text-slate-400">{resumeProgress}%</div>
        </div>
      );
    }
    if (state === "dragging") {
      return (
        <div className="rounded-lg border-2 border-dashed border-blue-500 bg-blue-500/10 p-8 text-center text-sm">
          ⬇️ Drop your file here
        </div>
      );
    }
    // idle
    return (
      <label
        className={`block rounded-lg ${compact ? "p-6" : "p-8"} border border-slate-700 bg-slate-900/50 text-center cursor-pointer hover:border-slate-600 transition`}
      >
        <div className="text-sm">📎 Drop file here or click to browse</div>
        {!compact && (
          <div className="mt-2 text-xs text-slate-400">Accepted: PDF, DOCX, JPG, PNG • Max size: 10MB</div>
        )}
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </label>
    );
  };

  if (processingScreen !== "idle") {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4 pr-10">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="inline-block w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500" />
            <span className="text-sm font-semibold">Lumos</span>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="truncate text-xs sm:text-sm font-medium text-slate-200">Step 5 of 5: Upload Documents</span>
            <div className="flex items-center gap-2 ml-auto min-w-[120px]">
              <div className="w-24 h-1 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-full bg-linear-to-r from-blue-500 to-indigo-500" />
              </div>
              <span className="text-xs text-slate-400">100%</span>
            </div>
          </div>
        </div>

        {processingScreen === "processing" ? (
          <div className="text-center py-10">
            <div className="text-2xl">🎉 Profile Complete!</div>
            <div className="mt-2 text-slate-300">Your scholarship journey starts now</div>
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
              <div className="font-semibold mb-3">HERE'S WHAT HAPPENS NEXT:</div>
              <div className="space-y-4 text-sm">
                <div>
                  1️⃣ We're analyzing 10,000+ scholarships
                  <div className="mt-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-2/3 bg-linear-to-r from-blue-500 to-indigo-500" />
                  </div>
                </div>
                <div>2️⃣ AI is personalizing your dashboard</div>
                <div>3️⃣ We'll send you a summary email</div>
                <div className="text-slate-400">⏱️ This takes about 30 seconds...</div>
              </div>
            </div>
            <div className="mt-6 text-slate-400">[Processing... Do not close this window]</div>
            <div className="mt-6">
              <button
                type="button"
                onClick={stopProcessing}
                className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-2xl">✅ All Set!</div>
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
              <div className="font-semibold mb-3">🎯 We found 47 scholarships you qualify for!</div>
              <div className="text-sm space-y-2">
                <div>Total Potential: $142,500</div>
                <div>📝 3 applications have deadlines this month</div>
                <div>💡 Top Match: Tech Leaders Scholarship ($5,000) — 89% match</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button type="button" className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold">View My Matches →</button>
              <button type="button" className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300">Take the Tour</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl max-h-[450px] mx-auto">
      {/* Header - compact single line */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-10">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="inline-block w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500" />
          <span className="text-sm font-semibold">Lumos</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="truncate text-xs sm:text-sm font-medium text-slate-200">Step 5 of 5: Upload Documents</span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-full bg-linear-to-r from-blue-500 to-indigo-500" />
            </div>
            <span className="text-xs text-slate-400">100%</span>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onComplete(); }} className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Almost done! Upload your documents</h2>
          <p className="mt-1 text-slate-400 text-sm">(We'll extract info automatically with AI)</p>
        </div>

        {/* Resume */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-semibold mb-3">📄 RESUME / CV</h3>
          {renderDropZone(resumeState, (files) => handleDrop(files, "resume"))}
          {resumeState === "success" && resumeFile && (
            <div className="mt-3 text-sm">
              <div className="flex items-center justify-between">
                <div>✅ {resumeFile.name} ({resumeFile.sizeLabel})</div>
                <div className="flex items-center gap-2">
                  <button type="button" className="text-slate-300 hover:text-white">👁️ Preview</button>
                  <button type="button" className="text-slate-300 hover:text-white">🔄 Replace</button>
                  <button type="button" className="text-rose-300 hover:text-rose-200" onClick={() => { setResumeFile(null); setResumeState("idle"); }}>🗑️ Delete</button>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">AI Extraction Status:</div>
                {extract.inProgress ? (
                  <div className="mt-1">
                    <div className="text-slate-300 text-sm">⏳ Processing... {extract.progress}%</div>
                    <div className="mt-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500" style={{ width: `${extract.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="text-green-300">✅ {extract.completeMsg || "Complete!"}</div>
                )}
              </div>
            </div>
          )}
          {resumeState === "error" && resumeError && (
            <div className="mt-2 text-sm text-rose-300">{resumeError}</div>
          )}
        </section>

        {/* Transcript */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-semibold mb-3">📜 TRANSCRIPT (Optional)</h3>
          {renderDropZone(transcriptState, (files) => handleDrop(files, "transcript"), { compact: true })}
          <div className="mt-2 text-xs text-slate-400">💡 Helps verify GPA and coursework</div>
        </section>

        {/* Other documents */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">🎓 OTHER DOCUMENTS (Optional)</h3>
            <button
              type="button"
              onClick={() => handleDrop({ length: 1, 0: new File([""], "document.pdf") } as unknown as FileList, "other")}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-600 transition text-sm"
            >
              + Add Document
            </button>
          </div>
          {otherDocs.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {otherDocs.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2">
                  <span>• {d.name} ({d.sizeLabel})</span>
                  <button type="button" className="text-rose-300 hover:text-rose-200" onClick={() => setOtherDocs((prev) => prev.filter((x) => x.id !== d.id))}>× Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-400">Examples: Award certificates, recommendation letters, portfolios</div>
          )}
        </section>

        {/* Extracted information */}
        {resumeState === "success" && (
          <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h3 className="text-sm font-semibold mb-3">✨ EXTRACTED INFORMATION</h3>
            {extract.inProgress ? (
              <div className="text-sm text-slate-300">Extracting from your resume...</div>
            ) : (
              <div className="text-sm space-y-1">
                <div>✓ Activities: 3 added to your profile</div>
                <div>✓ Awards: 2 added to your profile</div>
                <div>✓ Work Experience: 1 added to your profile</div>
                <div className="mt-2">
                  <button type="button" className="px-3 py-1.5 rounded-md border border-slate-700 text-slate-200 hover:border-slate-600 text-sm">Review Extracted Data</button>
                </div>
                <div className="text-xs text-slate-400 mt-1">Not accurate? You can edit later in your profile.</div>
              </div>
            )}
          </section>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 transition flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 transition"
            >
              Skip Documents
            </button>
            <button
              type="button"
              onClick={startProcessing}
              className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition flex items-center gap-1"
            >
              Complete Profile →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


