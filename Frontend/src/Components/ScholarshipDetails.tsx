import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";
import { scholarshipsApi, type Scholarship } from "../api/scholarships";

export default function ScholarshipDetails(): React.ReactElement {
    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "overview" | "requirements" | "essay" | "timeline"
    >("overview");
    const [saved, setSaved] = useState(false);
    const [reminders, setReminders] = useState({
        email: true,
        sms: true,
        push: false,
        twoWeeks: true,
        oneWeek: true,
        threeDays: true,
        oneDay: true,
    });

    // Fetch scholarship data on mount
    useEffect(() => {
        const fetchScholarship = async () => {
            const scholarshipId = localStorage.getItem("scholarship_id");
            console.log("Scholarship ID:", scholarshipId);
            if (!scholarshipId) {
                setError("No scholarship selected. Please go back and select a scholarship.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await scholarshipsApi.getScholarshipById(scholarshipId);
                if (response.success && response.data) {
                    setScholarship(response.data);
                    // Initialize saved state from API response
                    setSaved(response.data.saved || false);
                } else {
                    setError("Failed to load scholarship details.");
                }
            } catch (err: any) {
                console.error("Error fetching scholarship:", err);
                setError(err.message || "Failed to load scholarship. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchScholarship();
    }, []);

    // Deadline computation
    const deadlineInfo = useMemo(() => {
        if (!scholarship?.deadline) {
            return { dateObj: new Date(), daysLeft: 0, isPast: false, formatted: "N/A" };
        }
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
    }, [scholarship?.deadline]);

    // Format amount for display
    const formattedAmount = scholarship?.amountDisplay || (scholarship?.amount ? `$${scholarship.amount.toLocaleString()}` : "N/A");

    // match pct clamp - backend may return either 'match' or 'matchScore'
    const matchScore = scholarship?.matchScore ?? scholarship?.match ?? 0;
    const matchPct = Math.max(0, Math.min(100, matchScore));

    // match color class
    const matchGradient = matchScore >= 85
        ? "from-[var(--color-primary-400)] to-[var(--color-primary-500)]"
        : matchScore >= 70
            ? "from-[var(--color-primary-400)] to-[var(--color-primary-500)]"
            : matchScore >= 50
                ? "from-orange-400 to-amber-300"
                : "from-rose-400 to-pink-400";

    // small saved feedback timeout
    useEffect(() => {
        if (!saved) return;
        const t = setTimeout(() => setSaved(false), 1400);
        return () => clearTimeout(t);
    }, [saved]);

    // download ICS
    function downloadICS() {
        if (!scholarship) return;
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
        if (!scholarship) return;
        if (navigator.share) {
            navigator.share({
                title: scholarship.title,
                url: scholarship.website || window.location.href,
            }).catch(() => { });
        } else {
            // fallback: copy url
            navigator.clipboard?.writeText(scholarship.website || window.location.href).then(
                () => alert("Link copied to clipboard"),
                () => alert("Share not supported")
            );
        }
    }

    // Loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-1 items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[var(--color-text-secondary)]">Loading scholarship details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (error || !scholarship) {
        return (
            <DashboardLayout>
                <div className="flex flex-1 items-center justify-center h-full">
                    <div className="text-center max-w-md p-6">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Unable to Load Scholarship</h2>
                        <p className="text-[var(--color-text-secondary)] mb-6">{error || "Scholarship not found."}</p>
                        <Link
                            to="/home"
                            className="px-6 py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white font-medium rounded-xl transition inline-block"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24">
                {/* background glow */}
                <div className="absolute inset-0 pointer-events-none sticky top-0">
                    <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/20 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/20 blur-[200px] rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">{scholarship.title}</h1>
                        <p className="text-[var(--color-text-secondary)] mt-1 text-lg">{scholarship.org}</p>
                        {scholarship.website && (
                            <a href={scholarship.website} target="_blank" rel="noreferrer" className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm flex items-center gap-1 mt-1">
                                🔗 {scholarship.website.replace(/^https?:\/\//, "")}
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSaved((v) => !v)}
                            className={`p-2 rounded-full transition ${saved ? "bg-pink-600 text-white" : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                            title="Save"
                        >
                            ❤️
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-4 py-2 rounded-full bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-medium transition border border-[var(--color-border)]"
                        >
                            Share ⬆️
                        </button>
                        <Link to="/home" className="px-3 py-2 rounded-full bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition border border-[var(--color-border)]">
                            ✕ Close
                        </Link>
                    </div>
                </div>

                {/* Stats Box */}
                <div className="relative z-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-sm text-[var(--color-text-secondary)] mb-1">💰 Amount</div>
                            <div className="text-xl font-bold text-[var(--color-text-primary)]">{formattedAmount}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[var(--color-text-secondary)] mb-1">📅 Deadline</div>
                            <div className="text-xl font-bold text-[var(--color-text-primary)]">{deadlineInfo.formatted}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[var(--color-text-secondary)] mb-1">🔄 Renewable</div>
                            <div className="text-lg font-medium text-[var(--color-text-primary)]">{scholarship.renewable ? "Yes" : "No"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[var(--color-text-secondary)] mb-1">🌍 Location</div>
                            <div className="text-lg font-medium text-[var(--color-text-primary)]">{scholarship.region || scholarship.location || "National"}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-6 text-sm text-[var(--color-text-secondary)]">
                        {scholarship.applicantsPerYear && <span>👥 ~{scholarship.applicantsPerYear} applicants/year</span>}
                        {scholarship.awardsPerYear && <span>🏆 {scholarship.awardsPerYear} awards given</span>}
                    </div>
                </div>

                {/* Match Score */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="font-bold text-[var(--color-text-primary)]">YOUR MATCH: {matchScore}%</span>
                        </div>
                        <span className={`font-medium ${matchScore >= 80 ? "text-[var(--color-primary-500)]" : matchScore >= 60 ? "text-amber-400" : "text-[var(--color-text-secondary)]"}`}>
                            {matchScore >= 80 ? "High" : matchScore >= 60 ? "Medium" : "Low"}
                        </span>
                    </div>
                    <div className="h-4 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${matchGradient}`}
                            style={{ width: `${matchPct}%` }}
                        />
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-2">🎯 Based on your profile match with scholarship requirements</p>
                </div>

                {/* Why You're a Great Fit - only show if notes exist */}
                {scholarship.notes && (scholarship.notes.whyFit?.length || scholarship.notes.improve?.length) ? (
                    <div className="relative z-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-6">
                        {scholarship.notes.whyFit && scholarship.notes.whyFit.length > 0 && (
                            <>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">✅ WHY YOU'RE A GREAT FIT</h3>
                                <div className="space-y-3">
                                    {scholarship.notes.whyFit.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-[var(--color-primary-500)] mt-0.5">✓</span>
                                            <span className="text-[var(--color-text-primary)]">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {scholarship.notes.improve && scholarship.notes.improve.length > 0 && (
                            <div className={scholarship.notes.whyFit?.length ? "mt-6 pt-6 border-t border-[var(--color-border)]" : ""}>
                                <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                    ⚠️ IMPROVE YOUR MATCH:
                                </h4>
                                <div className="space-y-2">
                                    {scholarship.notes.improve.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-amber-400/60 mt-1">•</span>
                                            <span className="text-[var(--color-text-primary)]">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium">
                                    [Add to Profile]
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Tabs */}
                <div className="relative z-10 space-y-6">
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
                                    ? "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]"
                                    : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
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
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">About This Scholarship</h3>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-[var(--color-text-primary)] leading-relaxed">
                                            {scholarship.description || `The ${scholarship.title} is offered by ${scholarship.org} to support students in achieving their educational goals.`}
                                        </p>
                                    </div>
                                </section>

                                {scholarship.eligibility && scholarship.eligibility.length > 0 && (
                                    <section>
                                        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Eligibility Criteria</h3>
                                        <ul className="space-y-2">
                                            {scholarship.eligibility.map((e, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[var(--color-text-primary)]">
                                                    <span className="text-[var(--color-primary-500)] mt-1">✓</span>
                                                    {e}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {scholarship.awardDetails && scholarship.awardDetails.length > 0 && (
                                    <section>
                                        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Award Details</h3>
                                        <ul className="space-y-2">
                                            {scholarship.awardDetails.map((a, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[var(--color-text-primary)]">
                                                    <span className="text-[var(--color-primary-500)] mt-1">•</span>
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {scholarship.competition && (
                                    <section>
                                        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Competition Analysis</h3>
                                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6">
                                            {scholarship.competition.acceptanceRate && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-[var(--color-text-primary)]">Acceptance Rate: {scholarship.competition.acceptanceRate}</span>
                                                        <span className="text-rose-400 font-medium">Highly Competitive</span>
                                                    </div>
                                                    <div className="h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                                                        <div className="h-full bg-rose-500 w-[4%]" />
                                                    </div>
                                                </div>
                                            )}

                                            {scholarship.competition.similarProfile && scholarship.competition.similarProfile.length > 0 && (
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Similar profiles that won:</p>
                                                    <ul className="space-y-1 ml-4">
                                                        {scholarship.competition.similarProfile.map((p, i) => (
                                                            <li key={i} className="text-sm text-[var(--color-text-secondary)] list-disc">{p}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {scholarship.competition.percentile && (
                                                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-3">
                                                    <span className="text-yellow-400">💡</span>
                                                    <p className="text-sm text-[var(--color-text-primary)]">
                                                        Your profile is stronger than <span className="font-bold text-[var(--color-text-primary)]">{scholarship.competition.percentile}%</span> of past winners
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {scholarship.orgInfo && (
                                    <section>
                                        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Organization Info</h3>
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-[var(--color-text-secondary)]">Organization</div>
                                                <div className="text-[var(--color-text-primary)] font-medium">{scholarship.org}</div>
                                            </div>
                                            {scholarship.orgInfo.type && (
                                                <div>
                                                    <div className="text-[var(--color-text-secondary)]">Type</div>
                                                    <div className="text-[var(--color-text-primary)] font-medium">{scholarship.orgInfo.type}</div>
                                                </div>
                                            )}
                                            {scholarship.orgInfo.founded && (
                                                <div>
                                                    <div className="text-[var(--color-text-secondary)]">Founded</div>
                                                    <div className="text-[var(--color-text-primary)] font-medium">{scholarship.orgInfo.founded}</div>
                                                </div>
                                            )}
                                            {scholarship.orgInfo.totalAwarded && (
                                                <div>
                                                    <div className="text-[var(--color-text-secondary)]">Total Scholarships Awarded</div>
                                                    <div className="text-[var(--color-text-primary)] font-medium">{scholarship.orgInfo.totalAwarded}</div>
                                                </div>
                                            )}
                                            {scholarship.orgInfo.contact && (
                                                <div>
                                                    <div className="text-[var(--color-text-secondary)]">Contact</div>
                                                    <div className="text-[var(--color-text-primary)] font-medium">{scholarship.orgInfo.contact}</div>
                                                </div>
                                            )}
                                            {scholarship.orgInfo.phone && (
                                                <div>
                                                    <div className="text-[var(--color-text-secondary)]">Phone</div>
                                                    <div className="text-[var(--color-text-primary)] font-medium">{scholarship.orgInfo.phone}</div>
                                                </div>
                                            )}
                                        </div>
                                        {scholarship.verified && (
                                            <div className="mt-6 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                                <span>🔒 Verified by Lumos</span>
                                            </div>
                                        )}
                                    </section>
                                )}
                            </div>
                        )}

                        {activeTab === "requirements" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Application Checklist</h3>
                                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
                                        <div className="bg-[var(--color-bg-primary)]/50 px-6 py-3 border-b border-[var(--color-border)]">
                                            <h4 className="font-semibold text-[var(--color-text-primary)]">REQUIRED DOCUMENTS</h4>
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
                                                        <div className="w-5 h-5 rounded border border-[var(--color-border)]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-[var(--color-text-primary)]">{item.label}</div>
                                                        <div className="text-sm text-[var(--color-text-secondary)] mt-1">{item.sub}</div>
                                                        {item.status && <div className="text-sm text-[var(--color-primary-500)] mt-1">{item.status}</div>}
                                                        <div className="mt-2 text-sm text-[var(--color-primary-500)] font-medium cursor-pointer hover:text-[var(--color-primary-600)]">
                                                            {item.action}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden mt-6">
                                        <div className="bg-[var(--color-bg-primary)]/50 px-6 py-3 border-b border-[var(--color-border)]">
                                            <h4 className="font-semibold text-[var(--color-text-primary)]">OPTIONAL MATERIALS (Strengthen Application)</h4>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            {[
                                                "Portfolio of projects",
                                                "Awards or certifications",
                                                "Additional letter of recommendation",
                                                "Community service verification"
                                            ].map((item, i) => (
                                                <div key={i} className="flex gap-4 items-center">
                                                    <div className="w-5 h-5 rounded border border-[var(--color-border)]" />
                                                    <span className="text-[var(--color-text-primary)]">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Submission Method</h3>
                                    <ul className="space-y-2 text-[var(--color-text-primary)]">
                                        <li className="flex items-center gap-2"><span className="text-[var(--color-text-secondary)]">•</span> Online via Tech Foundation portal</li>
                                        <li className="flex items-center gap-2"><span className="text-[var(--color-text-secondary)]">•</span> All materials must be submitted by 11:59 PM EST</li>
                                        <li className="flex items-center gap-2"><span className="text-[var(--color-text-secondary)]">•</span> Incomplete applications will not be reviewed</li>
                                    </ul>
                                    <button className="mt-4 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium text-sm">
                                        [Download Complete Requirements PDF]
                                    </button>
                                </section>
                            </div>
                        )}

                        {activeTab === "essay" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Essay Requirement</h3>
                                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl">📝</span>
                                            <h4 className="font-semibold text-[var(--color-text-primary)]">
                                                Personal Statement
                                                {scholarship.essayWordCount && (scholarship.essayWordCount.min || scholarship.essayWordCount.max) && (
                                                    <span className="font-normal text-[var(--color-text-secondary)] ml-2">
                                                        ({scholarship.essayWordCount.min || 0}-{scholarship.essayWordCount.max || '?'} words)
                                                    </span>
                                                )}
                                            </h4>
                                        </div>
                                        {scholarship.essayPrompt ? (
                                            <div className="bg-[var(--color-bg-primary)]/50 rounded-xl p-4 mb-6">
                                                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-2">Prompt</span>
                                                <p className="text-[var(--color-text-primary)] italic">"{scholarship.essayPrompt}"</p>
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--color-bg-primary)]/50 rounded-xl p-4 mb-6">
                                                <p className="text-[var(--color-text-secondary)]">Essay prompt will be provided upon application.</p>
                                            </div>
                                        )}

                                        {scholarship.essayCriteria && scholarship.essayCriteria.length > 0 && (
                                            <div>
                                                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-2">Evaluation Criteria</span>
                                                <ul className="space-y-2">
                                                    {scholarship.essayCriteria.map((c, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-[var(--color-text-primary)] text-sm">
                                                            <span className="text-[var(--color-primary-500)]">•</span>
                                                            {c}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <div className="bg-gradient-to-br from-[var(--color-primary-900)]/20 to-[var(--color-secondary-900)]/20 border border-[var(--color-primary-500)]/30 rounded-2xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[var(--color-primary-500)]/20 rounded-xl">
                                                <span className="text-2xl">💡</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--color-text-primary)] text-lg">AI ESSAY ASSISTANT</h4>
                                                <p className="text-[var(--color-text-primary)] mt-1 mb-4">
                                                    Let our AI help you craft a compelling essay that showcases your unique story while staying true to your voice.
                                                </p>
                                                <div className="space-y-2 mb-4">
                                                    {["Brainstorm ideas from your profile", "Create an outline", "Generate first draft", "Refine and personalize"].map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                                                            <span className="text-[var(--color-primary-500)]">✓</span> {item}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => alert("AI Copilot coming soon!")}
                                                    className="px-5 py-2.5 bg-white text-[var(--color-primary-900)] font-bold rounded-full hover:bg-[var(--color-primary-100)] transition shadow-lg shadow-[var(--color-primary-500)]/20"
                                                >
                                                    Start Essay with AI Copilot →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Tips From Past Winners</h3>
                                    <div className="space-y-4">
                                        {[
                                            { quote: "Be specific about your project idea. Judges want to see concrete plans, not vague aspirations.", author: "Sarah J." },
                                            { quote: "Connect your personal story to your tech goals. What experiences shaped your vision?", author: "Marcus T." },
                                            { quote: "Show, don't tell. Use examples from your leadership roles to demonstrate your capabilities.", author: "Priya K." }
                                        ].map((tip, i) => (
                                            <div key={i} className="bg-[var(--color-bg-primary)]/30 border border-[var(--color-border)] rounded-xl p-4">
                                                <p className="text-[var(--color-text-primary)] italic mb-2">" {tip.quote} "</p>
                                                <p className="text-[var(--color-text-secondary)] text-sm text-right">- {tip.author}</p>
                                            </div>
                                        ))}
                                        <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">
                                            [View More Examples]
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "timeline" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Key Dates</h3>
                                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
                                        {scholarship.timeline && scholarship.timeline.length > 0 ? (
                                            scholarship.timeline.map((t, i) => {
                                                const date = new Date(t.date);
                                                const isPast = date < new Date();
                                                return (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="flex-shrink-0 w-12 text-center">
                                                            <div className="text-xs text-[var(--color-text-secondary)] uppercase font-bold">{date.toLocaleString('default', { month: 'short' })}</div>
                                                            <div className="text-xl font-bold text-[var(--color-text-primary)]">{date.getDate()}</div>
                                                        </div>
                                                        <div className="flex-1 pb-6 border-l border-[var(--color-border)] pl-6 relative last:pb-0 last:border-l-0">
                                                            <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${isPast ? "bg-[var(--color-primary-500)]" : "bg-[var(--color-bg-primary)]"}`} />
                                                            <h4 className="font-medium text-[var(--color-text-primary)]">{t.label}</h4>
                                                            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                                                                {isPast ? "✅ Completed" : `⏰ ${Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away`}
                                                            </p>
                                                            {!isPast && i === 1 && (
                                                                <button onClick={downloadICS} className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium mt-2">
                                                                    [Add to Calendar]
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 text-center">
                                                    <div className="text-xs text-[var(--color-text-secondary)] uppercase font-bold">{deadlineInfo.dateObj.toLocaleString('default', { month: 'short' })}</div>
                                                    <div className="text-xl font-bold text-[var(--color-text-primary)]">{deadlineInfo.dateObj.getDate()}</div>
                                                </div>
                                                <div className="flex-1 pb-6 pl-6 relative">
                                                    <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${deadlineInfo.isPast ? "bg-[var(--color-primary-500)]" : "bg-[var(--color-bg-primary)]"}`} />
                                                    <h4 className="font-medium text-[var(--color-text-primary)]">Application Deadline</h4>
                                                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                                                        {deadlineInfo.isPast ? "✅ Completed" : `⏰ ${deadlineInfo.daysLeft} days away`}
                                                    </p>
                                                    {!deadlineInfo.isPast && (
                                                        <button onClick={downloadICS} className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium mt-2">
                                                            [Add to Calendar]
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Recommended Application Schedule</h3>
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
                                                    <div className="font-medium text-[var(--color-text-primary)]">{item.time}</div>
                                                    <ul className="mt-1 space-y-1">
                                                        {item.tasks.map((task, j) => (
                                                            <li key={j} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-[var(--color-text-secondary)] rounded-full" />
                                                                {task}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex gap-4 mt-4 pl-9">
                                            <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">[Create Personalized Schedule]</button>
                                            <button onClick={downloadICS} className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">[Add All to Calendar]</button>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Automated Reminders</h3>
                                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
                                        <p className="text-[var(--color-text-primary)] mb-4">Get notified about important deadlines</p>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={reminders.email} onChange={(e) => setReminders(r => ({ ...r, email: e.target.checked }))} className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/40" />
                                                <span className="text-[var(--color-text-primary)]">Email reminders</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={reminders.sms} onChange={(e) => setReminders(r => ({ ...r, sms: e.target.checked }))} className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/40" />
                                                <span className="text-[var(--color-text-primary)]">SMS reminders (optional)</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={reminders.push} onChange={(e) => setReminders(r => ({ ...r, push: e.target.checked }))} className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/40" />
                                                <span className="text-[var(--color-text-primary)]">Push notifications</span>
                                            </label>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                                            <span className="text-sm font-medium text-[var(--color-text-secondary)] block mb-3">Remind me:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { label: "2 weeks before deadline", key: "twoWeeks" },
                                                    { label: "1 week before deadline", key: "oneWeek" },
                                                    { label: "3 days before deadline", key: "threeDays" },
                                                    { label: "1 day before deadline", key: "oneDay" }
                                                ].map((opt) => (
                                                    <label key={opt.key} className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition ${reminders[opt.key as keyof typeof reminders] ? "bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)] border border-[var(--color-primary-500)]/30" : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-transparent"}`}>
                                                        <input type="checkbox" className="hidden" checked={reminders[opt.key as keyof typeof reminders] as boolean} onChange={(e) => setReminders(r => ({ ...r, [opt.key]: e.target.checked }))} />
                                                        {reminders[opt.key as keyof typeof reminders] && "✓ "}
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="mt-6 px-4 py-2 bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition border border-[var(--color-border)]">
                                            Save Preferences
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-8 border-t border-[var(--color-border)]">
                    <button
                        onClick={() => setSaved((v) => !v)}
                        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${saved ? "bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] border border-[var(--color-primary-500)]/20" : "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"}`}
                    >
                        {saved ? "❤️ Saved" : "❤️ Save for Later"}
                    </button>
                    <button
                        onClick={() => alert("Start application flow")}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white font-bold shadow-lg shadow-[var(--color-primary-500)]/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                    >
                        Start Application
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}