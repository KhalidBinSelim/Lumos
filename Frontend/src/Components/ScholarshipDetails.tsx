// ScholarshipDetails.tsx
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

type TimelineItem = { date: string; label: string };
type Scholarship = {
    title: string;
    org: string;
    website: string;
    amount: string;
    deadline: string; // ISO string
    renewable: boolean;
    region: string;
    applicantsPerYear: number;
    awardsPerYear: number;
    match: number;
    notes: {
        whyFit: string[];
        improve: string[];
    };
    eligibility: string[];
    awardDetails: string[];
    essayPrompt: string;
    essayCriteria: string[];
    timeline: TimelineItem[];
    competition: {
        acceptanceRate: string;
        similarProfile: string[];
        percentile: number;
    };
    orgInfo: {
        type: string;
        founded: string;
        totalAwarded: string;
        contact: string;
        phone: string;
    };
};

const scholarshipData = (): Scholarship => ({
    title: "Tech Leaders Scholarship",
    org: "Tech Foundation Inc.",
    website: "https://techfoundation.org/scholarship",
    amount: "$5,000",
    deadline: "2024-02-15T23:59:00Z",
    renewable: true,
    region: "U.S. Residents Only",
    applicantsPerYear: 500,
    awardsPerYear: 20,
    match: 89,
    notes: {
        whyFit: [
            "Computer Science major (Required)",
            "3.8 GPA exceeds minimum 3.5 (Required)",
            "First-generation student (Preferred)",
            "Leadership experience in tech club (Preferred)",
            "Volunteering: 50+ hours (Bonus)",
        ],
        improve: [
            "Add a research project (+5% match)",
            "Obtain coding competition award (+3% match)",
        ],
    },
    eligibility: [
        "Must be enrolled full-time in an accredited university",
        "Pursuing B.S. in Computer Science or related field",
        "Minimum GPA: 3.5",
        "U.S. Citizen or Permanent Resident",
        "Demonstrate leadership in technology initiatives",
        "First-generation college student (preferred)",
        "Active in community service (preferred)",
    ],
    awardDetails: [
        "Amount: $5,000 per academic year",
        "Renewable: Up to 4 years (maintain 3.5 GPA)",
        "Number of Awards: 20 recipients annually",
        "Disbursement: Direct to institution in Fall semester",
        "Award Notification: March 30, 2024",
    ],
    essayPrompt:
        'Describe a specific way you plan to use technology to create positive social change in your community or the world. Include examples of leadership experiences that have prepared you for this goal.',
    essayCriteria: [
        "Clarity of vision and goals (30%)",
        "Demonstrated leadership and initiative (25%)",
        "Feasibility and impact of proposed project (25%)",
        "Writing quality and authenticity (20%)",
    ],
    timeline: [
        { date: "2023-12-01", label: "Application Opens" },
        { date: "2024-02-15", label: "Application Deadline - 11:59 PM EST" },
        { date: "2024-03-01", label: "Application Review Period" },
        { date: "2024-03-30", label: "Winners Announced (via email)" },
        { date: "2024-08-15", label: "Award Disbursement (Fall semester)" },
    ],
    competition: {
        acceptanceRate: "~4% (20/500)",
        similarProfile: [
            "15 first-gen CS students",
            "Average GPA: 3.75",
            "80% had leadership roles",
        ],
        percentile: 65,
    },
    orgInfo: {
        type: "501(c)(3) Non-Profit",
        founded: "2010",
        totalAwarded: "$2.5M+",
        contact: "scholarships@techfoundation.org",
        phone: "(555) 123-4567",
    },
});

export default function ScholarshipDetails(): React.ReactElement {
    const scholarship = useMemo(scholarshipData, []);
    const [activeTab, setActiveTab] = useState<
        "overview" | "requirements" | "essay" | "timeline"
    >("overview");
    const [saved, setSaved] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [essayDraft, setEssayDraft] = useState("");
    const [progress, setProgress] = useState<number>(60);
    const [reminders, setReminders] = useState({
        email: true,
        sms: true,
        push: false,
        twoWeeks: true,
        oneWeek: true,
        threeDays: true,
        oneDay: true,
    });

    // Deadline computation
    const deadlineInfo = useMemo(() => {
        const d = new Date(scholarship.deadline);
        const now = new Date();
        const ms = d.getTime() - now.getTime();
        const daysLeft = Math.ceil(ms / (1000 * 60 * 60 * 24));
        const formatted = new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(d);
        return { dateObj: d, daysLeft, isPast: ms < 0, formatted };
    }, [scholarship.deadline]);

    // match pct clamp
    const matchPct = Math.max(0, Math.min(100, scholarship.match));

    // match color class
    const matchGradient = scholarship.match >= 85
        ? "from-blue-400 to-indigo-400"
        : scholarship.match >= 70
            ? "from-green-400 to-emerald-400"
            : scholarship.match >= 50
                ? "from-orange-400 to-amber-300"
                : "from-rose-400 to-pink-400";

    // small saved feedback timeout
    useEffect(() => {
        if (!saved) return;
        const t = setTimeout(() => setSaved(false), 1400);
        return () => clearTimeout(t);
    }, [saved]);

    // AI generate outline (simple)
    function generateOutline() {
        const outline =
            "1) Hook & Motivation: personal anecdote that ignited your interest in tech.\n2) Project Idea: describe the tech solution, target community, and measurable impact.\n3) Leadership & Feasibility: past roles and clear steps to implement.\nConclusion: restate vision and how the scholarship accelerates impact.";
        setEssayDraft(outline);
        setProgress(85);
        setAiOpen(false);
        setActiveTab("essay");
    }

    // download ICS
    function downloadICS() {
        try {
            const title = scholarship.title.replace(/[,]/g, "");
            const description = `Application Deadline for ${scholarship.title} (${scholarship.org})`;
            const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            const dtstart = new Date(scholarship.deadline).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            const uid = `${Math.random().toString(36).slice(2)}@scholars`;
            const ics = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//ScholarScope//EN",
                "BEGIN:VEVENT",
                `UID:${uid}`,
                `DTSTAMP:${dtstamp}`,
                `DTSTART:${dtstart}`,
                `SUMMARY:${title} - Deadline`,
                `DESCRIPTION:${description}`,
                "END:VEVENT",
                "END:VCALENDAR",
            ].join("\r\n");
            const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title.replace(/\s+/g, "_")}_deadline.ics`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Unable to create calendar file in this environment.");
        }
    }

    // share fallback
    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: scholarship.title,
                url: scholarship.website,
            }).catch(() => { });
        } else {
            // fallback: copy url
            navigator.clipboard?.writeText(scholarship.website).then(
                () => alert("Link copied to clipboard"),
                () => alert("Share not supported")
            );
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden font-sans">
            <Topbar />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />

                <main className="flex-1 overflow-y-auto relative pb-24">
                    {/* background glow */}
                    <div className="absolute inset-0 pointer-events-none sticky top-0">
                        <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/20 blur-[200px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/20 blur-[200px] rounded-full" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{scholarship.title}</h1>
                                <p className="text-slate-400 mt-1 text-lg">{scholarship.org}</p>
                                <a href={scholarship.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1">
                                    🔗 {scholarship.website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSaved((v) => !v)}
                                    className={`p-2 rounded-full transition ${saved ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                                    title="Save"
                                >
                                    ❤️
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
                                >
                                    Share ⬆️
                                </button>
                                <Link to="/home" className="px-3 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                                    ✕ Close
                                </Link>
                            </div>
                        </div>

                        {/* Stats Box */}
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 backdrop-blur-sm">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">💰 Amount</div>
                                    <div className="text-xl font-bold text-white">{scholarship.amount}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">📅 Deadline</div>
                                    <div className="text-xl font-bold text-white">{deadlineInfo.formatted}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">🔄 Renewable</div>
                                    <div className="text-lg font-medium text-slate-200">{scholarship.renewable ? "Yes" : "No"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">🌍 Location</div>
                                    <div className="text-lg font-medium text-slate-200">U.S. Only</div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
                                <span>👥 ~{scholarship.applicantsPerYear} applicants/year</span>
                                <span>🏆 {scholarship.awardsPerYear} awards given</span>
                            </div>
                        </div>

                        {/* Match Score */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="font-bold text-white">YOUR MATCH: {scholarship.match}%</span>
                                </div>
                                <span className="text-emerald-400 font-medium">High</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${matchGradient}`}
                                    style={{ width: `${matchPct}%` }}
                                />
                            </div>
                            <p className="text-slate-400 text-sm mt-2">🎯 You're in the top 15% of potential applicants</p>
                        </div>

                        {/* Why You're a Great Fit */}
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">✅ WHY YOU'RE A GREAT FIT</h3>
                            <div className="space-y-3">
                                {scholarship.notes.whyFit.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-emerald-400 mt-0.5">✓</span>
                                        <span className="text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                    ⚠️ IMPROVE YOUR MATCH:
                                </h4>
                                <div className="space-y-2">
                                    {scholarship.notes.improve.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-amber-400/60 mt-1">•</span>
                                            <span className="text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium">
                                    [Add to Profile]
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {[
                                    { id: "overview", label: "Overview" },
                                    { id: "requirements", label: "Requirements" },
                                    { id: "essay", label: "Essay Prompts" },
                                    { id: "timeline", label: "Timeline" },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id as any)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeTab === t.id
                                                ? "bg-slate-100 text-slate-900"
                                                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[400px]">
                                {activeTab === "overview" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">About This Scholarship</h3>
                                            <div className="prose prose-invert max-w-none">
                                                <p className="text-slate-300 leading-relaxed">
                                                    The Tech Leaders Scholarship recognizes outstanding students pursuing degrees in computer science who demonstrate leadership, academic excellence, and commitment to using technology for social good.
                                                </p>
                                                <p className="text-slate-300 leading-relaxed mt-4">
                                                    Established in 2015 by Tech Foundation Inc., this scholarship has awarded over $500,000 to 100+ students.
                                                </p>
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2">
                                                    [Read More ▼]
                                                </button>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Eligibility Criteria</h3>
                                            <ul className="space-y-2">
                                                {scholarship.eligibility.map((e, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-slate-300">
                                                        <span className="text-blue-500 mt-1">✓</span>
                                                        {e}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Award Details</h3>
                                            <ul className="space-y-2">
                                                {scholarship.awardDetails.map((a, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-slate-300">
                                                        <span className="text-blue-500 mt-1">•</span>
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Competition Analysis</h3>
                                            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-300">Acceptance Rate: {scholarship.competition.acceptanceRate}</span>
                                                        <span className="text-rose-400 font-medium">Highly Competitive</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-rose-500 w-[4%]" />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-slate-300">Similar to your profile won in 2023:</p>
                                                    <ul className="space-y-1 ml-4">
                                                        {scholarship.competition.similarProfile.map((p, i) => (
                                                            <li key={i} className="text-sm text-slate-400 list-disc">{p}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                                                    <span className="text-yellow-400">💡</span>
                                                    <p className="text-sm text-slate-300">
                                                        Your profile is stronger than <span className="font-bold text-white">{scholarship.competition.percentile}%</span> of past winners
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Organization Info</h3>
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-slate-500">Organization</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.org}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Type</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.orgInfo.type}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Founded</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.orgInfo.founded}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Total Scholarships Awarded</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.orgInfo.totalAwarded}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Contact</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.orgInfo.contact}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Phone</div>
                                                    <div className="text-slate-200 font-medium">{scholarship.orgInfo.phone}</div>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                                                <span>🔒 Verified by ScholarScope</span>
                                                <span>•</span>
                                                <span>Last updated: Jan 10, 2024</span>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === "requirements" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Application Checklist</h3>
                                            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                                                <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800">
                                                    <h4 className="font-semibold text-slate-200">REQUIRED DOCUMENTS</h4>
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    {[
                                                        { label: "1. Online Application Form", sub: "Estimated time: 20 minutes", action: "[Start Form]" },
                                                        { label: "2. Personal Essay (500-750 words)", sub: 'Prompt: "Describe how you plan to use technology..."', action: "[View Full Prompt] [Start Essay with AI]" },
                                                        { label: "3. Official Transcript", sub: "Must show minimum 3.5 GPA", action: "[Upload] [Request from School]" },
                                                        { label: "4. Resume/CV", sub: "Max 2 pages, highlight tech leadership", status: "✅ Already uploaded", action: "[View] [Replace]" },
                                                        { label: "5. Letter of Recommendation", sub: "From professor or professional mentor", action: "[Request Letter]" },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex gap-4">
                                                            <div className="mt-1">
                                                                <div className="w-5 h-5 rounded border border-slate-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-slate-200">{item.label}</div>
                                                                <div className="text-sm text-slate-400 mt-1">{item.sub}</div>
                                                                {item.status && <div className="text-sm text-emerald-400 mt-1">{item.status}</div>}
                                                                <div className="mt-2 text-sm text-blue-400 font-medium cursor-pointer hover:text-blue-300">
                                                                    {item.action}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden mt-6">
                                                <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800">
                                                    <h4 className="font-semibold text-slate-200">OPTIONAL MATERIALS (Strengthen Application)</h4>
                                                </div>
                                                <div className="p-6 space-y-3">
                                                    {[
                                                        "Portfolio of projects",
                                                        "Awards or certifications",
                                                        "Additional letter of recommendation",
                                                        "Community service verification"
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex gap-4 items-center">
                                                            <div className="w-5 h-5 rounded border border-slate-600" />
                                                            <span className="text-slate-300">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Submission Method</h3>
                                            <ul className="space-y-2 text-slate-300">
                                                <li className="flex items-center gap-2"><span className="text-slate-500">•</span> Online via Tech Foundation portal</li>
                                                <li className="flex items-center gap-2"><span className="text-slate-500">•</span> All materials must be submitted by 11:59 PM EST</li>
                                                <li className="flex items-center gap-2"><span className="text-slate-500">•</span> Incomplete applications will not be reviewed</li>
                                            </ul>
                                            <button className="mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
                                                [Download Complete Requirements PDF]
                                            </button>
                                        </section>
                                    </div>
                                )}

                                {activeTab === "essay" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Essay Requirement</h3>
                                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-xl">📝</span>
                                                    <h4 className="font-semibold text-white">Personal Statement (500-750 words)</h4>
                                                </div>
                                                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Prompt</span>
                                                    <p className="text-slate-200 italic">"{scholarship.essayPrompt}"</p>
                                                </div>

                                                <div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Evaluation Criteria</span>
                                                    <ul className="space-y-2">
                                                        {scholarship.essayCriteria.map((c, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                                                <span className="text-blue-500">•</span>
                                                                {c}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-blue-500/20 rounded-xl">
                                                        <span className="text-2xl">💡</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">AI ESSAY ASSISTANT</h4>
                                                        <p className="text-slate-300 mt-1 mb-4">
                                                            Let our AI help you craft a compelling essay that showcases your unique story while staying true to your voice.
                                                        </p>
                                                        <div className="space-y-2 mb-4">
                                                            {["Brainstorm ideas from your profile", "Create an outline", "Generate first draft", "Refine and personalize"].map((item, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                                    <span className="text-blue-400">✓</span> {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => setAiOpen(true)}
                                                            className="px-5 py-2.5 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition shadow-lg shadow-blue-900/20"
                                                        >
                                                            Start Essay with AI Copilot →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Tips From Past Winners</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { quote: "Be specific about your project idea. Judges want to see concrete plans, not vague aspirations.", author: "Sarah J." },
                                                    { quote: "Connect your personal story to your tech goals. What experiences shaped your vision?", author: "Marcus T." },
                                                    { quote: "Show, don't tell. Use examples from your leadership roles to demonstrate your capabilities.", author: "Priya K." }
                                                ].map((tip, i) => (
                                                    <div key={i} className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
                                                        <p className="text-slate-300 italic mb-2">" {tip.quote} "</p>
                                                        <p className="text-slate-500 text-sm text-right">- {tip.author}</p>
                                                    </div>
                                                ))}
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                    [View More Examples]
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === "timeline" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Key Dates</h3>
                                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                {scholarship.timeline.map((t, i) => {
                                                    const date = new Date(t.date);
                                                    const isPast = date < new Date();
                                                    return (
                                                        <div key={i} className="flex gap-4">
                                                            <div className="flex-shrink-0 w-12 text-center">
                                                                <div className="text-xs text-slate-500 uppercase font-bold">{date.toLocaleString('default', { month: 'short' })}</div>
                                                                <div className="text-xl font-bold text-white">{date.getDate()}</div>
                                                            </div>
                                                            <div className="flex-1 pb-6 border-l border-slate-800 pl-6 relative last:pb-0 last:border-l-0">
                                                                <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${isPast ? "bg-emerald-500" : "bg-slate-600"}`} />
                                                                <h4 className="font-medium text-white">{t.label}</h4>
                                                                <p className="text-sm text-slate-400 mt-0.5">
                                                                    {isPast ? "✅ Completed" : `⏰ ${Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away`}
                                                                </p>
                                                                {!isPast && i === 1 && (
                                                                    <button onClick={downloadICS} className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2">
                                                                        [Add to Calendar]
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recommended Application Schedule</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { time: "4 weeks before deadline (Jan 18)", tasks: ["Complete application form", "Request letters of recommendation", "Order official transcripts"] },
                                                    { time: "2 weeks before deadline (Feb 1)", tasks: ["Draft essay", "Gather supporting documents", "Review application checklist"] },
                                                    { time: "1 week before deadline (Feb 8)", tasks: ["Finalize essay", "Proofread all materials", "Submit application"] },
                                                    { time: "Day of deadline (Feb 15)", tasks: ["Buffer day for technical issues", "Do NOT wait until last minute!"] }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <span className="text-lg">📌</span>
                                                        <div>
                                                            <div className="font-medium text-slate-200">{item.time}</div>
                                                            <ul className="mt-1 space-y-1">
                                                                {item.tasks.map((task, j) => (
                                                                    <li key={j} className="text-sm text-slate-400 flex items-center gap-2">
                                                                        <span className="w-1 h-1 bg-slate-500 rounded-full" />
                                                                        {task}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex gap-4 mt-4 pl-9">
                                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">[Create Personalized Schedule]</button>
                                                    <button onClick={downloadICS} className="text-blue-400 hover:text-blue-300 text-sm font-medium">[Add All to Calendar]</button>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Automated Reminders</h3>
                                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                                <p className="text-slate-300 mb-4">Get notified about important deadlines</p>
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={reminders.email} onChange={(e) => setReminders(r => ({ ...r, email: e.target.checked }))} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/40" />
                                                        <span className="text-slate-200">Email reminders</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={reminders.sms} onChange={(e) => setReminders(r => ({ ...r, sms: e.target.checked }))} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/40" />
                                                        <span className="text-slate-200">SMS reminders (optional)</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={reminders.push} onChange={(e) => setReminders(r => ({ ...r, push: e.target.checked }))} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/40" />
                                                        <span className="text-slate-200">Push notifications</span>
                                                    </label>
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-slate-800">
                                                    <span className="text-sm font-medium text-slate-400 block mb-3">Remind me:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { label: "2 weeks before deadline", key: "twoWeeks" },
                                                            { label: "1 week before deadline", key: "oneWeek" },
                                                            { label: "3 days before deadline", key: "threeDays" },
                                                            { label: "1 day before deadline", key: "oneDay" }
                                                        ].map((opt) => (
                                                            <label key={opt.key} className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition ${reminders[opt.key as keyof typeof reminders] ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-slate-800 text-slate-400 border border-transparent"}`}>
                                                                <input type="checkbox" className="hidden" checked={reminders[opt.key as keyof typeof reminders] as boolean} onChange={(e) => setReminders(r => ({ ...r, [opt.key]: e.target.checked }))} />
                                                                {reminders[opt.key as keyof typeof reminders] && "✓ "}
                                                                {opt.label}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition">
                                                    Save Preferences
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </div>
                    {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-8 border-t border-slate-800">
                            <button
                                onClick={() => setSaved((v) => !v)}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${saved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-white hover:bg-slate-700"}`}
                            >
                                {saved ? "❤️ Saved" : "❤️ Save for Later"}
                            </button>
                            <button
                                onClick={() => alert("Start application flow")}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                            >
                                Start Application →
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* AI Modal */}
            {aiOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <span className="text-xl">✨</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">AI Essay Assistant</h3>
                            </div>
                            <button onClick={() => setAiOpen(false)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition">✕</button>
                        </div>

                        <div className="space-y-6">
                            <p className="text-slate-300">We'll help you brainstorm and create an outline. Use quick notes to personalize suggestions.</p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-400 block mb-2">Tone</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-blue-500 outline-none transition">
                                        <option>Authentic</option>
                                        <option>Professional</option>
                                        <option>Passionate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-400 block mb-2">Focus</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-blue-500 outline-none transition">
                                        <option>Leadership</option>
                                        <option>Community Impact</option>
                                        <option>Personal Growth</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Quick notes to include</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500 outline-none transition resize-none"
                                    placeholder="e.g., led campus hackathon, volunteered at local CS club..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button className="px-6 py-3 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition" onClick={() => setAiOpen(false)}>Cancel</button>
                                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition" onClick={generateOutline}>Generate Outline</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
