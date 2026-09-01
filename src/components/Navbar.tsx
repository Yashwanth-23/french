import React from 'react';
import { 
  Compass, 
  Flame, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Languages, 
  Calendar, 
  UserCheck,
  HelpCircle,
  Cloud,
  Share2
} from 'lucide-react';
import { UserProfile } from '../types/preferences';
import { isSupabaseConfigured } from '../engine/dataService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeProfile: UserProfile | null;
  onOpenProfileModal: () => void;
  onOpenDiagnosticModal: () => void;
  onOpenHelpModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  onOpenProfileModal,
  onOpenDiagnosticModal,
  onOpenHelpModal
}) => {
  const tabs = [
    { id: 'mission', label: "Today's Mission", icon: Compass },
    { id: 'roadmap', label: 'CEFR Roadmap', icon: Calendar },
    { id: 'bridges', label: 'Linguistic Bridges', icon: Languages },
    { id: 'exam', label: 'TEF / TCF Canada Hub', icon: GraduationCap },
    { id: 'catalog', label: 'Resource Vault', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('mission')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-base">
              🍁
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">FrenchMastery</span>
                <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  TEF/TCF
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Multilingual Cognitive Engine</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Compact Status & Actions Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Streak Status Pill */}
            {activeProfile && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{activeProfile.streakDays || 1}d</span>
              </div>
            )}

            {/* Diagnostic Action Button */}
            <button
              onClick={onOpenDiagnosticModal}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition"
              title="Level Diagnostic Quiz"
            >
              <Sparkles className="w-3 h-3" />
              <span>Diagnostic</span>
            </button>

            {/* Help / Guide Button */}
            <button
              onClick={onOpenHelpModal}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-slate-700 transition"
              title="How to Use This Portal"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Profile Button / Cloud User Link */}
            {activeProfile ? (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium hover:border-sky-500 transition"
                title="Switch Profile / Edit Time"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="max-w-[90px] truncate">@{activeProfile.id}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                  {activeProfile.preferences.dailyTimeMinutes}m
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md shadow-sky-500/20"
              >
                <span>Get Started</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Nav Submenu */}
      <div className="lg:hidden flex overflow-x-auto py-2 px-4 space-x-2 border-t border-slate-800/80 bg-slate-950/90 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
