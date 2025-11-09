export default function Sidebar() {
  const mainNav = [
    { icon: "home", label: "Dashboard" },
    { icon: "search", label: "Discover" },
    { icon: "edit_note", label: "Applications" },
    { icon: "star", label: "Saved" },
    { icon: "calendar_month", label: "Calendar" },
    { icon: "insights", label: "Progress" },
  ];

  const bottomNav = [
    { icon: "settings", label: "Settings" },
    { icon: "help", label: "Help" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-black/80 border-r border-slate-800/80 backdrop-blur-md">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <nav className="space-y-2">
          {mainNav.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-1 py-2 text-slate-400 hover:text-blue-400 transition group relative"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
              <span className="absolute left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 bottom-0 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 px-6 py-4">
        <nav className="space-y-2">
          {bottomNav.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-1 py-2 text-slate-500 hover:text-blue-400 transition group"
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}