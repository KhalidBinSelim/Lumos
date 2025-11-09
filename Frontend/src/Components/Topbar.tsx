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

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 
                   border-b border-slate-800/60 backdrop-blur-xl 
                   bg-gradient-to-b from-slate-950/85 via-slate-900/70 to-transparent">
            {/* Left Section */}
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg" />
                    <span className="text-xl font-extrabold tracking-tight text-white select-none">
                        LUMOS
                    </span>
                </div>

                <nav className="hidden md:flex gap-6 text-slate-300 text-sm">
                    <a href="#" className="hover:text-blue-400 transition">Dashboard</a>
                    <a href="#" className="hover:text-blue-400 transition">Discover</a>
                    <a href="#" className="hover:text-blue-400 transition">Applications</a>
                </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* SEARCH BAR */}
                <div className="relative hidden sm:flex items-center">
                    <span className="material-symbols-outlined text-slate-500 absolute left-3 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search scholarships..."
                        className="pl-9 pr-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 
                   text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/40 
                   focus:outline-none w-52"
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
             border border-slate-700/70 text-slate-300
             hover:text-blue-400 hover:border-blue-500/50
             shadow-[0_0_8px_-2px_rgba(37,99,235,0.3)]
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
                        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-700 
                        bg-gradient-to-bl from-slate-950/95 via-slate-900/85 to-slate-950/85 
                        backdrop-blur-xl shadow-[0_8px_30px_-8px_rgba(37,99,235,0.5)] p-4 
                        origin-top-right transition-all animate-[fadeIn_0.15s_ease-out]">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-blue-400 text-lg">
                                        notifications
                                    </span>
                                    Notifications
                                </h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-slate-400 hover:text-white transition text-lg"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800 
                            hover:border-blue-500/40 transition">
                                    <p className="font-medium text-slate-100 flex items-center gap-2">
                                        ⏰ Deadline Alert
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        Smith Scholarship due in 3 days
                                    </p>
                                    <button className="text-blue-400 text-xs mt-1 hover:underline">
                                        View Application →
                                    </button>
                                </div>

                                <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800 
                            hover:border-indigo-500/40 transition">
                                    <p className="font-medium text-slate-100 flex items-center gap-2">
                                        ✅ Match Found
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        5 new scholarships for you
                                    </p>
                                    <button className="text-blue-400 text-xs mt-1 hover:underline">
                                        See Matches →
                                    </button>
                                </div>

                                <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800 
                            hover:border-green-500/40 transition">
                                    <p className="font-medium text-slate-100 flex items-center gap-2">
                                        📝 Essay Feedback Ready
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        AI reviewed your draft
                                    </p>
                                    <button className="text-blue-400 text-xs mt-1 hover:underline">
                                        View Comments →
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-2 border-t border-slate-800 text-xs flex justify-between text-slate-400">
                                <button className="hover:text-blue-400 transition">Mark All as Read</button>
                                <button className="hover:text-blue-400 transition">Notification Settings</button>
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
             border border-slate-700/70 text-slate-200
             hover:text-blue-400 hover:border-blue-500/50
             shadow-[0_0_8px_-2px_rgba(59,130,246,0.3)]
             bg-transparent focus:bg-transparent active:bg-transparent
             hover:scale-[1.03] transition-all
             focus:outline-none appearance-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr 
                  from-blue-500 to-indigo-500 flex items-center 
                  justify-center text-xs font-bold">
                            K
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                            Khalid
                        </span>
                        <span className="material-symbols-outlined text-[20px]">
                            expand_more
                        </span>
                    </button>

                    {/* Profile Menu */}
                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-700 
                        bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-black/85 
                        backdrop-blur-xl shadow-[0_8px_30px_-8px_rgba(59,130,246,0.5)] overflow-hidden">
                            <div className="p-4 border-b border-slate-800/70">
                                <p className="font-semibold text-white flex items-center gap-2">
                                    👤 John Doe
                                </p>
                                <p className="text-xs text-slate-400">john@email.com</p>
                            </div>

                            <div className="p-2 text-sm text-slate-200">
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    👤 My Profile
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    ⚙️ Settings
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    📊 My Progress
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    💳 Subscription
                                </a>

                                <div className="border-t border-slate-800 my-2" />

                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    💡 Help & Support
                                </a>
                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800/60 transition">
                                    📚 Resources
                                </a>

                                <div className="border-t border-slate-800 my-2" />

                                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition">
                                    🚪 Sign Out
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}