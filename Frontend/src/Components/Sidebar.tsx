export default function Sidebar({
  onSubscriptionsClick,
  onSettingsClick,
  onHelpClick,
}: {
  onSubscriptionsClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}) {
  const mainNav = [
    { icon: "home", label: "Dashboard", path: "/dashboard" },
    { icon: "search", label: "Discover", path: "/discover" },
    { icon: "edit_note", label: "Applications", path: "/applications" },
    { icon: "star", label: "Saved", path: "/saved" },
    { icon: "calendar_month", label: "Calendar", path: "/calendar" },
    { icon: "insights", label: "Progress", path: "/progress" },
  ];

  const bottomNav = [
    { icon: "settings", label: "Settings", onClick: onSettingsClick },
    { icon: "help", label: "Help", onClick: onHelpClick },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-black/80 border-r border-slate-800/80 backdrop-blur-md">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <nav className="space-y-2">
          {mainNav.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="flex items-center gap-3 px-1 py-2 text-slate-400 hover:text-blue-400 transition group relative"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
              <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-500 bottom-0 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          {/* Subscriptions button */}
          <button
            onClick={onSubscriptionsClick}
            className="flex items-center gap-3 px-1 py-2 text-slate-400 hover:text-blue-400 transition group relative"
          >
            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
              payments
            </span>
            <span className="text-sm">Subscriptions</span>
            <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-500 bottom-0 rounded-full transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>
      </div>

      <div className="border-t border-slate-800 px-6 py-4">
        <nav className="space-y-2">
          {bottomNav.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-3 px-1 py-2 text-slate-500 hover:text-blue-400 transition group w-full text-left"
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}