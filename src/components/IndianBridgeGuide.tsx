import React, { useState } from 'react';
import { 
  Languages, 
  Search, 
  Lightbulb, 
  Volume2, 
  Check, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import bridgeData from '../data/linguisticBridges.json';
import { IndianBridgeConcept } from '../types/curriculum';

export const IndianBridgeGuide: React.FC = () => {
  const bridges = bridgeData as IndianBridgeConcept[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Grammar', 'Phonetics', 'Sociolinguistics', 'Vocabulary'];

  const filtered = bridges.filter(item => {
    const matchesSearch = 
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.frenchConcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hindiAnalogy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teluguAnalogy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual Mental Models</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Indian Linguistic Bridge & Fast-Track Shortcuts
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          How to leverage your fluency in <strong className="text-white">Telugu, Hindi, and English</strong> to bypass common Romance language hurdles without translating everything word-for-word.
        </p>

        {/* Quick Search & Filters */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search concepts (e.g. gender, tu/vous, nasal vowels, past tense)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-5">
        {filtered.map(concept => (
          <div
            key={concept.id}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-lg hover:border-amber-500/30 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {concept.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {concept.topic}
                </h3>
              </div>
            </div>

            {/* French Concept */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200">
              <strong className="text-sky-400">French Rule: </strong>
              {concept.frenchConcept}
            </div>

            {/* 3-Way Indian Language Analogy Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Hindi Analogy */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                  <span>🇮🇳 Hindi Bridge</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.hindiAnalogy}
                </p>
                <div className="pt-1 text-[11px] font-mono text-amber-200/80">
                  Ex: {concept.exampleHindi}
                </div>
              </div>

              {/* Telugu Analogy */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-sky-500/20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-400">
                  <span>🇮🇳 Telugu Bridge</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.teluguAnalogy}
                </p>
                <div className="pt-1 text-[11px] font-mono text-sky-200/80">
                  Ex: {concept.exampleTelugu}
                </div>
              </div>

              {/* English Analogy */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
                  <span>🇬🇧 English Bridge</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.englishAnalogy}
                </p>
                <div className="pt-1 text-[11px] font-mono text-indigo-200/80">
                  Ex: {concept.exampleEnglish}
                </div>
              </div>

            </div>

            {/* Practical Action Tip */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start space-x-2 text-xs text-emerald-200">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 font-semibold">Actionable Native Shortcut: </strong>
                {concept.practicalTip}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
