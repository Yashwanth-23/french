import React, { useState } from 'react';
import { UserPreferences, UserProfile } from '../types/preferences';
import { MediaFormat, CEFRLevel, ExamTarget } from '../types/curriculum';
import { Sparkles, ArrowRight, Headphones, Youtube, BookOpen, Globe, X } from 'lucide-react';
import { updateActiveProfile } from '../engine/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onComplete
}) => {
  const [dailyMinutes, setDailyMinutes] = useState(activeProfile.preferences.dailyTimeMinutes);
  const [selectedFormats, setSelectedFormats] = useState<MediaFormat[]>(activeProfile.preferences.preferredFormats);
  const [startingLevel, setStartingLevel] = useState<CEFRLevel>(activeProfile.preferences.startingLevel);
  const [targetExam, setTargetExam] = useState<ExamTarget>(activeProfile.preferences.targetExam || 'Universal_B2');

  if (!isOpen) return null;

  const handleToggleFormat = (format: MediaFormat) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? (prev.length > 1 ? prev.filter(f => f !== format) : prev) 
        : [...prev, format]
    );
  };

  const handleSave = () => {
    updateActiveProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dailyTimeMinutes: dailyMinutes,
        preferredFormats: selectedFormats,
        startingLevel,
        targetExam
      },
      currentMilestoneId: `milestone-${startingLevel.toLowerCase()}`
    }));
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Customize Your French Plan</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Daily Commitment */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              1. Daily Time Available
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { mins: 30, label: '30m (Slow)' },
                { mins: 60, label: '1.0h' },
                { mins: 90, label: '1.5h' },
                { mins: 120, label: '2.0h' },
              ].map(item => (
                <button
                  key={item.mins}
                  type="button"
                  onClick={() => setDailyMinutes(item.mins)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    dailyMinutes === item.mins
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Exam */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              2. Canadian Target Exam
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'TEF_Canada', label: 'TEF Canada', sub: 'Single-pass audio' },
                { id: 'TCF_Canada', label: 'TCF Canada', sub: 'Mixed audio pass' },
                { id: 'Universal_B2', label: 'Universal B2', sub: 'Both / Undecided' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTargetExam(item.id as ExamTarget)}
                  className={`p-2 rounded-xl border text-left transition ${
                    targetExam === item.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Formats */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              3. Preferred Learning Formats
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'podcast', label: 'Audio / Podcasts', icon: Headphones },
                { id: 'youtube', label: 'YouTube / Video', icon: Youtube },
                { id: 'book_pdf', label: 'Books / PDFs', icon: BookOpen },
                { id: 'web_app', label: 'Web Apps / Drills', icon: Globe },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = selectedFormats.includes(item.id as MediaFormat);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleFormat(item.id as MediaFormat)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              4. Current French Proficiency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'A0', label: 'A0 (True Zero)' },
                { id: 'A1', label: 'A1 (Basic Words)' },
                { id: 'A2', label: 'A2 (Simple Stories)' },
                { id: 'B1', label: 'B1 (Intermediate)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStartingLevel(item.id as CEFRLevel)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition ${
                    startingLevel === item.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2"
          >
            <span>Update & Recalibrate Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
