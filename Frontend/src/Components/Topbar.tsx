
import { useState, useEffect, useRef } from "react";

export default function Topbar() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notifRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);

    // close dropdowns when clicking outside
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (
                notifRef.current &&
                !notifRef.current.contains(e.target as Node) &&
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setShowNotifications(false);
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };
    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user || "{}");
    console.log(userObject);

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 
                   border-b border-[var(--color-border)] backdrop-blur-xl 
                   bg-[var(--color-bg-primary)]/80 transition-colors duration-300">
            {/* Left Section */}
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-primary-500)] shadow-lg shadow-[var(--color-primary-500)]/20" />
                    <span className="text-xl font-extrabold tracking-tight text-[var(--color-text-primary)] select-none">
                        LUMOS
                    </span>
                </div>

                <nav className="hidden md:flex gap-6 text-[var(--color-text-secondary)] text-sm">
                    <a href="#" className="hover:text-[var(--color-primary-500)] transition">Dashboard</a>
                    <a href="#" className="hover:text-[var(--color-primary-500)] transition">Discover</a>
                    <a href="#" className="hover:text-[var(--color-primary-500)] transition">Applications</a>
                </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* SEARCH BAR */}
                <div className="relative hidden sm:flex items-center">
                    <span className="material-symbols-outlined text-[var(--color-text-secondary)] absolute left-3 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search scholarships..."
                        className="pl-9 pr-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] 
                   text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 
                   focus:outline-none w-52 transition-colors"
                    />
                </div>

                {/* NOTIFICATION BUTTON + DROPDOWN */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                        className="relative flex items-center justify-center p-2 rounded-full
             border border-[var(--color-border)] text-[var(--color-text-secondary)]
             hover:text-[var(--color-primary-500)] hover:border-[var(--color-primary-500)]/50
             shadow-sm hover:shadow-[var(--color-primary-500)]/20
             transition-all hover:scale-105
             bg-transparent focus:bg-transparent active:bg-transparent
             focus:outline-none appearance-none"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            notifications_active
                        </span>
                        <span className="absolute top-[6px] right-[7px] w-2.5 h-2.5 
                   bg-gradient-to-r from-pink-500 to-red-500 
                   rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-[var(--color-border)] 
                        bg-[var(--color-bg-secondary)]
                        backdrop-blur-xl shadow-xl p-4 
                        origin-top-right transition-all animate-[fadeIn_0.15s_ease-out]">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold flex items-center gap-2 text-[var(--color-text-primary)]">
                                    <span className="material-symbols-outlined text-[var(--color-primary-500)] text-lg">
                                        notifications
                                    </span>
                                    Notifications
                                </h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition text-lg"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="rounded-lg p-3 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] 
                            hover:border-[var(--color-primary-500)]/40 transition">
                                    <p className="font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                                        ⏰ Deadline Alert
                                    </p>
                                    <p className="text-[var(--color-text-secondary)] text-xs">
                                        Smith Scholarship due in 3 days
                                    </p>
                                    <button className="text-[var(--color-primary-500)] text-xs mt-1 hover:underline">
                                        View Application →
                                    </button>
                                </div>

                                <div className="rounded-lg p-3 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] 
                            hover:border-[var(--color-primary-500)]/40 transition">
                                    <p className="font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                                        ✅ Match Found
                                    </p>
                                    <p className="text-[var(--color-text-secondary)] text-xs">
                                        5 new scholarships for you
                                    </p>
                                    <button className="text-[var(--color-primary-500)] text-xs mt-1 hover:underline">
                                        See Matches →
                                    </button>
                                </div>

                                <div className="rounded-lg p-3 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] 
                            hover:border-[var(--color-primary-500)]/40 transition">
                                    <p className="font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                                        📝 Essay Feedback Ready
                                    </p>
                                    <p className="text-[var(--color-text-secondary)] text-xs">
                                        AI reviewed your draft
                                    </p>
                                    <button className="text-[var(--color-primary-500)] text-xs mt-1 hover:underline">
                                        View Comments →
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-2 border-t border-[var(--color-border)] text-xs flex justify-between text-[var(--color-text-secondary)]">
                                <button className="hover:text-[var(--color-primary-500)] transition">Mark All as Read</button>
                                <button className="hover:text-[var(--color-primary-500)] transition">Notification Settings</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* PROFILE DROPDOWN */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1 rounded-full
             border border-[var(--color-border)] text-[var(--color-text-primary)]
             hover:text-[var(--color-primary-500)] hover:border-[var(--color-primary-500)]/50
             shadow-sm hover:shadow-[var(--color-primary-500)]/20
             bg-transparent focus:bg-transparent active:bg-transparent
             hover:scale-[1.03] transition-all
             focus:outline-none appearance-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr 
                   from-[var(--color-primary-600)] to-[var(--color-primary-500)] flex items-center 
                   justify-center text-xs font-bold text-white">
                            {userObject.firstName ? userObject.firstName[0] : 'U'}
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                            {userObject.firstName}
                        </span>
                        <span className="material-symbols-outlined text-[20px]">
                            expand_more
                        </span>
                    </button>

                    {/* Profile Menu */}
                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-64 rounded-xl border border-[var(--color-border)] 
                        bg-[var(--color-bg-secondary)] 
                        backdrop-blur-xl shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-[var(--color-border)]">
                                <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                    👤 {userObject.firstName} {userObject.lastName}
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)]">{userObject.email}</p>
                            </div>

                            <div className="p-2 text-sm text-[var(--color-text-secondary)]">
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    👤 My Profile
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    ⚙️ Settings
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    📊 My Progress
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    💳 Subscription
                                </a>

                                <div className="border-t border-[var(--color-border)] my-2" />

                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    💡 Help & Support
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-primary)] transition">
                                    📚 Resources
                                </a>

                                <div className="border-t border-[var(--color-border)] my-2" />

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition w-full text-left"
                                >
                                    🚪 Sign Out
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}