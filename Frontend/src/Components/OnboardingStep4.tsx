import { useState } from "react";

interface BackgroundFormData {
  gender: string;
  ethnicities: string[];
  ethnicityOther: string;
  firstGen: "Yes" | "No" | "Prefer not to say" | "";
  citizenship: "U.S. Citizen" | "Permanent Resident" | "International Student" | "DACA Recipient" | "Other" | "";
  citizenshipOther: string;
  incomeRange: string;
  military: {
    veteran: boolean;
    active: boolean;
    parentVeteran: boolean;
    parentActive: boolean;
    none: boolean;
  };
  disability: "Yes" | "No" | "Prefer not to say" | "";
  disabilityDetails: string;
}

interface OnboardingStep4Props {
  onBack: () => void;
  onSkip: () => void;
  onNext: (data: BackgroundFormData) => void;
}

export default function OnboardingStep4({ onBack, onSkip, onNext }: OnboardingStep4Props) {
  const [formData, setFormData] = useState<BackgroundFormData>({
    gender: "",
    ethnicities: [],
    ethnicityOther: "",
    firstGen: "",
    citizenship: "",
    citizenshipOther: "",
    incomeRange: "",
    military: { veteran: false, active: false, parentVeteran: false, parentActive: false, none: false },
    disability: "",
    disabilityDetails: "",
  });

  const toggleEthnicity = (v: string) => {
    setFormData((prev) => ({
      ...prev,
      ethnicities: prev.ethnicities.includes(v)
        ? prev.ethnicities.filter((e) => e !== v)
        : [...prev.ethnicities, v],
    }));
  };

  const setMilitary = (key: keyof BackgroundFormData["military"], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      military: { ...prev.military, [key]: value, ...(key === "none" && value ? { veteran: false, active: false, parentVeteran: false, parentActive: false } : {}) },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="w-full max-w-xl max-h-[450px] mx-auto">
      {/* Header - compact single line */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-10">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="inline-block w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500" />
          <span className="text-sm font-semibold">Lumos</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="truncate text-xs sm:text-sm font-medium text-slate-200">Step 4 of 5: Background Information</span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-4/5 bg-linear-to-r from-blue-500 to-indigo-500" />
            </div>
            <span className="text-xs text-slate-400">80%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Why we ask */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
          <div className="font-semibold mb-1">ℹ️ Why we ask this</div>
          <p>Many scholarships target specific demographics to promote diversity and equity. Sharing this info unlocks scholarships you'd otherwise miss.</p>
          <ul className="mt-2 space-y-1 text-slate-400">
            <li>• All fields are optional</li>
            <li>• Your data is private and encrypted</li>
            <li>• Skip any question you're uncomfortable with</li>
          </ul>
        </section>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Gender Identity</label>
          <input
            list="gender-options"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="Select or enter custom"
          />
          <datalist id="gender-options">
            <option value="Male" />
            <option value="Female" />
            <option value="Non-binary" />
            <option value="Prefer not to say" />
          </datalist>
        </div>

        {/* Ethnicity */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Race/Ethnicity (Select all that apply)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              "African American / Black",
              "Asian / Pacific Islander",
              "Hispanic / Latino",
              "Native American / Indigenous",
              "White / Caucasian",
              "Middle Eastern",
              "Multi-racial",
            ].map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <input
                  type="checkbox"
                  checked={formData.ethnicities.includes(opt)}
                  onChange={() => toggleEthnicity(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[auto,1fr] items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.ethnicities.includes("Other")}
              onChange={() => toggleEthnicity("Other")}
            />
            <div className="grid grid-cols-[auto,1fr] items-center gap-2">
              <span>Other:</span>
              <input
                type="text"
                value={formData.ethnicityOther}
                onChange={(e) => setFormData({ ...formData, ethnicityOther: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="Describe"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.ethnicities.includes("Prefer not to say")}
                onChange={() => toggleEthnicity("Prefer not to say")}
              />
              <span>Prefer not to say</span>
            </label>
          </div>
        </div>

        {/* First generation */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Are you a first-generation college student?</label>
          <div className="text-slate-400 text-xs mb-2">(Neither parent completed a 4-year college degree)</div>
          <div className="flex flex-wrap gap-3 text-sm">
            {["Yes", "No", "Prefer not to say"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData({ ...formData, firstGen: opt as BackgroundFormData["firstGen"] })}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  formData.firstGen === opt
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Citizenship */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Citizenship Status</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              "U.S. Citizen",
              "Permanent Resident",
              "International Student",
              "DACA Recipient",
              "Other",
            ].map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <input
                  type="radio"
                  name="citizenship"
                  checked={formData.citizenship === opt}
                  onChange={() => setFormData({ ...formData, citizenship: opt as BackgroundFormData["citizenship"] })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {formData.citizenship === "Other" && (
            <input
              type="text"
              value={formData.citizenshipOther}
              onChange={(e) => setFormData({ ...formData, citizenshipOther: e.target.value })}
              className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="Please specify"
            />
          )}
        </div>

        {/* Family Income */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Family Income Range (optional)</label>
          <select
            value={formData.incomeRange}
            onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            title="Family Income Range"
          >
            <option value="">Select range</option>
            <option value="Under $30k">Under $30k</option>
            <option value="$30k-$50k">$30k-$50k</option>
            <option value="$50k-$75k">$50k-$75k</option>
            <option value="$75k-$100k">$75k-$100k</option>
            <option value="$100k+">$100k+</option>
          </select>
          <div className="mt-1 text-xs text-slate-400">🔒 Used only for need-based scholarship matching</div>
        </div>

        {/* Military */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Military Affiliation</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <input type="checkbox" checked={formData.military.veteran} onChange={(e) => setMilitary("veteran", e.target.checked)} />
              <span>I am a veteran</span>
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <input type="checkbox" checked={formData.military.active} onChange={(e) => setMilitary("active", e.target.checked)} />
              <span>I am active military</span>
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <input type="checkbox" checked={formData.military.parentVeteran} onChange={(e) => setMilitary("parentVeteran", e.target.checked)} />
              <span>Parent/Guardian is veteran</span>
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <input type="checkbox" checked={formData.military.parentActive} onChange={(e) => setMilitary("parentActive", e.target.checked)} />
              <span>Parent/Guardian is active military</span>
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 sm:col-span-2">
              <input type="checkbox" checked={formData.military.none} onChange={(e) => setMilitary("none", e.target.checked)} />
              <span>None</span>
            </label>
          </div>
        </div>

        {/* Disability */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Do you have any disabilities?</label>
          <div className="flex flex-wrap gap-3 text-sm">
            {["Yes", "No", "Prefer not to say"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData({ ...formData, disability: opt as BackgroundFormData["disability"] })}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  formData.disability === opt
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {formData.disability === "Yes" && (
            <input
              type="text"
              value={formData.disabilityDetails}
              onChange={(e) => setFormData({ ...formData, disabilityDetails: e.target.value })}
              className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="Optional details"
            />
          )}
        </div>

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
              Skip This Step
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition flex items-center gap-1"
            >
              Save & Continue
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


