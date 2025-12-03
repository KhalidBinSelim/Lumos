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

  const [userProfile, setUserProfile] = useState({
    name: "Khalid Bin Selim",
    email: "khalid@example.com"
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleEditClick = () => {
    setTempProfile(userProfile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-text-secondary)]">
              settings
            </span>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Account Section */}
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 text-center">Account</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center text-2xl font-bold text-white">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-[var(--color-text-primary)]">{userProfile.name}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">{userProfile.email}</div>
              </div>
              <button 
                onClick={handleEditClick}
                className="ml-auto px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] transition text-sm"
              >
                Edit Profile
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 text-center">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)]">
                <div className="text-left">
                  <div className="font-medium text-[var(--color-text-primary)]">Email Notifications</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
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
                  <div className="w-11 h-6 bg-[var(--color-bg-primary)] border border-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-500)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-600)]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)]">
                <div className="text-left">
                  <div className="font-medium text-[var(--color-text-primary)]">Push Notifications</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
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
                  <div className="w-11 h-6 bg-[var(--color-bg-primary)] border border-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-500)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-600)]"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 text-center">Security</h3>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)] hover:bg-[var(--color-bg-primary)]/60 transition group">
              <div className="flex items-center gap-3">
                <span className="text-center material-symbols-outlined text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition">
                  lock
                </span>
                <span className="text-center text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition">
                  Change Password
                </span>
              </div>
              <span className="material-symbols-outlined text-[var(--color-text-secondary)]">
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
        <div className="p-4 border-t border-[var(--color-border)] flex justify-end bg-[var(--color-bg-secondary)]/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition font-medium"
          >
            Done
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-primary-500)] outline-none transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-2 rounded-lg bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white font-medium shadow-lg shadow-[var(--color-primary-500)]/20 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
