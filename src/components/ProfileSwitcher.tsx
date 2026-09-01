import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Check, 
  Download, 
  Sliders, 
  Headphones, 
  Youtube, 
  BookOpen, 
  Globe, 
  X,
  Smartphone,
  Languages,
  Settings
} from 'lucide-react';
import { UserProfile, UserPreferences, SecondaryLanguageBridge } from '../types/preferences';
import { MediaFormat, CEFRLevel, ExamTarget } from '../types/curriculum';
import { 
  createCloudProfile, 
  saveProfileToCloud, 
  regenerateQueueInCloud 
} from '../engine/dataService';

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  onProfileChanged: (profile: UserProfile) => void;
  onOpenFullOnboarding: () => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onProfileChanged,
  onOpenFullOnboarding
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // New Profile Form State
  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState(60);
  const [newFormats, setNewFormats] = useState<MediaFormat[]>(['podcast', 'youtube']);
  const [newLevel, setNewLevel] = useState<CEFRLevel>('A0');
  const [newTargetExam, setNewTargetExam] = useState<ExamTarget>('TEF_Canada');
  const [newBridge, setNewBridge] = useState<SecondaryLanguageBridge>('none');

  if (!isOpen) return null;

  const handleCreateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const prefs: UserPreferences = {
      dailyTimeMinutes: newMinutes,
      preferredFormats: newFormats,
      startingLevel: newLevel,
      targetExamDateMonths: 16,
      targetExam: newTargetExam,
      secondaryLanguageBridge: newBridge,
      skillFrictions: ['EO', 'Conjugation']
    };

    const newProfile = await createCloudProfile(newName.trim(), prefs);
    const newUrl = `${window.location.origin}${window.location.pathname}?user=${newProfile.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setIsCreatingNew(false);
    setNewName('');
    onProfileChanged(newProfile);
    onClose();
  };

  const handleUpdateSecondaryBridge = async (bridge: SecondaryLanguageBridge) => {
    const updated: UserProfile = {
      ...activeProfile,
      preferences: {
        ...activeProfile.preferences,
        secondaryLanguageBridge: bridge
      }
    };
    await saveProfileToCloud(updated);
    const refreshed = await regenerateQueueInCloud(activeProfile.id);
    if (refreshed) {
      onProfileChanged(refreshed);
    } else {
      onProfileChanged(updated);
    }
  };

  const handleUpdateActiveMinutes = async (minutes: number) => {
    const updated: UserProfile = {
      ...activeProfile,
      preferences: {
        ...activeProfile.preferences,
        dailyTimeMinutes: minutes
      },
      tagline: `${(minutes / 60).toFixed(1)}h / Day • ${activeProfile.preferences.targetExam.replace('_', ' ')} Focus`
    };
    await saveProfileToCloud(updated);
    const refreshed = await regenerateQueueInCloud(activeProfile.id);
    if (refreshed) {
      onProfileChanged(refreshed);
    } else {
      onProfileChanged(updated);
    }
  };

  const handleToggleFormat = async (format: MediaFormat) => {
    const current = activeProfile.preferences.preferredFormats;
    const next = current.includes(format)
      ? (current.length > 1 ? current.filter(f => f !== format) : current)
      : [...current, format];

    const updated: UserProfile = {
      ...activeProfile,
      preferences: {
        ...activeProfile.preferences,
        preferredFormats: next
      }
    };
    await saveProfileToCloud(updated);
    onProfileChanged(updated);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?user=${activeProfile.id}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `french_mastery_${activeProfile.id}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Study Profile & Linguistic Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Active Cloud Sync Card */}
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-base">@{activeProfile.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                  Active Cloud Profile
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Name: <strong>{activeProfile.name}</strong> • {activeProfile.tagline}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareLink}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md shadow-sky-500/20"
              >
                {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                <span>{shareCopied ? 'Link Copied!' : 'Copy My Sync Link'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenFullOnboarding();
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                title="Re-run Setup Wizard"
              >
                <Settings className="w-3.5 h-3.5 text-sky-400" />
                <span>Reconfigure All</span>
              </button>
            </div>
          </div>

          {/* Example Language / Native Bridge Selector */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white">
              <Languages className="w-4 h-4 text-sky-400" />
              <span>Example Notes & Linguistic Comparison</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Clean English is the standard base. Click to select your preferred secondary comparison bridge:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { id: 'none', label: '🌐 English Only (Universal)', sub: 'Clean English (Standard for US/Global)' },
                { id: 'telugu', label: '🇮🇳 Telugu + English', sub: 'Adds Telugu parallels (నువ్వు/మీరు, త/ద)' },
                { id: 'hindi', label: '🇮🇳 Hindi + English', sub: 'Adds Hindi parallels (तू/आप, लिंग)' },
                { id: 'tamil', label: '🇮🇳 Tamil + English', sub: 'Adds Tamil parallels (நீ/நீங்கள்)' },
                { id: 'spanish', label: '🇪🇸 Spanish + English', sub: 'Adds Spanish cognates (Tú/Usted)' },
              ].map(item => {
                const currentBridge = activeProfile.preferences.secondaryLanguageBridge || 'none';
                const isSelected = currentBridge === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleUpdateSecondaryBridge(item.id as SecondaryLanguageBridge)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-bold shadow-sm ring-1 ring-sky-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs text-white font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form for New Profile */}
          {isCreatingNew ? (
            <form onSubmit={handleCreateProfileSubmit} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Configure Friend's Plan</span>
                <button type="button" onClick={() => setIsCreatingNew(false)} className="text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Friend's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Jordan..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Daily Time</label>
                  <select
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value={30}>30m (Lite)</option>
                    <option value={60}>1.0h (Steady)</option>
                    <option value={90}>1.5h (Optimal)</option>
                    <option value={120}>2.0h (Intensive)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Target Exam</label>
                  <select
                    value={newTargetExam}
                    onChange={(e) => setNewTargetExam(e.target.value as ExamTarget)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="TEF_Canada">TEF Canada</option>
                    <option value="TCF_Canada">TCF Canada</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Example Bridge</label>
                  <select
                    value={newBridge}
                    onChange={(e) => setNewBridge(e.target.value as SecondaryLanguageBridge)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="none">English Only</option>
                    <option value="telugu">Telugu + Eng</option>
                    <option value="hindi">Hindi + Eng</option>
                    <option value="tamil">Tamil + Eng</option>
                    <option value="spanish">Spanish + Eng</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Create Friend's Isolated Plan
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Create Separate Profile for Friend</span>
            </button>
          )}

          {/* Quick Tuning for Active Profile */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Adjust Daily Study Pace</h3>
            </div>

            {/* Daily Minutes */}
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
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Formats */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5">Preferred Content Formats</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'podcast', label: 'Podcasts', icon: Headphones },
                  { id: 'youtube', label: 'YouTube / Video', icon: Youtube },
                  { id: 'book_pdf', label: 'Books / PDFs', icon: BookOpen },
                  { id: 'web_app', label: 'Web Drills', icon: Globe },
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

          {/* Backup */}
          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition border border-slate-700"
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
