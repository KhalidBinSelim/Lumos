import { useState } from "react";
import DashboardLayout from "./DashboardLayout";

// Mock Data
const DEADLINES = [
  { id: 1, title: "Tech Leaders Scholarship", date: "2024-02-08", amount: 5000, status: "In Progress", urgent: true },
  { id: 2, title: "Women in STEM Award", date: "2024-02-15", amount: 3000, status: "Draft", urgent: true },
  { id: 3, title: "Community Service Leaders", date: "2024-02-20", amount: 2500, status: "Not Started", urgent: false },
  { id: 4, title: "NextGen Coding Grant", date: "2024-02-22", amount: 1000, status: "In Progress", urgent: false },
];

export default function CalendarView() {
  const [view, setView] = useState<"month" | "week" | "list">("month");
  
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
    <DashboardLayout>
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none sticky top-0">
        <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Deadlines & Calendar</h1>
          <p className="text-[var(--color-text-secondary)]">Stay on top of your scholarship applications</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-lg">
              {stats.urgent}
            </div>
            <div>
              <div className="text-[var(--color-text-primary)] font-bold">Urgent</div>
              <div className="text-xs text-[var(--color-text-secondary)]">&lt; 7 days</div>
            </div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-lg">
              {stats.soon}
            </div>
            <div>
              <div className="text-[var(--color-text-primary)] font-bold">Soon</div>
              <div className="text-xs text-[var(--color-text-secondary)]">7-14 days</div>
            </div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-500)]/20 flex items-center justify-center text-[var(--color-primary-500)] font-bold text-lg">
              {stats.upcoming}
            </div>
            <div>
              <div className="text-[var(--color-text-primary)] font-bold">Upcoming</div>
              <div className="text-xs text-[var(--color-text-secondary)]">14-30 days</div>
            </div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-secondary)] font-bold text-lg border border-[var(--color-border)]">
              {stats.later}
            </div>
            <div>
              <div className="text-[var(--color-text-primary)] font-bold">Later</div>
              <div className="text-xs text-[var(--color-text-secondary)]">30+ days</div>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--color-bg-secondary)]/40 border border-[var(--color-border)] p-2 rounded-2xl">
          <div className="flex bg-[var(--color-bg-primary)] rounded-lg p-1">
            {["Month", "Week", "List"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v.toLowerCase() as any)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === v.toLowerCase() ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
              >
                {v} View
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-[var(--color-bg-primary)] rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-lg font-bold text-[var(--color-text-primary)] w-32 text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button className="p-1 hover:bg-[var(--color-bg-primary)] rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium px-3 py-1 rounded-lg hover:bg-[var(--color-primary-500)]/10 transition">
              Today
            </button>
          </div>
        </div>

        {/* Month View */}
        {view === "month" && (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {getDaysArray().map((day, i) => {
                const deadlines = day ? getDeadlinesForDay(day) : [];
                return (
                  <div key={i} className={`min-h-[100px] border-b border-r border-[var(--color-border)]/50 p-2 relative group ${!day ? "bg-[var(--color-bg-primary)]/30" : "hover:bg-[var(--color-bg-primary)]/30 transition"}`}>
                    {day && (
                      <>
                        <span className={`text-sm font-medium ${deadlines.length > 0 ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>{day}</span>
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
            
            <div className="p-4 bg-[var(--color-bg-secondary)]/80 border-t border-[var(--color-border)] flex items-center gap-6 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Urgent</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Soon</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]" /> Upcoming</span>
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
                <div key={d.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-5 hover:border-rose-500/30 transition group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-rose-400 font-bold text-sm">Due: {new Date(d.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">3 days left</div>
                  </div>
                  <h4 className="font-bold text-[var(--color-text-primary)] text-lg mb-1 group-hover:text-rose-400 transition">{d.title}</h4>
                  <div className="text-[var(--color-text-secondary)] text-sm mb-4">💰 ${d.amount.toLocaleString()}</div>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">Status: {d.status}</span>
                    <span className="text-rose-400">Missing: Essay</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition">Continue</button>
                    <button className="px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] transition">
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
                <div key={d.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-5 hover:border-yellow-500/30 transition group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-yellow-400 font-bold text-sm">Due: {new Date(d.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">10-17 days left</div>
                  </div>
                  <h4 className="font-bold text-[var(--color-text-primary)] text-lg mb-1 group-hover:text-yellow-400 transition">{d.title}</h4>
                  <div className="text-[var(--color-text-secondary)] text-sm mb-4">💰 ${d.amount.toLocaleString()}</div>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">Status: {d.status}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-medium transition">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
