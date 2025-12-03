import React, { useState, useMemo } from "react";
import DashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";

// Mock Data
const MOCK_APPLICATIONS = [
    {
        id: 1,
        scholarshipId: 101,
        title: "Tech Leaders Scholarship",
        org: "Tech Foundation Inc.",
        amount: 5000,
        deadline: "2024-02-15",
        status: "In Progress",
        progress: 60,
        lastEdited: "2024-01-28T14:30:00",
        requirements: [
            { name: "Personal Statement", status: "completed" },
            { name: "Transcript", status: "uploaded" },
            { name: "Letter of Rec", status: "pending" }
        ],
        nextTask: "Request Letter of Recommendation",
        notes: "Need to follow up with Prof. Smith"
    },
    {
        id: 2,
        scholarshipId: 102,
        title: "Women in STEM Award",
        org: "Future Innovators",
        amount: 3000,
        deadline: "2024-03-01",
        status: "Submitted",
        progress: 100,
        submittedDate: "2024-01-25T09:15:00",
        requirements: [
            { name: "Research Proposal", status: "completed" },
            { name: "CV", status: "completed" }
        ],
        nextTask: "Await Decision",
        decisionDate: "2024-04-15"
    },
    {
        id: 3,
        scholarshipId: 103,
        title: "Community Service Leaders",
        org: "Global Impact Fund",
        amount: 2500,
        deadline: "2024-03-15",
        status: "Draft",
        progress: 20,
        lastEdited: "2024-01-20T16:45:00",
        requirements: [
            { name: "Service Log", status: "in-progress" },
            { name: "Essay", status: "not-started" }
        ],
        nextTask: "Complete Service Log",
        notes: "Gather signed hours from volunteer coordinator"
    },
    {
        id: 4,
        scholarshipId: 104,
        title: "NextGen Coding Grant",
        org: "DevWorld",
        amount: 1000,
        deadline: "2024-01-10",
        status: "Won",
        progress: 100,
        submittedDate: "2023-12-15T11:20:00",
        awardedDate: "2024-01-20",
        requirements: [],
        nextTask: "Submit Acceptance Form",
        notes: "Acceptance due by Feb 1st!"
    },
    {
        id: 5,
        scholarshipId: 105,
        title: "Future Architects",
        org: "Design Build",
        amount: 4000,
        deadline: "2024-02-28",
        status: "In Progress",
        progress: 45,
        lastEdited: "2024-01-27T10:00:00",
        requirements: [
            { name: "Portfolio", status: "in-progress" },
            { name: "Design Challenge", status: "pending" }
        ],
        nextTask: "Upload Portfolio Images"
    }
];

export default function MyApplications() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Deadline");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    // Derived State
    const filteredApps = useMemo(() => {
        let apps = MOCK_APPLICATIONS.filter(app =>
            (statusFilter === "All" || app.status === statusFilter) &&
            (app.title.toLowerCase().includes(searchQuery.toLowerCase()) || app.org.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        return apps.sort((a, b) => {
            if (sortBy === "Deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            if (sortBy === "Progress") return b.progress - a.progress;
            if (sortBy === "Amount") return b.amount - a.amount;
            return 0;
        });
    }, [searchQuery, statusFilter, sortBy]);

    const stats = {
        total: MOCK_APPLICATIONS.length,
        inProgress: MOCK_APPLICATIONS.filter(a => a.status === "In Progress").length,
        submitted: MOCK_APPLICATIONS.filter(a => a.status === "Submitted").length,
        won: MOCK_APPLICATIONS.filter(a => a.status === "Won").length,
        totalValue: MOCK_APPLICATIONS.reduce((acc, curr) => acc + (curr.status === "Won" ? curr.amount : 0), 0)
    };

    const handleDelete = (id: number) => {
        // In a real app, this would call an API
        console.log("Deleting app", id);
        setShowDeleteConfirm(null);
    };

    return (
        <DashboardLayout>
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none sticky top-0">
                <div className="absolute -top-28 -right-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 space-y-8">

                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">My Applications</h1>
                        <p className="text-[var(--color-text-secondary)]">Track, manage, and organize your scholarship journey.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-center">
                            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-bold">In Progress</div>
                            <div className="text-2xl font-bold text-[var(--color-primary-500)]">{stats.inProgress}</div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-center">
                            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-bold">Submitted</div>
                            <div className="text-2xl font-bold text-green-500">{stats.submitted}</div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-center hidden sm:block">
                            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-bold">Won</div>
                            <div className="text-2xl font-bold text-yellow-500">${stats.totalValue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-[var(--color-bg-secondary)]/50 p-4 rounded-2xl border border-[var(--color-border)] backdrop-blur-sm">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-text-secondary)]">search</span>
                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] outline-none transition"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {["All", "In Progress", "Submitted", "Won", "Draft"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${statusFilter === status ? "bg-[var(--color-primary-600)] text-white shadow-lg shadow-[var(--color-primary-500)]/20" : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* View & Sort */}
                    <div className="flex gap-2 ml-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl px-3 py-2 outline-none focus:border-[var(--color-primary-500)] cursor-pointer"
                        >
                            <option value="Deadline">Deadline</option>
                            <option value="Progress">Progress</option>
                            <option value="Amount">Amount</option>
                        </select>
                        <div className="flex bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] p-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                            >
                                <span className="material-symbols-outlined text-sm">view_list</span>
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                            >
                                <span className="material-symbols-outlined text-sm">grid_view</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredApps.map(app => (
                        <div
                            key={app.id}
                            className={`group relative bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary-500)]/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.1)] ${viewMode === "list" ? "p-6 flex flex-col md:flex-row gap-6 items-start" : "p-6 flex flex-col h-full"}`}
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${app.status === "Won" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                    app.status === "Submitted" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                        app.status === "In Progress" ? "bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] border-[var(--color-primary-500)]/20" :
                                            "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                }`}>
                                {app.status}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="mb-1">
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] truncate pr-24">{app.title}</h3>
                                    <p className="text-[var(--color-text-secondary)] text-sm">{app.org}</p>
                                </div>

                                {/* Meta Data */}
                                <div className={`flex flex-wrap gap-4 mt-4 text-sm ${viewMode === "grid" ? "flex-col gap-2" : ""}`}>
                                    <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                                        <span className="text-[var(--color-primary-500)]">💰</span>
                                        <span className="font-semibold">${app.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                                        <span className="text-[var(--color-primary-500)]">📅</span>
                                        <span className={new Date(app.deadline) < new Date() ? "text-red-400" : ""}>
                                            Due {new Date(app.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    {app.nextTask && (
                                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded-lg border border-[var(--color-border)]">
                                            <span className="text-orange-400">⚡</span>
                                            <span className="truncate max-w-[200px]">{app.nextTask}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-medium text-[var(--color-text-secondary)]">Completion</span>
                                        <span className="font-bold text-[var(--color-text-primary)]">{app.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${app.progress === 100 ? "bg-green-500" : "bg-[var(--color-primary-500)]"
                                                }`}
                                            style={{ width: `${app.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Requirements Preview (List Mode Only) */}
                                {viewMode === "list" && app.requirements.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                        {app.requirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs whitespace-nowrap">
                                                <span className={
                                                    req.status === "completed" ? "text-green-500" :
                                                        req.status === "in-progress" ? "text-blue-500" :
                                                            "text-gray-400"
                                                }>
                                                    {req.status === "completed" ? "✓" : "○"}
                                                </span>
                                                <span className={req.status === "completed" ? "text-[var(--color-text-secondary)] line-through" : "text-[var(--color-text-primary)]"}>
                                                    {req.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className={`flex gap-2 ${viewMode === "list" ? "flex-col justify-center min-w-[140px]" : "mt-6 pt-4 border-t border-[var(--color-border)]"}`}>
                                <Link
                                    to={`/application/${app.id}`}
                                    className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white text-sm font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20 text-center flex items-center justify-center gap-2"
                                >
                                    <span>Continue</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedAppId(app.id)}
                                        className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] transition flex items-center justify-center"
                                        title="View Details"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(app.id)}
                                        className="px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 border border-[var(--color-border)] hover:border-red-500/30 transition flex items-center justify-center"
                                        title="Delete Application"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredApps.length === 0 && (
                        <div className="text-center py-20 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 border-dashed">
                            <div className="inline-flex p-4 rounded-full bg-[var(--color-bg-secondary)] mb-4">
                                <span className="text-4xl">📭</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Applications Found</h3>
                            <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                                {statusFilter === "All" ? "You haven't started any applications yet. Go to Discovery to find scholarships!" : `No applications match the "${statusFilter}" filter.`}
                            </p>
                            <Link
                                to="/discovery"
                                className="px-6 py-3 rounded-xl bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white font-bold transition shadow-lg shadow-[var(--color-primary-500)]/20 inline-flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Find Scholarships
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Delete Application?</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                            Are you sure you want to delete this application? This action cannot be undone and all progress will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-medium border border-[var(--color-border)] transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg shadow-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
