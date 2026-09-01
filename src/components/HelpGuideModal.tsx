import React, { useState } from 'react';
import { 
  HelpCircle, 
  Compass, 
  Calendar, 
  Languages, 
  GraduationCap, 
  Flame, 
  Sliders, 
  CheckCircle2, 
  X,
  BookOpen
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'missions' | 'bridges' | 'exams'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">How to Use the French TEF/TCF Mastery Portal</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto px-6 pt-3 border-b border-slate-800 bg-slate-950/50 gap-2">
          {[
            { id: 'overview', label: '1. Quick Start', icon: Compass },
            { id: 'missions', label: '2. Daily Missions', icon: Flame },
            { id: 'roadmap', label: '3. CEFR Roadmap', icon: Calendar },
            { id: 'bridges', label: '4. Linguistic Bridges', icon: Languages },
            { id: 'exams', label: '5. TEF/TCF Prep', icon: GraduationCap },
          ].map(t => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                  isSel
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Welcome to your Canadian French Immigration Command Center</h3>
              <p>
                This platform is engineered for global and multilingual candidates (English, Spanish, Telugu, Hindi) targeting <strong className="text-white">NCLC 7 / B2</strong> on the <strong>TEF Canada</strong> or <strong>TCF Canada</strong> exam for Express Entry.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400 flex items-center space-x-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>1. Profile & Time Budget</span>
                  </div>
                  <p className="text-slate-400">
                    Click your profile in the top-right to set your daily minutes (e.g. 1.0h, 1.5h, 2.0h) and preferred media (Podcasts, YouTube, Web Drills).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <Flame className="w-4 h-4" />
                    <span>2. Complete "Today's Mission"</span>
                  </div>
                  <p className="text-slate-400">
                    Every day, your dashboard generates an ordered, anti-passive sequence of tasks with timers. Check off items to maintain your streak.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-200">
                <strong className="text-sky-300">100% Free & Persistent:</strong> Your progress and profiles are saved in a secure cloud database (Supabase). Access your profile from any device using your personal sync link.
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">How Daily Missions Work</h3>
              <p>
                Unlike generic apps that only give passive reading, our recommender algorithm enforces <strong>Active Output Minimums</strong>:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Mandatory Conjugation Floor:</strong> At least 10-15 minutes of rapid verb drills daily (Le Conjugueur).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Active Vocal Shadowing:</strong> Reading transcripts aloud simultaneously with native audio (InnerFrench & RFI) to build muscle memory for speaking.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Integrated Countdown Timers:</strong> Click "Timer" on any task card to start a focused sprint.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">The CEFR Progression Pipeline (A0 → B2)</h3>
              <p>
                Realistic preparation for a non-Romance native speaker requires <strong>800–1,000 total hours</strong> broken into 5 pedagogical phases:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span><strong>Phase 0 (A0):</strong> Phonetics, Nasal Vowels, Silent Letters</span>
                  <span className="font-mono text-sky-400">~25h</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span><strong>Phase 1 (A1):</strong> Présent, Passé Composé, Core 1k Lexicon</span>
                  <span className="font-mono text-sky-400">~120h</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span><strong>Phase 2 (A2):</strong> Imparfait, Object Pronouns, Oral Shadowing</span>
                  <span className="font-mono text-sky-400">~180h</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span><strong>Phase 3 (B1):</strong> Subjonctif, Québécois Dialect, RFI News</span>
                  <span className="font-mono text-sky-400">~260h</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span><strong>Phase 4 (B2):</strong> Timed FEI/CCIP Mocks, Section A/B Roleplays</span>
                  <span className="font-mono text-sky-400">~220h</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bridges' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Multilingual Linguistic Fast-Track Shortcuts</h3>
              <p>
                Do not translate word-for-word into English! Instead, map concepts to your multilingual intuition:
              </p>
              <ul className="space-y-2 pl-2">
                <li><strong className="text-amber-400">Grammatical Gender:</strong> Every French noun is masculine or feminine (<em>la table, le livre</em>). Always memorize nouns with their article.</li>
                <li><strong className="text-sky-400">Tu vs Vous:</strong> Tu = informal "you" (friends); Vous = formal "you" (strangers, examiners). Never mix registers in exams.</li>
                <li><strong className="text-purple-400">Nasal Vowels:</strong> French nasal vowels (an, in, on, un) release air through both nose and mouth without sounding the final N/M.</li>
                <li><strong className="text-emerald-400">Latin Cognates:</strong> ~35% of English vocabulary carries over into French (<em>-tion, -ty → -té, -able → -able</em>).</li>
              </ul>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">TEF vs TCF Canada & Scoring Rules</h3>
              <p>
                Both exams are accepted by IRCC for Canadian immigration. Key differences:
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/20">
                  <div className="font-bold text-rose-300">TEF Canada (CCIP)</div>
                  <p className="text-slate-400 mt-0.5">
                    Audio plays <strong>strictly once</strong>. Enter the <strong>"Équivalence ancien score"</strong> column into Express Entry (Reading 207, Listening 249, Writing 310, Speaking 310).
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/20">
                  <div className="font-bold text-sky-300">TCF Canada (FEI)</div>
                  <p className="text-slate-400 mt-0.5">
                    Audio plays once for short items, twice for long items. NCLC 7 minimums: Reading 453, Listening 458, Writing 10/20, Speaking 10/20.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition"
          >
            Got It, Back to Study
          </button>
        </div>

      </div>
    </div>
  );
};
