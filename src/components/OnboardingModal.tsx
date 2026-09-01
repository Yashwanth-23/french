import React, { useState, useEffect } from 'react';
import { UserPreferences, UserProfile, LinguisticAnchor } from '../types/preferences';
import { MediaFormat, CEFRLevel, ExamTarget } from '../types/curriculum';
import { Sparkles, ArrowRight, Headphones, Youtube, BookOpen, Globe, Check, AlertCircle, RefreshCw, Languages } from 'lucide-react';
import { createCloudProfile, checkSlugAvailable, slugify } from '../engine/dataService';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onProfileCreated: (profile: UserProfile) => void;
  isInitialSetup?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  isInitialSetup = false
}) => {
  const [name, setName] = useState('');
  const [desiredSlug, setDesiredSlug] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [targetExam, setTargetExam] = useState<ExamTarget>('TEF_Canada');
  const [selectedFormats, setSelectedFormats] = useState<MediaFormat[]>(['podcast', 'youtube']);
  const [startingLevel, setStartingLevel] = useState<CEFRLevel>('A0');
  const [targetMonths, setTargetMonths] = useState<number>(16);
  const [linguisticAnchor, setLinguisticAnchor] = useState<LinguisticAnchor>('telugu');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (name.trim()) {
      const candidate = slugify(name);
      setDesiredSlug(candidate);
    }
  }, [name]);

  useEffect(() => {
    if (!desiredSlug.trim()) {
      setSlugAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      const available = await checkSlugAvailable(desiredSlug);
      setSlugAvailable(available);
      setIsCheckingSlug(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [desiredSlug]);

  if (!isOpen) return null;

  const handleToggleFormat = (format: MediaFormat) => {
    setSelectedFormats(prev =>
      prev.includes(format)
        ? (prev.length > 1 ? prev.filter(f => f !== format) : prev)
        : [...prev, format]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const prefs: UserPreferences = {
        dailyTimeMinutes: dailyMinutes,
        preferredFormats: selectedFormats,
        startingLevel,
        targetExamDateMonths: targetMonths,
        targetExam,
        linguisticAnchor,
        skillFrictions: ['EO', 'Conjugation']
      };

      const newProfile = await createCloudProfile(name, prefs, desiredSlug);

      const newUrl = `${window.location.origin}${window.location.pathname}?user=${newProfile.id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);

      onProfileCreated(newProfile);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create profile', err);
      alert('Error creating profile. Please try another username.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center space-x-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 w-fit mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Cloud Setup</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isInitialSetup ? 'Create Your Canadian French Plan' : 'Configure New Study Profile'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your custom exam timeline, linguistic anchors, and rolling backlog will sync across all your devices.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Name & Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              1. Your Name / Personal Handle
            </label>
            <input
              type="text"
              placeholder="e.g. Yashwanth or Rahul"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              required
            />

            {desiredSlug && (
              <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                <span className="truncate">
                  Sync Link: <strong className="text-sky-400">?user={desiredSlug}</strong>
                </span>
                <span className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  {isCheckingSlug ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                  ) : slugAvailable === true ? (
                    <span className="text-emerald-400 flex items-center space-x-0.5">
                      <Check className="w-3 h-3" />
                      <span>Available</span>
                    </span>
                  ) : slugAvailable === false ? (
                    <span className="text-amber-400 flex items-center space-x-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>Taken (will add suffix)</span>
                    </span>
                  ) : null}
                </span>
              </div>
            )}
          </div>

          {/* Linguistic Anchor */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              2. Comparative Native Language Anchor
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'telugu', label: 'Telugu Native', sub: 'నువ్వు/మీరు, త/ద' },
                { id: 'hindi', label: 'Hindi / National', sub: 'तू/आप, त/द, लिंग' },
                { id: 'universal_english', label: 'English / Universal', sub: 'Latin Cognates & Syntax' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLinguisticAnchor(item.id as LinguisticAnchor)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    linguisticAnchor === item.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Exam */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              3. Canadian Immigration Target Exam
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'TEF_Canada', label: 'TEF Canada', sub: 'Single-pass audio (CCIP)' },
                { id: 'TCF_Canada', label: 'TCF Canada', sub: 'Mixed playback (FEI)' },
                { id: 'Universal_B2', label: 'Universal B2', sub: 'Both / Undecided' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTargetExam(item.id as ExamTarget)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    targetExam === item.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Timeline */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              4. Target Exam Timeline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { months: 6, label: '6 Months', sub: 'Fast Track' },
                { months: 12, label: '12 Months', sub: '1 Year Goal' },
                { months: 16, label: '16 Months', sub: 'Dec 2027 Sprint' },
                { months: 24, label: '24 Months', sub: '2 Year Steady' },
              ].map(item => (
                <button
                  key={item.months}
                  type="button"
                  onClick={() => setTargetMonths(item.months)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    targetMonths === item.months
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Commitment */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              5. Daily Time Commitment
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { mins: 30, label: '30m (Lite)' },
                { mins: 60, label: '1.0h (Steady)' },
                { mins: 90, label: '1.5h (Optimal)' },
                { mins: 120, label: '2.0h (Intensive)' },
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

          {/* Formats */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              6. Preferred Learning Formats
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'podcast', label: 'Audio & Podcasts', icon: Headphones },
                { id: 'youtube', label: 'YouTube / Video', icon: Youtube },
                { id: 'web_app', label: 'Interactive Web Drills', icon: Globe },
                { id: 'book_pdf', label: 'Books / PDFs', icon: BookOpen },
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

          {/* Starting Level */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              7. Starting Baseline Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'A0', label: 'A0 (True Zero - Start with Sounds)' },
                { id: 'A1', label: 'A1 (Know Basic Greetings & Verbs)' },
                { id: 'A2', label: 'A2 (Can Form Sentences in Past)' },
                { id: 'B1', label: 'B1 (Intermediate Reader / Audio)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStartingLevel(item.id as CEFRLevel)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    startingLevel === item.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-white block">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Cloud Database...</span>
              </>
            ) : (
              <>
                <span>Initialize Rolling Study Backlog</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
