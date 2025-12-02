import { useMemo, useState } from "react";
import axios from 'axios';

type Activity = {
  id: string;
  name: string;
  role: string;
  years: string;
  hoursPerWeek: string;
  description: string;
  expanded: boolean;
};

type Award = {
  id: string;
  title: string;
};

type Job = {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
};

interface Step3FormData {
  interests: string[];
  activities: Activity[];
  awards: Award[];
  jobs: Job[];
}

interface OnboardingStep3Props {
  onBack: () => void;
  onNext: (data: Step3FormData) => void;
}

export default function OnboardingStep3({ onBack, onNext }: OnboardingStep3Props) {
  const [interests, setInterests] = useState<string[]>(["Computer Science", "Robotics", "Volunteering", "Music", "Environmental Science"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Computer Science", "Robotics", "Volunteering"]);
  const [showInterestMenu, setShowInterestMenu] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: crypto.randomUUID(),
      name: "Debate Team",
      role: "Captain",
      years: "2 years",
      hoursPerWeek: "5",
      description: "Led team to state championships...",
      expanded: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Volunteer at Food Bank",
      role: "Volunteer",
      years: "1 year",
      hoursPerWeek: "3",
      description: "",
      expanded: false,
    },
  ]);

  const [awards, setAwards] = useState<Award[]>([
    { id: crypto.randomUUID(), title: "National Merit Scholar Semifinalist" },
    { id: crypto.randomUUID(), title: "AP Scholar with Distinction" },
  ]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = useMemo(
    () => [
      "Computer Science",
      "Data Science",
      "AI/ML",
      "Robotics",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Environmental Science",
      "Economics",
      "Business",
      "Entrepreneurship",
      "Public Policy",
      "Volunteering",
      "Community Service",
      "Music",
      "Art & Design",
      "Sports",
      "Writing",
      "Debate",
    ],
    []
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

      // Prepare data without UI-specific fields (id, expanded)
      const apiData = {
        interests: selectedInterests,
        activities: activities.map(({ id, expanded, ...rest }) => rest),
        awards: awards.map(({ id, ...rest }) => rest),
        jobs: jobs.map(({ id, ...rest }) => rest),
      };

      const response = await axios.put(
        'http://localhost:5000/api/users/profile/activities',
        apiData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Activities profile updated successfully:', response.data);
      
      // Only proceed to next step if API call is successful
      onNext({ interests: selectedInterests, activities, awards, jobs });
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Better error handling
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to save activities information. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (isSubmitting) return;
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (isSubmitting) return;
    const name = prompt("Add a new interest");
    if (!name) return;
    if (!interests.includes(name)) setInterests((prev) => [...prev, name]);
    if (!selectedInterests.includes(name)) setSelectedInterests((prev) => [...prev, name]);
  };

  const addActivity = () => {
    if (isSubmitting) return;
    setActivities((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        role: "",
        years: "",
        hoursPerWeek: "",
        description: "",
        expanded: true,
      },
    ]);
  };

  const updateActivity = (id: string, patch: Partial<Activity>) => {
    if (isSubmitting) return;
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const deleteActivity = (id: string) => {
    if (isSubmitting) return;
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const addAward = () => {
    if (isSubmitting) return;
    const title = prompt("Add award title");
    if (!title) return;
    setAwards((prev) => [...prev, { id: crypto.randomUUID(), title }]);
  };

  const deleteAward = (id: string) => {
    if (isSubmitting) return;
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  const addJob = () => {
    if (isSubmitting) return;
    setJobs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", organization: "", duration: "", description: "" },
    ]);
  };

  const updateJob = (id: string, patch: Partial<Job>) => {
    if (isSubmitting) return;
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  };

  const deleteJob = (id: string) => {
    if (isSubmitting) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
          <span className="truncate text-xs sm:text-sm font-medium text-slate-200">
            Step 3 of 5: Activities & Interests
          </span>
          <div className="flex items-center gap-2 ml-auto min-w-[120px]">
            <div className="w-24 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-3/5 bg-linear-to-r from-blue-500 to-indigo-500" />
            </div>
            <span className="text-xs text-slate-400">60%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">What are you passionate about?</h2>
          <p className="mt-1 text-slate-400 text-sm">This helps us find scholarships tailored to you</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Interests */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Interests</h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowInterestMenu((s) => !s)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                + Add Interest
              </button>
              {showInterestMenu && (
                <div className="absolute right-0 mt-2 w-56 max-h-60 overflow-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl z-10">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={addCustomInterest}
                      className="w-full text-left px-2 py-1.5 rounded-md text-blue-300 hover:bg-slate-800 text-sm"
                    >
                      + Create custom interest
                    </button>
                  </div>
                  <div className="border-t border-slate-800" />
                  {interestOptions.map((opt) => {
                    const active = selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${active ? "text-blue-300" : "text-slate-200"}`}
                      >
                        {active ? "✓ " : ""}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected chips */}
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700/60 border border-slate-600 text-sm">
                {i}
                <button 
                  type="button" 
                  onClick={() => toggleInterest(i)} 
                  className="text-slate-300 hover:text-white disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">💡 Select at least 3 for better matches</div>
        </section>

        {/* Extracurricular Activities */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Extracurricular Activities</h3>
            <button
              type="button"
              onClick={addActivity}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              + Add Activity
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="rounded-lg border border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="font-medium truncate">
                    Activity: {a.name || <span className="text-slate-500">Untitled</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateActivity(a.id, { expanded: !a.expanded })}
                      className="text-sm text-slate-300 hover:text-white disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {a.expanded ? "Collapse ▲" : "Expand ▼"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteActivity(a.id)}
                      className="text-sm text-rose-300 hover:text-rose-200 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      × Delete
                    </button>
                  </div>
                </div>
                {a.expanded && (
                  <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Activity</label>
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => updateActivity(a.id, { name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        placeholder="e.g., Debate Team"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Role</label>
                      <input
                        type="text"
                        value={a.role}
                        onChange={(e) => updateActivity(a.id, { role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        placeholder="e.g., Captain"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Years</label>
                      <input
                        type="text"
                        value={a.years}
                        onChange={(e) => updateActivity(a.id, { years: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        placeholder="e.g., 2 years"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Hours/week</label>
                      <input
                        type="number"
                        value={a.hoursPerWeek}
                        onChange={(e) => updateActivity(a.id, { hoursPerWeek: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        placeholder="e.g., 5"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <textarea
                        value={a.description}
                        onChange={(e) => updateActivity(a.id, { description: e.target.value })}
                        className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        placeholder="What did you accomplish?"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Honors & Awards */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Honors & Awards (Optional)</h3>
            <button
              type="button"
              onClick={addAward}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              + Add Award
            </button>
          </div>
          <ul className="space-y-2">
            {awards.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2">
                <span className="text-sm">• {a.title}</span>
                <button 
                  type="button" 
                  onClick={() => deleteAward(a.id)} 
                  className="text-sm text-rose-300 hover:text-rose-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  × Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Work Experience */}
        <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Work Experience (Optional)</h3>
            <button
              type="button"
              onClick={addJob}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              + Add Job
            </button>
          </div>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Job Title</label>
                    <input
                      type="text"
                      value={j.title}
                      onChange={(e) => updateJob(j.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      placeholder="e.g., Tutor"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Organization</label>
                    <input
                      type="text"
                      value={j.organization}
                      onChange={(e) => updateJob(j.id, { organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      placeholder="e.g., Local Community Center"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      value={j.duration}
                      onChange={(e) => updateJob(j.id, { duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      placeholder="e.g., Jun 2023 - Aug 2024"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <textarea
                      value={j.description}
                      onChange={(e) => updateJob(j.id, { description: e.target.value })}
                      className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      placeholder="What did you do and achieve?"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => deleteJob(j.id)} 
                    className="text-sm text-rose-300 hover:text-rose-200 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    × Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}