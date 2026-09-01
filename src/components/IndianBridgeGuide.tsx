import React, { useState } from 'react';
import { 
  Languages, 
  Search, 
  Lightbulb, 
  BookOpen, 
  ArrowRight, 
  HelpCircle,
  Globe,
  Sparkles,
  Layers
} from 'lucide-react';
import bridgesData from '../data/linguisticBridges.json';
import { IndianBridgeConcept } from '../types/curriculum';

export const IndianBridgeGuide: React.FC = () => {
  const concepts = bridgesData as IndianBridgeConcept[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLangFilter, setActiveLangFilter] = useState<'all' | 'english' | 'spanish' | 'telugu' | 'hindi'>('all');

  const filteredConcepts = concepts.filter(c => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.topic.toLowerCase().includes(q) ||
        c.frenchConcept.toLowerCase().includes(q) ||
        c.englishAnalogy.toLowerCase().includes(q) ||
        (c.spanishAnalogy && c.spanishAnalogy.toLowerCase().includes(q)) ||
        (c.teluguAnalogy && c.teluguAnalogy.toLowerCase().includes(q)) ||
        (c.hindiAnalogy && c.hindiAnalogy.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Multilingual Mental Models</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Linguistic Bridge & Fast-Track Shortcuts
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Leverage your intuition in <strong>English, Spanish, Telugu, or Hindi</strong> to bypass common Romance language hurdles without word-for-word translation.
            </p>
          </div>

          {/* Language Matrix Badges */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
            {[
              { id: 'all', label: 'All Bridges' },
              { id: 'english', label: '🇬🇧 English' },
              { id: 'spanish', label: '🇪🇸 Spanish' },
              { id: 'telugu', label: '🇮🇳 Telugu' },
              { id: 'hindi', label: '🇮🇳 Hindi' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLangFilter(l.id as any)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                  activeLangFilter === l.id
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search concepts (e.g. gender, tu/vous, nasal, past tense)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Grammar', 'Phonetics', 'Sociolinguistics', 'Vocabulary'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Cards */}
      <div className="space-y-4">
        {filteredConcepts.map(c => (
          <div
            key={c.id}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4"
          >
            {/* Concept Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {c.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{c.topic}</h3>
            </div>

            {/* French Target Rule */}
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs">
              <span className="font-bold text-sky-300 uppercase tracking-wider block mb-1">Target French Rule:</span>
              <p className="text-white leading-relaxed font-medium">{c.frenchConcept}</p>
            </div>

            {/* Comparison Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* English */}
              {(activeLangFilter === 'all' || activeLangFilter === 'english') && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-sky-400 flex items-center space-x-1">
                    <span>🇬🇧 English Parallel</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.englishAnalogy}</p>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                    <strong className="text-slate-300">Ex:</strong> {c.exampleEnglish}
                  </div>
                </div>
              )}

              {/* Spanish */}
              {(activeLangFilter === 'all' || activeLangFilter === 'spanish') && c.spanishAnalogy && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
                  <div className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                    <span>🇪🇸 Spanish Romance Bridge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.spanishAnalogy}</p>
                  {c.exampleSpanish && (
                    <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                      <strong className="text-slate-300">Ex:</strong> {c.exampleSpanish}
                    </div>
                  )}
                </div>
              )}

              {/* Telugu */}
              {(activeLangFilter === 'all' || activeLangFilter === 'telugu') && c.teluguAnalogy && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-1.5">
                  <div className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
                    <span>🇮🇳 Telugu Native Bridge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.teluguAnalogy}</p>
                  {c.exampleTelugu && (
                    <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                      <strong className="text-slate-300">Ex:</strong> {c.exampleTelugu}
                    </div>
                  )}
                </div>
              )}

              {/* Hindi */}
              {(activeLangFilter === 'all' || activeLangFilter === 'hindi') && c.hindiAnalogy && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-orange-500/20 space-y-1.5">
                  <div className="text-xs font-bold text-orange-400 flex items-center space-x-1">
                    <span>🇮🇳 Hindi Bridge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.hindiAnalogy}</p>
                  {c.exampleHindi && (
                    <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                      <strong className="text-slate-300">Ex:</strong> {c.exampleHindi}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Actionable Shortcut Tip */}
            <div className="flex items-start space-x-2 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300">Actionable Rule of Thumb:</strong> {c.practicalTip}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
