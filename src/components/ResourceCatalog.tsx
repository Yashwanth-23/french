import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ExternalLink, 
  Star, 
  Globe, 
  Check, 
  Layers, 
  Headphones, 
  Youtube, 
  FileText
} from 'lucide-react';
import resourcesData from '../data/resources.json';
import { ResourceItem, MediaFormat, CEFRLevel } from '../types/curriculum';
import { UserProfile } from '../types/preferences';
import { saveProfileToCloud } from '../engine/dataService';

interface ResourceCatalogProps {
  activeProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export const ResourceCatalog: React.FC<ResourceCatalogProps> = ({
  activeProfile,
  onProfileUpdate
}) => {
  const resources = resourcesData as ResourceItem[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const bookmarks = activeProfile?.bookmarkedResourceIds || [];

  const handleToggleBookmark = async (resId: string) => {
    if (!activeProfile) return;
    const isBookmarked = bookmarks.includes(resId);
    const nextBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== resId)
      : [...bookmarks, resId];

    const updated: UserProfile = {
      ...activeProfile,
      bookmarkedResourceIds: nextBookmarks
    };

    await saveProfileToCloud(updated);
    onProfileUpdate();
  };

  const filteredResources = resources.filter(res => {
    if (showBookmarksOnly && !bookmarks.includes(res.id)) return false;
    if (selectedFormat !== 'all' && res.format !== selectedFormat) return false;
    if (selectedLevel !== 'all' && !res.cefrLevels.includes(selectedLevel as CEFRLevel)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.primarySkill.toLowerCase().includes(q) ||
        (res.notesForIndianLearners && res.notesForIndianLearners.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <span>Curated Free Resource Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            20 verified free resources classified with depth tags and cognitive structural notes.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showBookmarksOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({bookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search keywords, grammar, Hindi/Telugu notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Format Filter */}
        <div>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Media Formats</option>
            <option value="podcast">Podcasts / Audio</option>
            <option value="youtube">YouTube / Video</option>
            <option value="web_app">Interactive Web Drills</option>
            <option value="book_pdf">PDFs / Text Books</option>
            <option value="flashcards">Anki Flashcards</option>
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All CEFR Levels (A0 → B2)</option>
            <option value="A0">A0 (Phonetics & Sounds)</option>
            <option value="A1">A1 (Foundations)</option>
            <option value="A2">A2 (Intermediate Narrative)</option>
            <option value="B1">B1 (Independence & News)</option>
            <option value="B2">B2 (Exam Sprint)</option>
          </select>
        </div>

      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map(res => {
          const isSaved = bookmarks.includes(res.id);

          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {res.primarySkill}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{res.title}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(res.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition"
                    title={isSaved ? 'Remove from saved' : 'Save resource'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                {res.notesForIndianLearners && (
                  <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-200 text-xs">
                    <strong className="text-sky-300">Linguistic Insight:</strong> {res.notesForIndianLearners}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[11px]">
                  <span>Levels: {res.cefrLevels.join(', ')}</span>
                  {res.dialect && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {res.dialect}
                    </span>
                  )}
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 font-semibold transition"
                >
                  <span>Open Tool</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
