import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar({
  onSubscriptionsClick,
  onSettingsClick,
  onHelpClick,
}: {
  onSubscriptionsClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const mainNav = [
    { icon: "home", label: "Dashboard", path: "/home" },
    { icon: "search", label: "Discover", path: "/discovery" },
    { icon: "edit_note", label: "Applications", path: "/applications" },
    { icon: "star", label: "Saved", path: "/saved" },
    { icon: "calendar_month", label: "Calendar", path: "/calendar" },
  ];

  const bottomNav = [
    { icon: "price_check", label: "Subscription", onClick: onSubscriptionsClick },
    { icon: "settings", label: "Settings", onClick: onSettingsClick },
    { icon: "help", label: "Help", onClick: onHelpClick },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] transition-colors duration-300">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <nav className="space-y-2">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/home");
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-1 py-2 transition group relative ${isActive ? "text-[var(--color-primary-500)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"}`}
              >
                <span className={`material-symbols-outlined text-xl transition-transform ${isActive ? "" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 h-[2px] w-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] bottom-0 rounded-full transition-all duration-300" />
                )}
                {!isActive && (
                  <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] bottom-0 rounded-full transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[var(--color-border)] px-6 py-4">
        <nav className="space-y-2">
          {bottomNav.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-3 px-1 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition group w-full text-left"
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-1 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition group w-full text-left"
          >
            <span className="material-symbols-outlined text-lg">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="text-sm">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}