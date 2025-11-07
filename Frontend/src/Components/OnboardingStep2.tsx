import { useState } from "react";

interface AcademicFormData {
  educationLevel:
    | "High School"
    | "College Student"
    | "Graduate Student"
    | "Other"
    | "";
  schoolName: string;
  gradeYear: string;
  graduationYear: string;
  gpa: string;
  gpaScale: "4.0" | "5.0" | "100" | "Other";
  major: string;
  minor: string;
  sat: string;
  ielts: string;
  classRank: string;
  classSize: string;
}

interface OnboardingStep2Props {
  onBack: () => void;
  onNext: (data: AcademicFormData) => void;
}

export default function OnboardingStep2({
  onBack,
  onNext,
}: OnboardingStep2Props) {
  const [formData, setFormData] = useState<AcademicFormData>({
    educationLevel: "",
    schoolName: "",
    gradeYear: "",
    graduationYear: "",
    gpa: "",
    gpaScale: "4.0",
    major: "",
    minor: "",
    sat: "",
    ielts: "",
    classRank: "",
    classSize: "",
  });

  const levelOptions: AcademicFormData["educationLevel"][] = [
    "High School",
    "College Student",
    "Graduate Student",
    "Other",
  ];

  const gradeYearOptions = [
    "9th",
    "10th",
    "11th",
    "12th",
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
  ];

  const graduationYears = Array.from(
    { length: 15 },
    (_, i) => `${new Date().getFullYear() - 2 + i}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header - compact single line (leave right edge free for close button) */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-10">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="inline-block w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500" />
          <span className="text-sm font-semibold">Lumos</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="truncate text-xs sm:text-sm font-medium text-slate-200">
            Step 2 of 5: Academic Information
          </span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-2/5 bg-linear-to-r from-blue-500 to-indigo-500" />
            </div>
            <span className="text-xs text-slate-400">40%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl font-bold text-center mb-4">
          Your Academic Profile
        </h2>

        {/* Education Level - radio cards */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Current Education Level *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {levelOptions.map((level) => {
              const selected = formData.educationLevel === level;
              return (
                <button
                  type="button"
                  key={level}
                  onClick={() =>
                    setFormData({ ...formData, educationLevel: level })
                  }
                  className={
                    `text-left px-4 py-3 rounded-xl border transition ` +
                    (selected
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                      : "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600")
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{level}</div>
                    <span
                      className={`material-symbols-outlined text-sm ${
                        selected ? "text-blue-400" : "text-slate-500"
                      }`}
                    >
                      {selected
                        ? "radio_button_checked"
                        : "radio_button_unchecked"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* School Name - manual input */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            School Name *
          </label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={(e) =>
              setFormData({ ...formData, schoolName: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your school name"
            required
          />
        </div>

        {/* Grade/Year */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Grade/Year *
          </label>
          <select
            value={formData.gradeYear}
            onChange={(e) =>
              setFormData({ ...formData, gradeYear: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
            title="Grade/Year"
          >
            <option value="">Select</option>
            {gradeYearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Expected Graduation Year */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Expected Graduation Year *
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) =>
              setFormData({ ...formData, graduationYear: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
            title="Expected Graduation Year"
          >
            <option value="">Select year</option>
            {graduationYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* GPA */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            GPA (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={formData.gpa}
              onChange={(e) =>
                setFormData({ ...formData, gpa: e.target.value })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 3.7"
            />
            <select
              value={formData.gpaScale}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gpaScale: e.target.value as AcademicFormData["gpaScale"],
                })
              }
              className="w-28 px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              title="GPA Scale"
            >
              {(["4.0", "5.0", "100", "Other"] as const).map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Major */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Major/Field of Study *
          </label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) =>
              setFormData({ ...formData, major: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="Start typing to search..."
            required
          />
        </div>

        {/* Minor */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Minor (optional)
          </label>
          <input
            type="text"
            value={formData.minor}
            onChange={(e) =>
              setFormData({ ...formData, minor: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="Start typing to search..."
          />
        </div>

        {/* Test Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              SAT Score (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.sat}
                onChange={(e) =>
                  setFormData({ ...formData, sat: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., 1450"
              />
              <span className="text-sm text-slate-400">/ 1600</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              IELTS Score (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ielts}
                onChange={(e) =>
                  setFormData({ ...formData, ielts: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., 7.5"
              />
              <span className="text-sm text-slate-400">/ 9</span>
            </div>
          </div>
        </div>

        {/* Class Rank */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Class Rank (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={formData.classRank}
              onChange={(e) =>
                setFormData({ ...formData, classRank: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="Rank"
            />
            <input
              type="number"
              value={formData.classSize}
              onChange={(e) =>
                setFormData({ ...formData, classSize: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="Class size"
            />
          </div>
          <div className="mt-1 text-sm text-slate-400">
            <span className="align-middle mr-1">💡</span>
            Adding test scores increases scholarship matches by 25%
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 transition flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition flex items-center gap-1"
          >
            Save & Continue
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
