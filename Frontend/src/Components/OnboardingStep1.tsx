import { useState } from "react";
import axios from 'axios';

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
  const stateOptionsByCountry: Record<string, string[]> = {
    BD: [
      "Barishal",
      "Chattogram",
      "Dhaka",
      "Khulna",
      "Rajshahi",
      "Rangpur",
      "Mymensingh",
      "Sylhet",
    ],
  };
  
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        'http://localhost:5000/api/users/profile/basic',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Profile updated successfully:', response.data);
      
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
        setError('Failed to save information. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl max-h-[450px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-10">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary-500)] to-[var(--color-primary-600)]" />
          <span className="text-sm font-semibold">Lumos</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="truncate text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
            Step 1 of 5: Basic Information
          </span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
              <div className="h-full w-1/5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]" />
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">20%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-center mb-6 text-[var(--color-text-primary)]">
          Tell us about yourself
        </h2>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              required
              placeholder="Enter your first name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              required
              placeholder="Enter your last name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
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
              className="px-2 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              required
              disabled={isSubmitting}
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
              className="px-2 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              required
              disabled={isSubmitting}
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
              className="px-2 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              required
              disabled={isSubmitting}
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
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Country *</label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value, state: "" })
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            required
            aria-label="Country"
            title="Country"
            disabled={isSubmitting}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="BD">Bangladesh</option>
            <option value="IN">India</option>
            <option value="PK">Pakistan</option>
            <option value="SA">Saudi Arabia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
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
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            required
            disabled={isSubmitting}
          >
            <option value="">Select State</option>
            {(stateOptionsByCountry[formData.country] || []).map(
              (stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
            required
            placeholder="Enter your city"
            title="City"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone number */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">
            Phone Number (optional)
          </label>
          <div className="flex gap-2">
            <select
              className="w-20 px-2 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              aria-label="Country code"
              title="Country code"
              disabled={isSubmitting}
            >
              <option value="+880">+880</option>
            </select>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
              placeholder="(___) ___-____"
              disabled={isSubmitting}
            />
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