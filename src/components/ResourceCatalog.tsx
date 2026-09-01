import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Headphones, 
  Youtube, 
  FileText, 
  Globe, 
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import resourcesData from '../data/resources.json';
import { ResourceItem, SkillType, MediaFormat, CEFRLevel, Dialect } from '../types/curriculum';
import { UserProfile } from '../types/preferences';
import { updateActiveProfile } from '../engine/storage';

interface ResourceCatalogProps {
  activeProfile: UserProfile;
  onProfileUpdate: () => void;
}

export const ResourceCatalog: React.FC<ResourceCatalogProps> = ({
  activeProfile,
  onProfileUpdate
}) => {
  const resources = resourcesData as ResourceItem[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedDialect, setSelectedDialect] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const skills: (string | SkillType)[] = ['ALL', 'CO', 'CE', 'EO', 'EE', 'Grammar', 'Conjugation', 'Vocab', 'Phonetics', 'Exam_Mock'];
  const formats: (string | MediaFormat)[] = ['ALL', 'podcast', 'youtube', 'book_pdf', 'web_app', 'flashcards', 'audio_transcript'];
  const levels: (string | CEFRLevel)[] = ['ALL', 'A0', 'A1', 'A2', 'B1', 'B2'];

  const bookmarkedIds = activeProfile.bookmarkedResourceIds || [];

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateActiveProfile(prev => {
      const current = prev.bookmarkedResourceIds || [];
      const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
      return { ...prev, bookmarkedResourceIds: next };
    });
    onProfileUpdate();
  };

  const filtered = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.creatorOrSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === 'ALL' || res.primarySkill === selectedSkill || (res.secondarySkills && res.secondarySkills.includes(selectedSkill as SkillType));
    const matchesFormat = selectedFormat === 'ALL' || res.format === selectedFormat;
    const matchesLevel = selectedLevel === 'ALL' || res.cefrLevels.includes(selectedLevel as CEFRLevel);
    const matchesDialect = selectedDialect === 'ALL' || res.dialect === selectedDialect;
    const matchesBookmark = !onlyBookmarked || bookmarkedIds.includes(res.id);

    return matchesSearch && matchesSkill && matchesFormat && matchesLevel && matchesDialect && matchesBookmark;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 w-fit">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Free Resource Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Curated Free Resource Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            100% free, battle-tested resources indexed by CEFR level, Canadian exam utility, and pedagogical nature.
          </p>
        </div>

        <button
          onClick={() => setOnlyBookmarked(!onlyBookmarked)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            onlyBookmarked
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Saved Resources ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Search & Multi-Filters */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, creator, or topic (e.g. InnerFrench, RFI, Le Conjugueur, Canadian accent)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Skill Filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Filter by Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              {skills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Filter by CEFR Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Filter by Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(res => {
          const isSaved = bookmarkedIds.includes(res.id);
          return (
            <div
              key={res.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-sky-500/40 transition-all shadow-md"
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {res.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {res.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {res.cefrLevels.join(', ')}
                    </span>
                    {res.dialect === 'Quebecois' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        🍁 Québécois
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleToggleBookmark(res.id, e)}
                    className="text-slate-500 hover:text-amber-400 transition"
                    title={isSaved ? 'Remove bookmark' : 'Bookmark resource'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Title and Creator */}
                <h3 className="text-base font-bold text-white mt-2">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Source: {res.creatorOrSource}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {res.description}
                </p>

                {/* Why It Works */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-emerald-400">Why It Works: </strong>
                  {res.whyItWorks}
                </div>

                {/* Indian Learner Note */}
                {res.notesForIndianLearners && (
                  <div className="mt-2 p-2 rounded-lg bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-200">
                    <strong className="text-sky-300">Indian Learner Context: </strong>
                    {res.notesForIndianLearners}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{res.estimatedMinutesPerSession}m session</span>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-semibold transition"
                >
                  <span>Launch Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
