import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const mainNav = [
    { icon: "home", label: "Dashboard", path: "/home" },
    { icon: "search", label: "Discover", path: "/discovery" },
    { icon: "edit_note", label: "Applications", path: "/applications" },
    { icon: "star", label: "Saved", path: "#" },
    { icon: "calendar_month", label: "Calendar", path: "/calendar" },
    { icon: "insights", label: "Progress", path: "#" },
  ];

  const bottomNav = [
    { icon: "settings", label: "Settings", path: "#" },
    { icon: "help", label: "Help", path: "#" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-black/80 border-r border-slate-800/80 backdrop-blur-md">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <nav className="space-y-2">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-1 py-2 transition group relative ${isActive ? "text-blue-400" : "text-slate-400 hover:text-blue-400"}`}
              >
                <span className={`material-symbols-outlined text-xl transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 bottom-0 rounded-full" />
                )}
                {!isActive && (
                  <span className="absolute left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 bottom-0 group-hover:w-full transition-all duration-300 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 px-6 py-4">
        <nav className="space-y-2">
          {bottomNav.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-1 py-2 text-slate-500 hover:text-blue-400 transition group"
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}