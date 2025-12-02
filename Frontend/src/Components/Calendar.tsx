import { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import HelpModal from "./HelpModal";
import SubscriptionModal from "./SubscriptionModal";

// Mock Data
const DEADLINES = [
  { id: 1, title: "Tech Leaders Scholarship", date: "2024-02-08", amount: 5000, status: "In Progress", urgent: true },
  { id: 2, title: "Women in STEM Award", date: "2024-02-15", amount: 3000, status: "Draft", urgent: true },
  { id: 3, title: "Community Service Leaders", date: "2024-02-20", amount: 2500, status: "Not Started", urgent: false },
  { id: 4, title: "NextGen Coding Grant", date: "2024-02-22", amount: 1000, status: "In Progress", urgent: false },
];

export default function Calendar() {
  const [view, setView] = useState<"month" | "week" | "list">("month");
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // Feb 2024 for mock

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getDaysArray = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getDeadlinesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return DEADLINES.filter(d => d.date === dateStr);
  };

  const stats = {
    urgent: DEADLINES.filter(d => d.urgent).length, // < 7 days (mock logic)
    soon: DEADLINES.filter(d => !d.urgent && new Date(d.date).getDate() <= 22).length, // 7-14 days (mock logic)
    upcoming: DEADLINES.filter(d => new Date(d.date).getDate() > 22).length, // 14-30 days
    later: 12
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden font-sans">
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
            <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/10 blur-[200px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/10 blur-[200px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-white">Deadlines & Calendar</h1>
              <p className="text-slate-400">Stay on top of your scholarship applications</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-lg">
                  {stats.urgent}
                </div>
                <div>
                  <div className="text-white font-bold">Urgent</div>
                  <div className="text-xs text-slate-400">&lt; 7 days</div>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-lg">
                  {stats.soon}
                </div>
                <div>
                  <div className="text-white font-bold">Soon</div>
                  <div className="text-xs text-slate-400">7-14 days</div>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {stats.upcoming}
                </div>
                <div>
                  <div className="text-white font-bold">Upcoming</div>
                  <div className="text-xs text-slate-400">14-30 days</div>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700/20 flex items-center justify-center text-slate-400 font-bold text-lg">
                  {stats.later}
                </div>
                <div>
                  <div className="text-white font-bold">Later</div>
                  <div className="text-xs text-slate-400">30+ days</div>
                </div>
              </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 border border-slate-800 p-2 rounded-2xl">
              <div className="flex bg-slate-800 rounded-lg p-1">
                {["Month", "Week", "List"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v.toLowerCase() as any)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === v.toLowerCase() ? "bg-slate-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    {v} View
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-lg font-bold text-white w-32 text-center">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-1 rounded-lg hover:bg-blue-500/10 transition">
                  Today
                </button>
              </div>
            </div>

            {/* Month View */}
            {view === "month" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/80">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr">
                  {getDaysArray().map((day, i) => {
                    const deadlines = day ? getDeadlinesForDay(day) : [];
                    return (
                      <div key={i} className={`min-h-[100px] border-b border-r border-slate-800/50 p-2 relative group ${!day ? "bg-slate-950/30" : "hover:bg-slate-800/30 transition"}`}>
                        {day && (
                          <>
                            <span className={`text-sm font-medium ${deadlines.length > 0 ? "text-white" : "text-slate-500"}`}>{day}</span>
                            <div className="mt-2 space-y-1">
                              {deadlines.map((d) => (
                                <div key={d.id} className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer ${d.urgent ? "bg-rose-500/20 border-rose-500/30 text-rose-300" : "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"}`}>
                                  {d.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Urgent</span>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Soon</span>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Upcoming</span>
                </div>
              </div>
            )}

            {/* Deadline List (Below Calendar) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">warning</span> Urgent Deadlines (&lt; 7 days)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {DEADLINES.filter(d => d.urgent).map(d => (
                    <div key={d.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-rose-500/30 transition group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-rose-400 font-bold text-sm">Due: {new Date(d.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                        <div className="text-xs text-slate-500">3 days left</div>
                      </div>
                      <h4 className="font-bold text-white text-lg mb-1 group-hover:text-rose-400 transition">{d.title}</h4>
                      <div className="text-slate-400 text-sm mb-4">💰 ${d.amount.toLocaleString()}</div>
                      
                      <div className="flex items-center gap-2 mb-4 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Status: {d.status}</span>
                        <span className="text-rose-400">Missing: Essay</span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition">Continue</button>
                        <button className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
                          <span className="material-symbols-outlined text-sm">notifications</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span> Coming Soon (7-14 days)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {DEADLINES.filter(d => !d.urgent && new Date(d.date).getDate() <= 22).map(d => (
                    <div key={d.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-yellow-500/30 transition group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-yellow-400 font-bold text-sm">Due: {new Date(d.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                        <div className="text-xs text-slate-500">10-17 days left</div>
                      </div>
                      <h4 className="font-bold text-white text-lg mb-1 group-hover:text-yellow-400 transition">{d.title}</h4>
                      <div className="text-slate-400 text-sm mb-4">💰 ${d.amount.toLocaleString()}</div>
                      
                      <div className="flex items-center gap-2 mb-4 text-xs">
                         <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Status: {d.status}</span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition">View Details</button>
                      </div>
                    </div>
                  ))}
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
