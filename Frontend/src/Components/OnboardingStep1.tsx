import { useState } from "react";

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  country: string;
  state: string;
  city: string;
  phone: string;
}

interface OnboardingStep1Props {
  onBack: () => void;
  onNext: (data: OnboardingFormData) => void;
}

export default function OnboardingStep1({
  onBack,
  onNext,
}: OnboardingStep1Props) {
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: {
      month: "",
      day: "",
      year: "",
    },
    country: "",
    state: "",
    city: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500" />
          <span className="font-semibold">Lumos</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Step 1 of 5: Basic Information
            </span>
            <span className="text-sm text-slate-400">20%</span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-1/5 bg-linear-to-r from-blue-500 to-indigo-500" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-center mb-6">
          Tell us about yourself
        </h2>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Date of Birth *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              aria-label="Month"
              title="Month"
              value={formData.dateOfBirth.month}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dateOfBirth: {
                    ...formData.dateOfBirth,
                    month: e.target.value,
                  },
                })
              }
              className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              aria-label="Day"
              title="Day"
              value={formData.dateOfBirth.day}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dateOfBirth: { ...formData.dateOfBirth, day: e.target.value },
                })
              }
              className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              aria-label="Year"
              title="Year"
              value={formData.dateOfBirth.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dateOfBirth: {
                    ...formData.dateOfBirth,
                    year: e.target.value,
                  },
                })
              }
              className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            >
              <option value="">Year</option>
              {Array.from(
                { length: 30 },
                (_, i) => new Date().getFullYear() - 30 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location fields */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Country *</label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
            aria-label="Country"
            title="Country"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            State/Province *
          </label>
          <select
            id="state-select"
            aria-label="State/Province"
            title="State/Province"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
          >
            <option value="">Select State</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
            placeholder="Enter your city"
            title="City"
          />
        </div>

        {/* Phone number */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Phone Number (optional)
          </label>
          <div className="flex gap-2">
            <select
              className="w-20 px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              aria-label="Country code"
              title="Country code"
            >
              <option value="+1">+1</option>
            </select>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="(___) ___-____"
            />
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
