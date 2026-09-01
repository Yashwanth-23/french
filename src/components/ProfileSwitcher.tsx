import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  Share2, 
  Download, 
  Upload, 
  Clock, 
  Sliders, 
  Headphones, 
  Youtube, 
  BookOpen, 
  Globe, 
  Sparkles,
  X
} from 'lucide-react';
import { UserProfile, UserPreferences } from '../types/preferences';
import { MediaFormat, CEFRLevel, SkillType, ExamTarget } from '../types/curriculum';
import { 
  getStoredProfiles, 
  setActiveProfile, 
  createNewProfile, 
  deleteProfile, 
  updateActiveProfile,
  encodeProfileForSharing
} from '../engine/storage';

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  onProfileChanged: () => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onProfileChanged
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getStoredProfiles());
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // New Profile Form State
  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState(60);
  const [newFormats, setNewFormats] = useState<MediaFormat[]>(['podcast', 'youtube']);
  const [newLevel, setNewLevel] = useState<CEFRLevel>('A0');
  const [newTargetExam, setNewTargetExam] = useState<ExamTarget>('Universal_B2');
  const [newFrictions, setNewFrictions] = useState<SkillType[]>(['EO', 'Conjugation']);

  if (!isOpen) return null;

  const handleSelectProfile = (id: string) => {
    setActiveProfile(id);
    setProfiles(getStoredProfiles());
    onProfileChanged();
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('You must keep at least one profile.');
      return;
    }
    if (confirm('Delete this plan profile?')) {
      deleteProfile(id);
      setProfiles(getStoredProfiles());
      onProfileChanged();
    }
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const prefs: UserPreferences = {
      dailyTimeMinutes: newMinutes,
      preferredFormats: newFormats,
      startingLevel: newLevel,
      targetExamDateMonths: 16,
      targetExam: newTargetExam,
      skillFrictions: newFrictions
    };

    const tagline = `${(newMinutes / 60).toFixed(1)}h / Day • ${newFormats.join(' & ')} Focus`;
    createNewProfile(newName.trim(), tagline, prefs);
    setProfiles(getStoredProfiles());
    setIsCreatingNew(false);
    setNewName('');
    onProfileChanged();
  };

  const handleUpdateActiveMinutes = (minutes: number) => {
    updateActiveProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dailyTimeMinutes: minutes
      },
      tagline: `${(minutes / 60).toFixed(1)}h / Day • ${prev.preferences.preferredFormats.join(' & ')} Focus`
    }));
    setProfiles(getStoredProfiles());
    onProfileChanged();
  };

  const handleToggleFormat = (format: MediaFormat) => {
    updateActiveProfile(prev => {
      const current = prev.preferences.preferredFormats;
      const next = current.includes(format)
        ? current.filter(f => f !== format)
        : [...current, format];
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          preferredFormats: next.length > 0 ? next : ['podcast']
        }
      };
    });
    setProfiles(getStoredProfiles());
    onProfileChanged();
  };

  const handleShareLink = () => {
    const code = encodeProfileForSharing(activeProfile);
    const url = `${window.location.origin}${window.location.pathname}?plan=${code}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `french_mastery_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Learning Profiles & Preference Engine</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Profile Switcher List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Study Profiles ({profiles.length})
              </label>
              {!isCreatingNew && (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Profile for Friend</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profiles.map(p => {
                const isSelected = p.id === activeProfile.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p.id)}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white">{p.name}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{p.tagline}</p>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleDeleteProfile(p.id, e)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                          title="Delete profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form for New Profile */}
          {isCreatingNew && (
            <form onSubmit={handleCreateProfileSubmit} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-sky-400">Configure Friend's / Alternate Plan</span>
                <button type="button" onClick={() => setIsCreatingNew(false)} className="text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul's 1-Hour Track"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Daily Time</label>
                  <select
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value={30}>30m (Lite)</option>
                    <option value={60}>1.0h (Balanced)</option>
                    <option value={90}>1.5h (Optimal)</option>
                    <option value={120}>2.0h (Intensive)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Target Exam</label>
                  <select
                    value={newTargetExam}
                    onChange={(e) => setNewTargetExam(e.target.value as ExamTarget)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value="TEF_Canada">TEF Canada</option>
                    <option value="TCF_Canada">TCF Canada</option>
                    <option value="Universal_B2">Undecided / Both</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Start Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as CEFRLevel)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value="A0">A0 (Zero)</option>
                    <option value="A1">A1 (Basics)</option>
                    <option value="A2">A2 (Sentences)</option>
                    <option value="B1">B1 (Intermediate)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-sm transition"
              >
                Create & Activate Custom Plan
              </button>
            </form>
          )}

          {/* Quick Tuning for Active Profile */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-white">Fine-Tune Active Plan Parameters</h3>
            </div>

            {/* Daily Minutes Selector */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Daily Time Budget</span>
                <span className="font-mono text-sky-400 font-semibold">{activeProfile.preferences.dailyTimeMinutes} min/day</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleUpdateActiveMinutes(mins)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                      activeProfile.preferences.dailyTimeMinutes === mins
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Formats */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5">Preferred Content Formats (Multi-select)</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'podcast', label: 'Podcasts', icon: Headphones },
                  { id: 'youtube', label: 'YouTube / Video', icon: Youtube },
                  { id: 'book_pdf', label: 'Books / PDFs', icon: BookOpen },
                  { id: 'web_app', label: 'Interactive Web Drills', icon: Globe },
                ].map(fmt => {
                  const isChecked = activeProfile.preferences.preferredFormats.includes(fmt.id as MediaFormat);
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => handleToggleFormat(fmt.id as MediaFormat)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isChecked
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{fmt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Share & Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={handleShareLink}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{shareCopied ? 'Link Copied to Clipboard!' : 'Share Plan with Friend'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Offline Backup (JSON)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
