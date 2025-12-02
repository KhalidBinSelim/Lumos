import { useState } from 'react';
import DashboardLayout from "./DashboardLayout";
import { 
  FileText, Search, Calendar, BarChart2, 
  ChevronDown, CheckCircle, XCircle, AlertCircle, 
  Trash2, Mail, Copy, PauseCircle, Download, ExternalLink, MoreVertical
} from 'lucide-react';

// --- Types ---
type AppStatus = 'in-progress' | 'submitted' | 'won' | 'rejected';

interface Application {
  id: string;
  title: string;
  amount: number;
  deadline?: string;
  submittedDate?: string;
  wonDate?: string;
  notifiedDate?: string;
  daysLeft?: number;
  progress: number;
  status: AppStatus;
  statusLabel?: string;
  lastUpdated?: string;
  checklist?: { label: string; status: 'completed' | 'pending' | 'missing' | 'started' }[];
  feedback?: string;
  nextSteps?: string[];
  requirements?: string[];
  timeline?: { date: string; label: string; status: 'completed' | 'current' | 'future' }[];
  urgent?: boolean;
}

// --- Mock Data ---
const applicationsData: Application[] = [
  {
    id: '1',
    title: 'Tech Leaders Scholarship',
    amount: 5000,
    deadline: 'Feb 15',
    daysLeft: 29,
    progress: 60,
    status: 'in-progress',
    statusLabel: 'In Progress',
    lastUpdated: '2 hours ago',
    checklist: [
      { label: 'Application form complete', status: 'completed' },
      { label: 'Resume uploaded', status: 'completed' },
      { label: 'Essay: Draft saved (450/500 words)', status: 'started' },
      { label: 'Transcript: Not submitted', status: 'missing' },
      { label: 'Letter of Rec: Pending (1/1)', status: 'missing' },
    ]
  },
  {
    id: '2',
    title: 'Women in STEM Award',
    amount: 3000,
    deadline: 'Mar 1',
    daysLeft: 44,
    progress: 25,
    status: 'in-progress',
    statusLabel: 'In Progress',
    lastUpdated: '1 day ago',
    checklist: [
      { label: 'Application form complete', status: 'completed' },
      { label: 'Essay: Not started', status: 'missing' },
      { label: 'Research project: Missing', status: 'missing' },
      { label: 'Transcript: Not submitted', status: 'missing' },
    ]
  },
  {
    id: '3',
    title: 'Community Service Leaders',
    amount: 2500,
    deadline: 'Feb 8',
    daysLeft: 22,
    progress: 40,
    status: 'in-progress',
    statusLabel: 'Urgent - Deadline soon!',
    urgent: true,
    lastUpdated: '5 days ago',
    checklist: [
      { label: 'Application form complete', status: 'completed' },
      { label: 'Essay: Outline created', status: 'started' },
      { label: 'Service hours verification: Needed', status: 'missing' },
    ]
  },
  {
    id: '4',
    title: 'Innovation Grant',
    amount: 10000,
    submittedDate: 'Jan 10, 2024',
    progress: 100,
    status: 'submitted',
    statusLabel: 'Submitted - Under Review',
    requirements: [
      'Application form', 'Essay (750 words)', 'Project proposal', '2 Letters of recommendation', 'Official transcript'
    ],
    timeline: [
      { date: 'Jan 10', label: 'Submitted', status: 'completed' },
      { date: 'Feb 15', label: 'Finalists Notified', status: 'future' },
      { date: 'Feb 28', label: 'Winners Announced', status: 'future' }
    ]
  },
  {
    id: '5',
    title: 'Future Leaders Award',
    amount: 4000,
    submittedDate: 'Dec 20, 2023',
    progress: 100,
    status: 'submitted',
    statusLabel: 'Submitted - Awaiting Decision',
    timeline: [
      { date: 'Dec 20', label: 'Received', status: 'completed' },
      { date: 'Dec 28', label: 'Under Review', status: 'completed' },
      { date: 'Jan 15', label: 'Final Review', status: 'current' },
      { date: 'Jan 31', label: 'Decision', status: 'future' }
    ]
  },
  {
    id: '6',
    title: 'Academic Excellence Scholarship',
    amount: 5000,
    wonDate: 'Jan 5, 2024',
    progress: 100,
    status: 'won',
    statusLabel: 'Awarded!',
    nextSteps: [
      'Accept award by Jan 31, 2024',
      'Complete W-9 form',
      'Provide school billing info'
    ]
  },
  {
    id: '7',
    title: 'State Merit Scholarship',
    amount: 2000,
    notifiedDate: 'Dec 15, 2023',
    progress: 100,
    status: 'rejected',
    statusLabel: 'Not Selected',
    feedback: "Due to high volume of qualified applicants, we were unable to award all deserving students. We encourage you to reapply next year."
  }
];

// --- Sub-Components ---

const StatCard = ({ title, count, colorClass, subtext }: { title: string, count: number, colorClass: string, subtext?: string }) => (
  <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm flex-1 min-w-[150px] backdrop-blur-xl">
    <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">{title}</div>
    <div className={`text-2xl font-bold ${colorClass}`}>{count}</div>
    {subtext && <div className="text-xs text-[var(--color-text-secondary)] mt-1 opacity-80">{subtext}</div>}
  </div>
);

const ProgressBar = ({ progress, colorClass = 'bg-[var(--color-primary-500)]' }: { progress: number, colorClass?: string }) => (
  <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2.5 mb-1 border border-[var(--color-border)]">
    <div className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${progress}%` }}></div>
  </div>
);

const ChecklistItem = ({ label, status }: { label: string, status: string }) => {
  const getIcon = () => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'started': return <div className="w-4 h-4 rounded-full border-2 border-yellow-500 flex items-center justify-center"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div></div>;
      default: return <XCircle className="w-4 h-4 text-[var(--color-text-secondary)] opacity-50" />;
    }
  };
  
  return (
    <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)] mb-1.5">
      <span className="mt-0.5">{getIcon()}</span>
      <span className={status === 'missing' ? 'text-[var(--color-text-secondary)] opacity-70 italic' : ''}>{label}</span>
    </div>
  );
};

export default function ApplicationPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('Deadline');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

  // Filter Logic
  const filteredApps = applicationsData.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  // Derived Stats
  const total = applicationsData.length;
  const inProgress = applicationsData.filter(a => a.status === 'in-progress').length;
  const won = applicationsData.filter(a => a.status === 'won').length;
  const rejected = applicationsData.filter(a => a.status === 'rejected').length;

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) setActiveDropdown(null);
    else setActiveDropdown(id);
  };

  return (
    <DashboardLayout>
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 relative" onClick={() => setActiveDropdown(null)}>
          {/* Background Glow */}
          <div className="absolute inset-0 pointer-events-none sticky top-0">
              <div className="absolute -top-28 -left-36 w-96 h-96 bg-[var(--color-primary-500)]/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[var(--color-secondary-500)]/10 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                  <div>
                      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">My Applications</h1>
                      <p className="text-[var(--color-text-secondary)]">Track and manage your scholarship applications</p>
                  </div>
                  <button className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-[var(--color-primary-500)]/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                  <Search className="w-4 h-4" /> Find Scholarships
                  </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard title="Total" count={total} colorClass="text-[var(--color-text-primary)]" subtext="All time" />
                  <StatCard title="In Progress" count={inProgress} colorClass="text-[var(--color-primary-500)]" subtext="Active drafts" />
                  <StatCard title="Won" count={won} colorClass="text-emerald-500" subtext="$5,000 Total" />
                  <StatCard title="Rejected" count={rejected} colorClass="text-rose-500" subtext="Keep going!" />
              </div>

              {/* Tabs & Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[var(--color-border)] pb-4">
                  <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                  {[
                      { id: 'all', label: `All (${total})` },
                      { id: 'in-progress', label: `In Progress (${inProgress})` },
                      { id: 'submitted', label: 'Submitted' },
                      { id: 'won', label: `Won (${won})` },
                      { id: 'rejected', label: 'Rejected' }
                  ].map(tab => (
                      <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeTab === tab.id 
                          ? 'bg-[var(--color-primary-500)] text-white shadow-lg shadow-[var(--color-primary-500)]/20' 
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)] hover:text-[var(--color-text-primary)]'
                      }`}
                      >
                      {tab.label}
                      </button>
                  ))}
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto relative">
                  {/* Sort Dropdown */}
                  <div className="relative">
                      <button 
                      onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-3 py-2 rounded-lg hover:border-[var(--color-text-secondary)] transition-colors"
                      >
                      Sort: <span className="font-semibold text-[var(--color-text-primary)]">{sortOption}</span> <ChevronDown className="w-4 h-4" />
                      </button>
                      {showSortDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl z-20 py-1">
                          <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider bg-[var(--color-bg-primary)]/50">Sort By</div>
                          {['Deadline (Soonest)', 'Amount (High-Low)', 'Progress', 'Recently Updated'].map((opt) => (
                          <button 
                              key={opt}
                              onClick={() => { setSortOption(opt); setShowSortDropdown(false); }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-primary-500)]/10 hover:text-[var(--color-primary-500)] flex justify-between items-center"
                          >
                              {opt} {sortOption === opt && <CheckCircle className="w-4 h-4 text-[var(--color-primary-500)]" />}
                          </button>
                          ))}
                      </div>
                      )}
                  </div>
                  <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                      <input 
                          type="text" 
                          placeholder="Search applications..." 
                          className="w-full pl-9 pr-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent outline-none placeholder-[var(--color-text-secondary)]/50" 
                      />
                  </div>
                  </div>
              </div>

              {/* Applications Grid */}
              {filteredApps.length === 0 ? (
                  <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] p-12 text-center">
                      <div className="w-16 h-16 bg-[var(--color-bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
                      <FileText className="w-8 h-8 text-[var(--color-text-secondary)]" />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No Applications Yet</h3>
                      <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">Start applying to scholarships to see them here. We'll track your progress and remind you of deadlines.</p>
                      <button className="text-[var(--color-primary-500)] font-semibold hover:underline">Discover Scholarships →</button>
                  </div>
              ) : (
                  <div className="space-y-6">
                  {filteredApps.map((app) => (
                      <div key={app.id} className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group hover:border-[var(--color-primary-500)]/30">
                      
                      {/* Card Header */}
                      <div className="p-6 pb-4 border-b border-[var(--color-border)] flex justify-between items-start">
                          <div>
                          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                              {app.title}
                              {app.urgent && <span className="bg-rose-500/10 text-rose-500 text-xs px-2 py-0.5 rounded-full font-bold uppercase border border-rose-500/20">Urgent</span>}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                              <span className="flex items-center gap-1 font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              💰 ${app.amount.toLocaleString()}
                              </span>
                              {app.deadline && (
                              <span className="flex items-center gap-1">
                                  📅 Due: {app.deadline} 
                                  <span className="text-[var(--color-text-secondary)] opacity-70">({app.daysLeft} days)</span>
                              </span>
                              )}
                              {app.wonDate && <span>🏆 Won: {app.wonDate}</span>}
                              {app.submittedDate && <span>📤 Submitted: {app.submittedDate}</span>}
                          </div>
                          </div>
                          
                          {/* More Options Dropdown */}
                          <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); toggleDropdown(app.id); }} className="p-2 hover:bg-[var(--color-bg-primary)] rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                              <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {activeDropdown === app.id && (
                              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl z-20 py-1">
                              <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] flex items-center gap-2">
                                  <Mail className="w-4 h-4" /> Email to Myself
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] flex items-center gap-2">
                                  <Copy className="w-4 h-4" /> Duplicate
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] flex items-center gap-2">
                                  <Calendar className="w-4 h-4" /> Set Reminder
                              </button>
                              <div className="h-px bg-[var(--color-border)] my-1"></div>
                              <button className="w-full px-4 py-2 text-left text-sm text-amber-500 hover:bg-[var(--color-bg-primary)] flex items-center gap-2">
                                  <PauseCircle className="w-4 h-4" /> Pause App
                              </button>
                              <button 
                                  onClick={() => { setShowDeleteModal(true); setActiveDropdown(null); }}
                                  className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-[var(--color-bg-primary)] flex items-center gap-2"
                              >
                                  <Trash2 className="w-4 h-4" /> Delete App
                              </button>
                              </div>
                          )}
                          </div>
                      </div>

                      {/* Card Body - Dynamic Content based on Status */}
                      <div className="p-6 pt-4 flex flex-col md:flex-row gap-8">
                          
                          {/* Left Col: Main Status Info */}
                          <div className="flex-1">
                          <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-[var(--color-text-secondary)]">Progress</span>
                              <span className="text-[var(--color-text-secondary)]">{app.progress}%</span>
                              </div>
                              <ProgressBar 
                              progress={app.progress} 
                              colorClass={
                                  app.status === 'won' ? 'bg-emerald-500' : 
                                  app.status === 'rejected' ? 'bg-[var(--color-text-secondary)]' : 
                                  app.status === 'submitted' ? 'bg-blue-500' : 
                                  'bg-[var(--color-primary-500)]'
                              } 
                              />
                              <div className={`text-sm font-medium mt-2 flex items-center gap-2 ${
                              app.status === 'won' ? 'text-emerald-500' :
                              app.status === 'submitted' ? 'text-blue-500' :
                              app.status === 'rejected' ? 'text-[var(--color-text-secondary)]' :
                              'text-yellow-500'
                              }`}>
                              {app.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-yellow-500"></div>}
                              {app.status === 'submitted' && <CheckCircle className="w-4 h-4" />}
                              {app.status === 'won' && <span>🎉</span>}
                              {app.statusLabel}
                              </div>
                          </div>

                          {/* Content Specific to Status */}
                          {app.status === 'in-progress' && app.checklist && (
                              <div className="space-y-1">
                              {app.checklist.map((item, idx) => (
                                  <ChecklistItem key={idx} label={item.label} status={item.status} />
                              ))}
                              </div>
                          )}

                          {app.status === 'submitted' && app.timeline && (
                              <div className="mt-4">
                              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 opacity-70">Timeline</div>
                              {app.timeline.map((t, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm mb-2">
                                  {t.status === 'completed' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : 
                                  t.status === 'current' ? <div className="w-4 h-4 rounded-full border-2 border-yellow-500 animate-pulse bg-yellow-500/20"></div> :
                                  <div className="w-4 h-4 rounded-full border-2 border-[var(--color-border)]"></div>
                                  }
                                  <span className={t.status === 'future' ? 'text-[var(--color-text-secondary)] opacity-50' : 'text-[var(--color-text-primary)]'}>
                                      <span className="font-semibold">{t.date}:</span> {t.label}
                                  </span>
                                  </div>
                              ))}
                              </div>
                          )}

                          {app.status === 'won' && (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                              <h4 className="font-semibold text-emerald-500 mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" /> Next Steps Required
                              </h4>
                              {app.nextSteps?.map((step, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm text-emerald-600/80 dark:text-emerald-400/80 mb-1">
                                  <input type="checkbox" className="mt-1 rounded text-emerald-500 focus:ring-emerald-500 bg-transparent border-emerald-500/30" />
                                  <span>{step}</span>
                                  </div>
                              ))}
                              <div className="mt-3 pt-3 border-t border-emerald-500/20 flex gap-3">
                                  <button className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline">
                                      <Download className="w-3 h-3" /> Award Letter
                                  </button>
                              </div>
                              </div>
                          )}

                          {app.status === 'rejected' && (
                              <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
                              <p className="text-sm text-[var(--color-text-secondary)] italic">"{app.feedback}"</p>
                              <div className="mt-3 flex gap-2">
                                  <button className="text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-2 py-1 rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors">Find Similar</button>
                                  <button className="text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-2 py-1 rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors">Archive</button>
                              </div>
                              </div>
                          )}
                          </div>

                          {/* Right Col: Metadata or Secondary Actions */}
                          {app.lastUpdated && (
                          <div className="md:w-48 flex flex-col justify-end text-right">
                              <div className="text-xs text-[var(--color-text-secondary)] mb-1 opacity-70">Last updated</div>
                              <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">{app.lastUpdated}</div>
                          </div>
                          )}
                      </div>

                      {/* Footer Actions */}
                      <div className="bg-[var(--color-bg-primary)]/30 px-6 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
                          <div className="text-xs text-[var(--color-text-secondary)] hidden md:block opacity-50">ID: #{app.id}2024-SCH</div>
                          <div className="flex gap-3 w-full md:w-auto justify-end">
                          {app.status === 'in-progress' && (
                              <>
                              <button className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] shadow-sm transition-colors">View Details</button>
                              <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-600)] shadow-sm flex items-center gap-2 transition-colors">
                                  Continue <ExternalLink className="w-3 h-3" />
                              </button>
                              </>
                          )}
                          {app.status === 'submitted' && (
                              <button className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] shadow-sm w-full md:w-auto transition-colors">Track Status</button>
                          )}
                          {app.status === 'won' && (
                              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm w-full md:w-auto transition-colors">Accept Award</button>
                          )}
                          {app.status === 'rejected' && (
                              <button className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)] shadow-sm w-full md:w-auto transition-colors">View Submission</button>
                          )}
                          </div>
                      </div>
                      </div>
                  ))}
                  </div>
              )}
          </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[var(--color-border)]">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                <AlertCircle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Delete Application?</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                  This will permanently delete "Tech Leaders Scholarship". This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg mb-6 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
               <ul className="space-y-2">
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span> All progress and drafts</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span> Essay drafts (450 words)</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span> Uploaded transcripts</li>
               </ul>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-sm shadow-sm transition-colors"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
