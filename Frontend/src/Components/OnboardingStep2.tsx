import { useState } from "react";
import axios from 'axios';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/profile/academic',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Academic profile updated successfully:', response.data);
      
      // Only proceed to next step if API call is successful
      onNext(formData);
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Better error handling
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to save academic information. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl max-h-[450px] mx-auto">
      {/* Header - compact single line (leave right edge free for close button) */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-10">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary-500)] to-[var(--color-primary-600)]" />
          <span className="text-sm font-semibold">Lumos</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="truncate text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
            Step 2 of 5: Academic Information
          </span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
              <div className="h-full w-2/5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]" />
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">40%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl font-bold text-center mb-4 text-[var(--color-text-primary)]">
          Your Academic Profile
        </h2>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Education Level - radio cards */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                  disabled={isSubmitting}
                  className={
                    `text-left px-4 py-3 rounded-xl border transition ` +
                    (selected
                      ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--color-text-primary)] shadow-[0_0_0_3px_rgba(8,203,0,0.15)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-primary)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]") +
                    (isSubmitting ? " opacity-50 cursor-not-allowed" : "")
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{level}</div>
                    <span
                      className={`material-symbols-outlined text-sm ${
                        selected ? "text-[var(--color-primary-400)]" : "text-[var(--color-text-secondary)]"
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
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            School Name *
          </label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={(e) =>
              setFormData({ ...formData, schoolName: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            placeholder="Enter your school name"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Grade/Year */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Grade/Year *
          </label>
          <select
            value={formData.gradeYear}
            onChange={(e) =>
              setFormData({ ...formData, gradeYear: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            required
            title="Grade/Year"
            disabled={isSubmitting}
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
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Expected Graduation Year *
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) =>
              setFormData({ ...formData, graduationYear: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            required
            title="Expected Graduation Year"
            disabled={isSubmitting}
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
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
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
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              placeholder="e.g., 3.7"
              disabled={isSubmitting}
            />
            <select
              value={formData.gpaScale}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gpaScale: e.target.value as AcademicFormData["gpaScale"],
                })
              }
              className="w-28 px-2 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              title="GPA Scale"
              disabled={isSubmitting}
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
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Major/Field of Study *
          </label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) =>
              setFormData({ ...formData, major: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            placeholder="Start typing to search..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Minor */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Minor (optional)
          </label>
          <input
            type="text"
            value={formData.minor}
            onChange={(e) =>
              setFormData({ ...formData, minor: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            placeholder="Start typing to search..."
            disabled={isSubmitting}
          />
        </div>

        {/* Test Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
              SAT Score (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.sat}
                onChange={(e) =>
                  setFormData({ ...formData, sat: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
                placeholder="e.g., 1450"
                disabled={isSubmitting}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">/ 1600</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
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
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
                placeholder="e.g., 7.5"
                disabled={isSubmitting}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">/ 9</span>
            </div>
          </div>
        </div>

        {/* Class Rank */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Class Rank (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={formData.classRank}
              onChange={(e) =>
                setFormData({ ...formData, classRank: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              placeholder="Rank"
              disabled={isSubmitting}
            />
            <input
              type="number"
              value={formData.classSize}
              onChange={(e) =>
                setFormData({ ...formData, classSize: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              placeholder="Class size"
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
            <span className="align-middle mr-1">💡</span>
            Adding test scores increases scholarship matches by 25%
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white font-semibold hover:scale-[1.02] transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}