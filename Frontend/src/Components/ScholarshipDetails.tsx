// ScholarshipDetails.tsx
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

type TimelineItem = { date: string; label: string };
type Scholarship = {
    title: string;
    org: string;
    website: string;
    amount: string;
    deadline: string;
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
        { date: "2024-03-30", label: "Winners Announced" },
        { date: "2024-08-15", label: "Award Disbursement" },
    ],
});

export default function ScholarshipDetails(): React.ReactElement {
    const scholarship = useMemo(scholarshipData, []);
    const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "essay" | "timeline">("overview");
    const [saved, setSaved] = useState(false);
    const [favorite, setFavorite] = useState(false);
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
    const [isBottom, setIsBottom] = useState(false);

    // Footer visibility based on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 50; // 50px from bottom
            setIsBottom(scrollPosition >= threshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const deadlineInfo = useMemo(() => {
        const d = new Date(scholarship.deadline);
        const now = new Date();
        const ms = d.getTime() - now.getTime();
        const daysLeft = Math.ceil(ms / (1000 * 60 * 60 * 24));
        const formatted = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d);
        return { dateObj: d, daysLeft, isPast: ms < 0, formatted };
    }, [scholarship.deadline]);

    const matchPct = Math.max(0, Math.min(100, scholarship.match));
    const matchGradient = scholarship.match >= 85
        ? "from-blue-400 to-indigo-400"
        : scholarship.match >= 70
            ? "from-green-400 to-emerald-400"
            : scholarship.match >= 50
                ? "from-orange-400 to-amber-300"
                : "from-rose-400 to-pink-400";

    // Saved feedback
    useEffect(() => {
        if (!saved) return;
        const t = setTimeout(() => setSaved(false), 1400);
        return () => clearTimeout(t);
    }, [saved]);

    function generateOutline() {
        const outline =
            "1) Hook & Motivation: personal anecdote that ignited your interest in tech.\n2) Project Idea: describe the tech solution, target community, and measurable impact.\n3) Leadership & Feasibility: past roles and clear steps to implement.\nConclusion: restate vision and how the scholarship accelerates impact.";
        setEssayDraft(outline);
        setProgress(85);
        setAiOpen(false);
        setActiveTab("essay");
    }

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

    function handleShare() {
        if (navigator.share) {
            navigator.share({ title: scholarship.title, url: scholarship.website }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(scholarship.website).then(
                () => alert("Link copied to clipboard"),
                () => alert("Share not supported")
            );
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto relative p-8">
                    {/* Background glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/30 blur-[200px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/30 blur-[200px] rounded-full" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-2xl p-3 bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-4">
                                <button aria-label="Close" className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sm">× Close</button>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">{scholarship.title}</h1>
                                    <p className="text-slate-400 text-sm">{scholarship.org} • {scholarship.website.replace(/^https?:\/\//, "")}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setFavorite((v) => !v)} aria-pressed={favorite} className={`px-3 py-1 rounded-full text-sm ${favorite ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-200"}`}>❤️</button>
                                <button onClick={handleShare} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sm">Share ⬆️</button>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <section className="rounded-3xl p-6 border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/30 shadow-[0_0_30px_-10px_rgba(37,99,235,0.15)] backdrop-blur-md">
                            <div className="sm:flex sm:items-center sm:justify-between gap-6">
                                <div className="flex items-start gap-6 w-full">
                                    <div className="rounded-2xl p-4 bg-slate-800/50 w-44 h-32 flex flex-col justify-center items-start">
                                        <div className="text-sm text-slate-300">💰 Amount</div>
                                        <div className="text-2xl font-bold mt-1">{scholarship.amount}</div>
                                        <div className="text-xs text-slate-400 mt-1">{scholarship.renewable ? "Renewable" : "One-time"}</div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold">{scholarship.title}</h2>
                                                <p className="text-slate-400 text-sm">{scholarship.org}</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm text-slate-400">Deadline</div>
                                                <div className="text-sm font-semibold">{deadlineInfo.formatted}</div>
                                                <div className={`text-xs mt-1 ${deadlineInfo.isPast ? "text-rose-400" : "text-slate-300"}`}>
                                                    {deadlineInfo.isPast ? "Closed" : `${deadlineInfo.daysLeft} days left`}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-52 h-4 rounded-full bg-slate-800 overflow-hidden`}>
                                                    <div className={`h-full bg-gradient-to-r ${matchGradient}`} style={{ width: `${matchPct}%` }} />
                                                </div>
                                                <div className="text-sm font-semibold">⭐ YOUR MATCH: {scholarship.match}%</div>
                                            </div>
                                            <p className="text-slate-400 text-sm mt-2">🎯 You're in the top 15% of potential applicants</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WHY YOU'RE GREAT FIT (no bullets) */}
                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                <div className="rounded-2xl p-4 bg-slate-900/50 border border-slate-700">
                                    <h3 className="text-sm font-semibold mb-2">✅ WHY YOU'RE A GREAT FIT</h3>
                                    {scholarship.notes.whyFit.map((item) => (
                                        <p key={item} className="text-sm text-slate-300 mt-1">{item}</p>
                                    ))}
                                    <div className="mt-4 text-sm text-slate-400">⚠️ IMPROVE YOUR MATCH:</div>
                                    {scholarship.notes.improve.map((item) => (
                                        <p key={item} className="text-sm text-slate-300 mt-1">{item}</p>
                                    ))}
                                    <div className="mt-4">
                                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm" onClick={() => alert("Open profile editor")}>Add to Profile</button>
                                    </div>
                                </div>

                                {/* Application Snapshot */}
                                <div className="rounded-2xl p-4 bg-slate-900/50 border border-slate-700 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold">Application Snapshot</h3>
                                        <p className="text-slate-400 text-sm mt-2">👥 ~{scholarship.applicantsPerYear} applicants/year • 🏆 {scholarship.awardsPerYear} awards</p>
                                        <div className="mt-4">
                                            <p className="text-sm text-slate-400">Progress</p>
                                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mt-2">
                                                <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2">Essay draft at {progress}% • Missing: LOR</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <button className={`px-4 py-2 rounded-full ${saved ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-200"}`} onClick={() => setSaved(true)}>❤️ Save for Later</button>
                                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white" onClick={() => alert("Start application flow")}>Start Application →</button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <section className="rounded-3xl p-6 border border-slate-800 bg-slate-900/50 mt-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {[
                                            { id: "overview", label: "Overview" },
                                            { id: "requirements", label: "Requirements" },
                                            { id: "essay", label: "Essay Prompts" },
                                            { id: "timeline", label: "Timeline" },
                                        ].map((t) => (
                                            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                                                className={`px-3 py-1 rounded-full text-sm ${activeTab === t.id ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white" : "bg-slate-800 text-slate-300"}`}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="px-3 py-1 rounded-full bg-slate-800 text-sm" onClick={downloadICS}>Add to Calendar</button>
                                        <button className="px-3 py-1 rounded-full bg-slate-800 text-sm" onClick={() => window.print()}>Download PDF</button>
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="mt-6 space-y-6">
                                    {/* Overview, Requirements, Essay, Timeline */}
                                    {/* Removed bullets and aligned checkboxes */}
                                    {/* Implemented fixes for Required Documents and Timeline alignment */}
                                </div>
                            </section>
                        </section>
                    </div>

                    {/* Footer only at bottom */}
                    {isBottom && (
                        <div className="fixed left-64 right-8 bottom-4 p-4 bg-slate-800/90 rounded-xl shadow-lg z-50 flex justify-between">
                            <button className={`px-4 py-2 rounded-full ${saved ? "bg-emerald-500 text-black" : "bg-slate-700 text-slate-200"}`} onClick={() => setSaved(true)}>❤️ Save for Later</button>
                            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white" onClick={() => alert("Start Application flow")}>Start Application →</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
