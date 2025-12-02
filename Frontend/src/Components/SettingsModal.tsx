import { useState } from "react";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">
              settings
            </span>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Account Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Account</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
                K
              </div>
              <div>
                <div className="font-medium text-white">Khalid Bin Selim</div>
                <div className="text-sm text-slate-400">khalid@example.com</div>
              </div>
              <button className="ml-auto px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-sm">
                Edit Profile
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="text-left">
                  <div className="font-medium text-white">Email Notifications</div>
                  <div className="text-sm text-slate-400">
                    Receive updates about your applications
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="text-left">
                  <div className="font-medium text-white">Push Notifications</div>
                  <div className="text-sm text-slate-400">
                    Get real-time alerts on your device
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        push: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Security</h3>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 transition group">
              <div className="flex items-center gap-3">
                <span className="text-center material-symbols-outlined text-slate-400 group-hover:text-white transition">
                  lock
                </span>
                <span className="text-center text-slate-300 group-hover:text-white transition">
                  Change Password
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-500">
                chevron_right
              </span>
            </button>
          </section>

          {/* Danger Zone */}
          <section className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-red-400 mb-4 text-center">
              Danger Zone
            </h3>
            <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition text-sm">
              Delete Account
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
