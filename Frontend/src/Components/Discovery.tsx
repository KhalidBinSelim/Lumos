import React, { useState, useMemo } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";
import SubscriptionModal from "./SubscriptionModal";

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
  const [viewMode, setViewMode] = useState<"cards" | "list" | "compact">("cards");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const [filters, setFilters] = useState({
    amount: [] as string[],
    deadline: "Next 30d",
    eligibility: [] as string[],
    category: [] as string[],
    demographics: [] as string[],
    requirements: [] as string[],
    location: "National"
  });

  const suggestions = useMemo(() => {
    if (!searchQuery) return null;
    
    return {
      scholarships: MOCK_SCHOLARSHIPS.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3),
      tags: [
        { label: "Computer Science", count: 47 },
        { label: "First Generation", count: 23 }
      ],
      orgs: [
        { name: "Tech Foundation", count: 5 }
      ]
    };
  }, [searchQuery]);

  const filteredScholarships = useMemo(() => {
    return MOCK_SCHOLARSHIPS.filter(s =>
      !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.org.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFilter = (category: string, value: string) => {
    setFilters(prev => {
      const current = prev[category as keyof typeof prev];
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
    <div className="flex flex-col h-screen w-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden font-sans transition-colors duration-300">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          onSubscriptionsClick={() => setShowSubscriptionModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onHelpClick={() => setShowHelpModal(true)}
        />

        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none sticky top-0">
                <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* Filters Sidebar (Desktop) */}
                <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Filters</h3>
                        
                        {/* Award Amount */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                💰 Award Amount
                            </h4>
                            <div className="space-y-2">
                                {["$500-1K", "$1K-2.5K", "$2.5K-5K", "$5K+"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.amount.includes(opt) ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)]" : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] group-hover:border-[var(--color-text-secondary)]"}`}>
                                            {filters.amount.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.amount.includes(opt)}
                                            onChange={() => toggleFilter("amount", opt)}
                                        />
                                        <span className={`text-sm ${filters.amount.includes(opt) ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                📅 Deadline
                            </h4>
                            <div className="space-y-2">
                                {["Next 7d", "Next 30d", "Next 60d", "60+ days"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${filters.deadline === opt ? "border-[var(--color-primary-500)]" : "border-[var(--color-border)] group-hover:border-[var(--color-text-secondary)]"}`}>
                                            {filters.deadline === opt && <div className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            className="hidden" 
                                            checked={filters.deadline === opt}
                                            onChange={() => setFilters(prev => ({ ...prev, deadline: opt }))}
                                        />
                                        <span className={`text-sm ${filters.deadline === opt ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Eligibility */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                🎓 Eligibility
                            </h4>
                            <div className="space-y-2">
                                {["HS Only", "College", "Graduate", "International"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.eligibility.includes(opt) ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)]" : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] group-hover:border-[var(--color-text-secondary)]"}`}>
                                            {filters.eligibility.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.eligibility.includes(opt)}
                                            onChange={() => toggleFilter("eligibility", opt)}
                                        />
                                        <span className={`text-sm ${filters.eligibility.includes(opt) ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                🏷️ Category
                            </h4>
                            <div className="space-y-2">
                                {["STEM", "Business", "Arts", "Service", "Sports"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.category.includes(opt) ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)]" : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] group-hover:border-[var(--color-text-secondary)]"}`}>
                                            {filters.category.includes(opt) && <span className="text-xs text-white">✓</span>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={filters.category.includes(opt)}
                                            onChange={() => toggleFilter("category", opt)}
                                        />
                                        <span className={`text-sm ${filters.category.includes(opt) ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-border)]">
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
                                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition"
                            >
                                Reset All
                            </button>
                            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white transition shadow-lg shadow-[var(--color-primary-500)]/20">
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
                                <span className="material-symbols-outlined text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary-500)] transition">search</span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="block w-full pl-12 pr-4 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/20 outline-none transition shadow-xl"
                                placeholder="Search 10,000+ scholarships..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded">Ctrl + K</span>
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (searchQuery || true) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/30">
                                        <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                            🔍 Suggestions
                                        </h4>
                                    </div>
                                    
                                    {/* Specific Scholarships */}
                                    {suggestions?.scholarships && suggestions.scholarships.length > 0 && (
                                        <div className="py-2">
                                            {suggestions.scholarships.map(s => (
                                                <button key={s.id} className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-3 group transition">
                                                    <span className="text-lg">📄</span>
                                                    <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">{s.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tags/Categories */}
                                    {suggestions?.tags && suggestions.tags.length > 0 && (
                                        <div className="py-2 border-t border-[var(--color-border)]">
                                            {suggestions.tags.map((t, i) => (
                                                <button key={i} className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-3 group transition">
                                                    <span className="text-lg">🏷️</span>
                                                    <div>
                                                        <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] block">{t.label}</span>
                                                        <span className="text-xs text-[var(--color-text-secondary)]">{t.count} results</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Organizations */}
                                    {suggestions?.orgs && suggestions.orgs.length > 0 && (
                                        <div className="py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/20">
                                            {suggestions.orgs.map((o, i) => (
                                                <button key={i} className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-3 group transition">
                                                    <span className="text-lg">🏢</span>
                                                    <div>
                                                        <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] block">{o.name}</span>
                                                        <span className="text-xs text-[var(--color-text-secondary)]">{o.count} scholarships</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Default / Empty State */}
                                    {(!suggestions || (suggestions.scholarships.length === 0 && suggestions.tags.length === 0 && suggestions.orgs.length === 0)) && (
                                         <div className="p-4 text-center text-[var(--color-text-secondary)] text-sm">
                                            Type to see suggestions...
                                         </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--color-text-secondary)]">
                            <span>Try:</span>
                            {["Computer Science", "First-Gen", "$5000", "No Essay Required"].map((term) => (
                                <button 
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] hover:underline cursor-pointer"
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
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)] transition"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            Showing {filteredScholarships.length} scholarships
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <span>Sort by:</span>
                                <select className="bg-transparent border-none text-[var(--color-text-primary)] font-medium focus:ring-0 cursor-pointer">
                                    <option>Best Match</option>
                                    <option>Deadline</option>
                                    <option>Amount</option>
                                </select>
                            </div>
                            <div className="flex bg-[var(--color-bg-secondary)] rounded-lg p-1">
                                <button 
                                    onClick={() => setViewMode("cards")}
                                    className={`p-1.5 rounded ${viewMode === "cards" ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                                >
                                    <span className="material-symbols-outlined text-sm">grid_view</span>
                                </button>
                                <button 
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded ${viewMode === "list" ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                                >
                                    <span className="material-symbols-outlined text-sm">view_list</span>
                                </button>
                                <button 
                                    onClick={() => setViewMode("compact")}
                                    className={`p-1.5 rounded ${viewMode === "compact" ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
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
                                    className="group relative bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-primary-500)]/30 hover:bg-[var(--color-bg-secondary)]/80 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.1)]"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-500)] transition">{scholarship.title}</h3>
                                                    <p className="text-[var(--color-text-secondary)] text-sm mt-1">{scholarship.org}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-pink-500 transition">
                                                        ❤️
                                                    </button>
                                                    <button className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition">
                                                        💾
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                                                    <span className="text-[var(--color-primary-500)]">💰</span>
                                                    <span className="font-semibold">${scholarship.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                                                    <span className="text-[var(--color-primary-500)]">📅</span>
                                                    <span>{new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">⭐ {scholarship.match}% Match</span>
                                                    <div className="flex-1 h-2 bg-[var(--color-bg-primary)] rounded-full max-w-[150px] overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${scholarship.match >= 80 ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]" : "bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-500)]"}`} 
                                                            style={{ width: `${scholarship.match}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {scholarship.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                                                            ✅ {tag}
                                                        </span>
                                                    ))}
                                                    {scholarship.requirements.map(req => (
                                                        <span key={req} className="px-2 py-1 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                                                            📝 {req}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                                            <Link 
                                                to="/details"
                                                className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-medium transition text-center flex items-center justify-center border border-[var(--color-border)]"
                                            >
                                                View Details
                                            </Link>
                                            <button className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20 text-center">
                                                Start Application
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 border-dashed">
                                <div className="inline-flex p-4 rounded-full bg-[var(--color-bg-secondary)] mb-4">
                                    <span className="text-4xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Scholarships Found</h3>
                                <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
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
                                        className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm font-medium transition border border-[var(--color-border)]"
                                    >
                                        Reset All Filters
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-medium transition">
                                        Browse Popular
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {filteredScholarships.length > 0 && (
                        <div className="mt-8 text-center">
                            <button className="px-6 py-3 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition border border-[var(--color-border)]">
                                Load 5 More Results
                            </button>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-2">Showing {filteredScholarships.length} of 47</p>
                        </div>
                    )}

                    {/* Not Finding What You Need */}
                    <div className="mt-12 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-secondary)] via-[var(--color-bg-secondary)] to-[var(--color-primary-500)]/10 p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-xl">
                                <span className="text-2xl">💡</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">NOT FINDING WHAT YOU NEED?</h3>
                                <ul className="space-y-2 text-[var(--color-text-secondary)]">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)]" />
                                        <button className="hover:text-[var(--color-primary-500)] hover:underline text-left">Request New Scholarships</button>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)]" />
                                        <button className="hover:text-[var(--color-primary-500)] hover:underline text-left">Update Your Profile to improve matches</button>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)]" />
                                        <button className="hover:text-[var(--color-primary-500)] hover:underline text-left">Browse All Categories</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
      
      {/* Modals */}
      {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
