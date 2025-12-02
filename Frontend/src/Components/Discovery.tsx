import React, { useState, useMemo } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

// Mock Data
const MOCK_SCHOLARSHIPS = [
  {
    id: 1,
    title: "Tech Leaders Scholarship",
    org: "Tech Foundation Inc.",
    amount: 5000,
    deadline: "2024-02-15",
    match: 89,
    tags: ["CS major", "3.8 GPA", "First-gen"],
    requirements: ["Essay (500w)", "Transcript", "1 LOR"],
    saved: false,
    featured: true,
  },
  {
    id: 2,
    title: "Women in STEM Award",
    org: "Future Innovators",
    amount: 3000,
    deadline: "2024-03-01",
    match: 82,
    tags: ["Women", "STEM", "Research"],
    requirements: ["Research Project", "No Essay"],
    saved: false,
    featured: false,
  },
  {
    id: 3,
    title: "Community Service Leaders",
    org: "Global Impact Fund",
    amount: 2500,
    deadline: "2024-03-15",
    match: 78,
    tags: ["Volunteering", "Leadership"],
    requirements: ["100+ Hours Service", "Ref"],
    saved: false,
    featured: false,
  },
  {
    id: 4,
    title: "NextGen Coding Grant",
    org: "DevWorld",
    amount: 1000,
    deadline: "2024-04-10",
    match: 95,
    tags: ["Coding", "Project-based"],
    requirements: ["GitHub Portfolio"],
    saved: true,
    featured: false,
  },
  {
    id: 5,
    title: "Cybersecurity Excellence",
    org: "SecureNet",
    amount: 7500,
    deadline: "2024-02-28",
    match: 65,
    tags: ["Cybersecurity", "Certifications"],
    requirements: ["CTF Participation"],
    saved: false,
    featured: false,
  },
];

export default function Discovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    amount: [] as string[],
    deadline: "Next 30d",
    eligibility: [] as string[],
    category: ["STEM"],
    demographics: ["First-Gen"],
    requirements: ["No Essay"],
    location: "National",
  });
  const [viewMode, setViewMode] = useState<"list" | "cards" | "compact">("list");

  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter Logic (Mock)
  const filteredScholarships = useMemo(() => {
    return MOCK_SCHOLARSHIPS.filter((s) => {
      if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Add more filter logic here as needed for the mock
      return true;
    });
  }, [searchQuery, filters]);

  // Mock Suggestions Data
  const suggestions = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return {
      scholarships: MOCK_SCHOLARSHIPS.filter(s => s.title.toLowerCase().includes(q)).slice(0, 2),
      tags: [
        { label: "Technology", count: 15 },
        { label: "Leadership", count: 23 }
      ].filter(t => t.label.toLowerCase().includes(q) || q === "tech"),
      orgs: MOCK_SCHOLARSHIPS.filter(s => s.org.toLowerCase().includes(q)).map(s => ({ name: s.org, count: 3 })).slice(0, 1)
    };
  }, [searchQuery]);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [category]: current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      } else {
        return { ...prev, [category]: value };
      }
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden font-sans">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none sticky top-0">
                <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/10 blur-[200px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/10 blur-[200px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* Filters Sidebar (Desktop) */}
                <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Filters</h3>
                        
                        {/* Award Amount */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                💰 Award Amount
                            </h4>
                            <div className="space-y-2">
                                {["$500-1K", "$1K-2.5K", "$2.5K-5K", "$5K+"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.amount.includes(opt) ? "bg-blue-600 border-blue-600" : "border-slate-600 bg-slate-800/50 group-hover:border-slate-500"}`}>
                                            {filters.amount.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.amount.includes(opt)}
                                            onChange={() => toggleFilter("amount", opt)}
                                        />
                                        <span className={`text-sm ${filters.amount.includes(opt) ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                📅 Deadline
                            </h4>
                            <div className="space-y-2">
                                {["Next 7d", "Next 30d", "Next 60d", "60+ days"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${filters.deadline === opt ? "border-blue-500" : "border-slate-600 group-hover:border-slate-500"}`}>
                                            {filters.deadline === opt && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            className="hidden" 
                                            checked={filters.deadline === opt}
                                            onChange={() => setFilters(prev => ({ ...prev, deadline: opt }))}
                                        />
                                        <span className={`text-sm ${filters.deadline === opt ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Eligibility */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                🎓 Eligibility
                            </h4>
                            <div className="space-y-2">
                                {["HS Only", "College", "Graduate", "International"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.eligibility.includes(opt) ? "bg-blue-600 border-blue-600" : "border-slate-600 bg-slate-800/50 group-hover:border-slate-500"}`}>
                                            {filters.eligibility.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.eligibility.includes(opt)}
                                            onChange={() => toggleFilter("eligibility", opt)}
                                        />
                                        <span className={`text-sm ${filters.eligibility.includes(opt) ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                🏷️ Category
                            </h4>
                            <div className="space-y-2">
                                {["STEM", "Business", "Arts", "Service", "Sports"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.category.includes(opt) ? "bg-blue-600 border-blue-600" : "border-slate-600 bg-slate-800/50 group-hover:border-slate-500"}`}>
                                            {filters.category.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.category.includes(opt)}
                                            onChange={() => toggleFilter("category", opt)}
                                        />
                                        <span className={`text-sm ${filters.category.includes(opt) ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                            <button 
                                onClick={() => setFilters({
                                    amount: [],
                                    deadline: "Next 30d",
                                    eligibility: [],
                                    category: [],
                                    demographics: [],
                                    requirements: [],
                                    location: "National"
                                })}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            >
                                Reset All
                            </button>
                            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-900/20">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Hero Search */}
                    <div className="relative mb-8 z-50">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-400 transition">search</span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="block w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-xl"
                                placeholder="Search 10,000+ scholarships..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Ctrl + K</span>
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (searchQuery || true) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/30">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            🔍 Suggestions
                                        </h4>
                                    </div>
                                    
                                    {/* Specific Scholarships */}
                                    {suggestions?.scholarships && suggestions.scholarships.length > 0 && (
                                        <div className="py-2">
                                            {suggestions.scholarships.map(s => (
                                                <button key={s.id} className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-3 group transition">
                                                    <span className="text-lg">📄</span>
                                                    <span className="text-slate-300 group-hover:text-white">{s.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tags/Categories */}
                                    {suggestions?.tags && suggestions.tags.length > 0 && (
                                        <div className="py-2 border-t border-slate-800">
                                            {suggestions.tags.map((t, i) => (
                                                <button key={i} className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-3 group transition">
                                                    <span className="text-lg">🏷️</span>
                                                    <div>
                                                        <span className="text-slate-300 group-hover:text-white block">{t.label}</span>
                                                        <span className="text-xs text-slate-500">{t.count} results</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Organizations */}
                                    {suggestions?.orgs && suggestions.orgs.length > 0 && (
                                        <div className="py-2 border-t border-slate-800 bg-slate-800/20">
                                            {suggestions.orgs.map((o, i) => (
                                                <button key={i} className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-3 group transition">
                                                    <span className="text-lg">🏢</span>
                                                    <div>
                                                        <span className="text-slate-300 group-hover:text-white block">{o.name}</span>
                                                        <span className="text-xs text-slate-500">{o.count} scholarships</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Default / Empty State */}
                                    {(!suggestions || (suggestions.scholarships.length === 0 && suggestions.tags.length === 0 && suggestions.orgs.length === 0)) && (
                                         <div className="p-4 text-center text-slate-500 text-sm">
                                            Type to see suggestions...
                                         </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                            <span>Try:</span>
                            {["Computer Science", "First-Gen", "$5000", "No Essay Required"].map((term) => (
                                <button 
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                                >
                                    "{term}"
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {["All", "High Match >80%", "Due This Month", "No Essay", "Renewable", "Under $2K", "First-Gen", "Women", "STEM"].map((filter) => (
                            <button
                                key={filter}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">
                            Showing {filteredScholarships.length} scholarships
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>Sort by:</span>
                                <select className="bg-transparent border-none text-slate-200 font-medium focus:ring-0 cursor-pointer">
                                    <option>Best Match</option>
                                    <option>Deadline</option>
                                    <option>Amount</option>
                                </select>
                            </div>
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                <button 
                                    onClick={() => setViewMode("cards")}
                                    className={`p-1.5 rounded ${viewMode === "cards" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    <span className="material-symbols-outlined text-sm">grid_view</span>
                                </button>
                                <button 
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded ${viewMode === "list" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    <span className="material-symbols-outlined text-sm">view_list</span>
                                </button>
                                <button 
                                    onClick={() => setViewMode("compact")}
                                    className={`p-1.5 rounded ${viewMode === "compact" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    <span className="material-symbols-outlined text-sm">reorder</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="space-y-4">
                        {filteredScholarships.length > 0 ? (
                            filteredScholarships.map((scholarship) => (
                                <div 
                                    key={scholarship.id}
                                    className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.1)]"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{scholarship.title}</h3>
                                                    <p className="text-slate-400 text-sm mt-1">{scholarship.org}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-pink-500 transition">
                                                        ❤️
                                                    </button>
                                                    <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition">
                                                        💾
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-slate-200">
                                                    <span className="text-emerald-400">💰</span>
                                                    <span className="font-semibold">${scholarship.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-200">
                                                    <span className="text-blue-400">📅</span>
                                                    <span>{new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-sm font-medium text-slate-300">⭐ {scholarship.match}% Match</span>
                                                    <div className="flex-1 h-2 bg-slate-800 rounded-full max-w-[150px] overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${scholarship.match >= 80 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`} 
                                                            style={{ width: `${scholarship.match}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {scholarship.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                                                            ✅ {tag}
                                                        </span>
                                                    ))}
                                                    {scholarship.requirements.map(req => (
                                                        <span key={req} className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
                                                            📝 {req}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                                            <Link 
                                                to="/details"
                                                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition text-center flex items-center justify-center"
                                            >
                                                View Details
                                            </Link>
                                            <button className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-900/20 text-center">
                                                Start Application
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 rounded-3xl border border-slate-800 bg-slate-900/30 border-dashed">
                                <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                                    <span className="text-4xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Scholarships Found</h3>
                                <p className="text-slate-400 max-w-md mx-auto mb-6">
                                    We couldn't find scholarships matching your current filters. Try removing some filters or searching with different keywords.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => setFilters({
                                            amount: [],
                                            deadline: "Next 30d",
                                            eligibility: [],
                                            category: [],
                                            demographics: [],
                                            requirements: [],
                                            location: "National"
                                        })}
                                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
                                    >
                                        Reset All Filters
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition">
                                        Browse Popular
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {filteredScholarships.length > 0 && (
                        <div className="mt-8 text-center">
                            <button className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition">
                                Load 5 More Results
                            </button>
                            <p className="text-xs text-slate-500 mt-2">Showing {filteredScholarships.length} of 47</p>
                        </div>
                    )}

                    {/* Not Finding What You Need */}
                    <div className="mt-12 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10 p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-xl">
                                <span className="text-2xl">💡</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">NOT FINDING WHAT YOU NEED?</h3>
                                <ul className="space-y-2 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <button className="hover:text-blue-400 hover:underline text-left">Request New Scholarships</button>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <button className="hover:text-blue-400 hover:underline text-left">Update Your Profile to improve matches</button>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <button className="hover:text-blue-400 hover:underline text-left">Browse All Categories</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
