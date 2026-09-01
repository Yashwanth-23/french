import React, { useState, useEffect } from 'react';
import { UserPreferences, UserProfile, SecondaryLanguageBridge } from '../types/preferences';
import { MediaFormat, CEFRLevel, ExamTarget } from '../types/curriculum';
import { 
  Sparkles, 
  ArrowRight, 
  Headphones, 
  Youtube, 
  BookOpen, 
  Globe, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Lock,
  Dices,
  Copy,
  CheckCircle2,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { 
  createCloudProfile, 
  updateExistingProfilePreferences, 
  checkSlugAvailable, 
  slugify,
  generateRandomHandle
} from '../engine/dataService';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onProfileCreated: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  initialProfile = null
}) => {
  const isEditing = Boolean(initialProfile);

  const [name, setName] = useState(initialProfile?.name || '');
  const [desiredSlug, setDesiredSlug] = useState(initialProfile?.id || '');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(true);
  const [dailyMinutes, setDailyMinutes] = useState(initialProfile?.preferences.dailyTimeMinutes || 120);
  const [targetExam, setTargetExam] = useState<ExamTarget>(initialProfile?.preferences.targetExam || 'TEF_Canada');
  const [selectedFormats, setSelectedFormats] = useState<MediaFormat[]>(initialProfile?.preferences.preferredFormats || ['podcast', 'youtube']);
  const [startingLevel, setStartingLevel] = useState<CEFRLevel>(initialProfile?.preferences.startingLevel || 'A0');
  const [targetMonths, setTargetMonths] = useState<number>(initialProfile?.preferences.targetExamDateMonths || 16);
  const [secondaryBridge, setSecondaryBridge] = useState<SecondaryLanguageBridge>(initialProfile?.preferences.secondaryLanguageBridge || 'none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Step State
  const [createdProfile, setCreatedProfile] = useState<UserProfile | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Sync state when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setDesiredSlug(initialProfile.id);
      setDailyMinutes(initialProfile.preferences.dailyTimeMinutes);
      setTargetExam(initialProfile.preferences.targetExam);
      setSelectedFormats(initialProfile.preferences.preferredFormats);
      setStartingLevel(initialProfile.preferences.startingLevel);
      setTargetMonths(initialProfile.preferences.targetExamDateMonths || 16);
      setSecondaryBridge(initialProfile.preferences.secondaryLanguageBridge || 'none');
      setSlugAvailable(true);
    }
  }, [initialProfile, isOpen]);

  // Real-time slug availability check
  useEffect(() => {
    if (isEditing || !desiredSlug.trim()) {
      setSlugAvailable(true);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      const available = await checkSlugAvailable(desiredSlug, initialProfile?.id);
      setSlugAvailable(available);
      setIsCheckingSlug(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [desiredSlug, isEditing, initialProfile]);

  if (!isOpen) return null;

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!isEditing) {
      setDesiredSlug(slugify(newName));
    }
  };

  const handleGenerateRandom = async () => {
    const random = generateRandomHandle();
    setName(random);
    setDesiredSlug(random);
  };

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

    if (!isEditing && slugAvailable === false) {
      alert(`Username '@${desiredSlug}' is already taken. Please choose another username.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const prefs: UserPreferences = {
        dailyTimeMinutes: dailyMinutes,
        preferredFormats: selectedFormats,
        startingLevel,
        targetExamDateMonths: targetMonths,
        targetExam,
        secondaryLanguageBridge: secondaryBridge,
        skillFrictions: ['EO', 'Conjugation']
      };

      let savedProfile: UserProfile;
      if (isEditing && initialProfile) {
        // Update existing row in Supabase and preserve progress
        savedProfile = await updateExistingProfilePreferences(initialProfile, name, prefs);
        onProfileCreated(savedProfile);
        if (onClose) onClose();
      } else {
        // Create brand new cloud profile
        savedProfile = await createCloudProfile(name, prefs, desiredSlug);
        const newUrl = `${window.location.origin}${window.location.pathname}?user=${savedProfile.id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        // Show Post-Creation Success Screen
        setCreatedProfile(savedProfile);
      }
    } catch (err: any) {
      console.error('Failed to save profile', err);
      alert(err.message || 'Error creating profile. Please try another username.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullAccessUrl = createdProfile
    ? `${window.location.origin}${window.location.pathname}?user=${createdProfile.id}`
    : '';

  const handleCopyLink = () => {
    if (fullAccessUrl) {
      navigator.clipboard.writeText(fullAccessUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleFinishAndEnter = () => {
    if (createdProfile) {
      onProfileCreated(createdProfile);
      setCreatedProfile(null);
      if (onClose) onClose();
    }
  };

  // --- Render Success Screen ---
  if (createdProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-white">Profile Created Successfully!</h2>
            <p className="text-xs text-slate-300">
              Welcome, <strong className="text-sky-400">@{createdProfile.id}</strong> ({createdProfile.name}). Your personalized Canadian French plan is ready.
            </p>
          </div>

          {/* Direct Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Your Private Access URL</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Cloud Sync Ready
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-sky-300 break-all select-all">
              {fullAccessUrl}
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                linkCopied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy My Personal Access Link</span>
                </>
              )}
            </button>
          </div>

          {/* Critical Warning / Instruction Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left flex items-start space-x-2.5 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">⚠️ Save & Bookmark This Link:</strong>
              This URL is your personal access key. Bookmark it or message it to yourself to seamlessly resume your exact study progress and streak from any phone, laptop, or browser without needing a password.
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleFinishAndEnter}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
          >
            <span>Enter Dashboard & Start Day 1 Mission</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    );
  }

  // --- Render Creation / Edit Form ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center space-x-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 w-fit mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEditing ? `Reconfigure @${initialProfile?.id}` : 'Personalized Cloud Setup'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isEditing ? `Adjust Preferences for @${initialProfile?.id}` : 'Create Your Canadian French Plan'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isEditing
              ? 'Your completed tasks, lifetime study hours, and streak are 100% preserved.'
              : 'Your custom exam timeline, formats, and task backlog will sync across your devices.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Name & Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                1. Your Name / Unique Handle
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="flex items-center space-x-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30 transition"
                  title="Generate a unique random username like Reddit"
                >
                  <Dices className="w-3 h-3" />
                  <span>🎲 Random Handle</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Yash or Rahul"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  !isEditing && slugAvailable === false
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-700 focus:border-sky-500'
                }`}
                required
              />
            </div>

            {/* Generated Unique Access Link Preview & Status */}
            <div className={`flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-lg border transition ${
              !isEditing && slugAvailable === false
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <span className="truncate">
                {isEditing ? (
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Active Sync Key: <strong className="text-emerald-400">?user={initialProfile?.id}</strong></span>
                  </span>
                ) : (
                  <span>Sync Link: <strong className={slugAvailable ? 'text-sky-400' : 'text-rose-400'}>?user={desiredSlug}</strong></span>
                )}
              </span>

              {!isEditing && (
                <span className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  {isCheckingSlug ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                  ) : slugAvailable === true ? (
                    <span className="text-emerald-400 flex items-center space-x-0.5 font-sans font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Available</span>
                    </span>
                  ) : slugAvailable === false ? (
                    <span className="text-rose-400 flex items-center space-x-0.5 font-sans font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Already Taken — Pick Another</span>
                    </span>
                  ) : null}
                </span>
              )}
            </div>

            {/* Warning when username is taken */}
            {!isEditing && slugAvailable === false && (
              <p className="text-[11px] text-rose-400 font-medium">
                ⚠️ Username <strong>'@{desiredSlug}'</strong> is already registered. Please enter a different name or click <strong>🎲 Random Handle</strong> above.
              </p>
            )}
          </div>

          {/* Example Language / Native Bridge Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
              2. Example Notes & Linguistic Bridge (English is default)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              All explanations are in clean English. Select an optional native parallel:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'none', label: '🌐 English Only (Universal)', sub: 'Clean standard English (Recommended for US/Global)' },
                { id: 'telugu', label: '🇮🇳 Telugu + English', sub: 'Adds Telugu parallels (నువ్వు/మీరు, త/ద)' },
                { id: 'hindi', label: '🇮🇳 Hindi + English', sub: 'Adds Hindi parallels (तू/आप, लिंग)' },
                { id: 'tamil', label: '🇮🇳 Tamil + English', sub: 'Adds Tamil parallels (నీ/நீங்கள்)' },
                { id: 'spanish', label: '🇪🇸 Spanish + English', sub: 'Adds Spanish cognates (Tú/Usted)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSecondaryBridge(item.id as SecondaryLanguageBridge)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    secondaryBridge === item.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-sm font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs text-white font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim() || (!isEditing && slugAvailable === false) || isSubmitting}
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Cloud Database...</span>
              </>
            ) : !isEditing && slugAvailable === false ? (
              <span>⚠️ Pick an Available Username to Continue</span>
            ) : (
              <>
                <span>{isEditing ? 'Save Preferences & Refresh Queue' : 'Initialize Rolling Study Backlog'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
