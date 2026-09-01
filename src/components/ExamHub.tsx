import React, { useState } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Clock, 
  FileText, 
  Mic, 
  PenTool, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Check, 
  HelpCircle,
  ShieldAlert,
  Headphones,
  Scale,
  Info
} from 'lucide-react';
import examData from '../data/examTemplates.json';
import { ExamTemplateSection, ExamTarget } from '../types/curriculum';

export const ExamHub: React.FC = () => {
  const templates = examData as ExamTemplateSection[];
  const [selectedExamFilter, setSelectedExamFilter] = useState<'ALL' | 'TEF_Canada' | 'TCF_Canada'>('ALL');
  const [activeSectionId, setActiveSectionId] = useState(templates[0].id);
  const [writingDraft, setWritingDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(
    t => selectedExamFilter === 'ALL' || t.examType === selectedExamFilter
  );

  const currentTemplate = filteredTemplates.find(t => t.id === activeSectionId) || filteredTemplates[0] || templates[0];

  const wordCount = writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0;

  const handleCopyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 w-fit">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Official IRCC Target: CLB 7 / NCLC 7</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          TEF Canada vs TCF Canada Strategy Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Official past formats, single-pass vs. double-pass listening strategy, and verified Government of Canada (IRCC) score conversion tables.
        </p>

        {/* Free Official Links & Mock Depth Truth Matrix */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          
          {/* TV5Monde */}
          <a
            href="https://apprendre.tv5monde.com/fr/exercices/tcf"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500 text-xs flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-indigo-400 transition">TV5Monde Simulator</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Deep Mock Bank</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Dozens of complete 40-question series developed with FEI.</p>
            </div>
            <div className="flex items-center space-x-1 text-indigo-400 font-medium text-[11px] mt-2 pt-2 border-t border-slate-800">
              <span>Launch Mock Engine</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          {/* RFI Savoirs TCF */}
          <a
            href="https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 text-xs flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-emerald-400 transition">RFI Savoirs & News</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Deep Audio Bank</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Daily international news with synchronized transcripts for oral shadowing.</p>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 font-medium text-[11px] mt-2 pt-2 border-t border-slate-800">
              <span>Launch Audio Drills</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          {/* Official Bodies Samples */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Official Test Owners</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Orientation Kits</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Official sample booklets from <strong className="text-slate-300">FEI (TCF)</strong> & <strong className="text-slate-300">CCIP (TEF)</strong> for format calibration.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] mt-2 pt-2 border-t border-slate-800">
              <a href="https://www.france-education-international.fr/tcf-canada" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center space-x-0.5">
                <span>FEI TCF PDF</span> <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a href="https://www.lefrancaisdesaffaires.fr/tests-diplomes/test-evaluation-francais-tef/tef-canada/" target="_blank" rel="noreferrer" className="text-rose-400 hover:underline flex items-center space-x-0.5">
                <span>CCIP TEF PDF</span> <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* CRITICAL IRCC FILING WARNING ALERT */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-bold text-amber-300 text-sm flex items-center space-x-1.5">
            <span>Critical IRCC Express Entry Score Warning</span>
          </div>
          <p>
            When entering TEF Canada results into your Express Entry profile, <strong className="text-white underline">you must enter the "Équivalence ancien score" column</strong> (Reading /300, Listening /360, Writing /450, Speaking /450). 
            <strong className="text-white"> DO NOT enter the "Score / 699" column</strong>. IRCC states that /699 values are incompatible with Express Entry and submitting them may cause your application to be rejected.
          </p>
          <div className="pt-1">
            <a 
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements/language-testing.html" 
              target="_blank" 
              rel="noreferrer"
              className="text-sky-400 hover:underline font-mono inline-flex items-center space-x-1"
            >
              <span>Source: Government of Canada (Canada.ca) Language Testing Criteria</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* VERIFIED IRCC NCLC 7 SCORE TABLE */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Verified IRCC Language Equivalency Standards (CLB / NCLC 7)</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Official Canada.ca Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Skill Ability</th>
                <th className="py-3 px-3 text-rose-300">TEF Canada (Équivalence Ancien Score)</th>
                <th className="py-3 px-3 text-sky-300">TCF Canada (FEI Score)</th>
                <th className="py-3 px-3 text-amber-300">Target Benchmark Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Compréhension de l'écrit (Reading)</td>
                <td className="py-3 px-3 text-rose-200 font-mono"><strong>207 – 232</strong> <span className="text-slate-400">/ 300</span> (Min: 207)</td>
                <td className="py-3 px-3 text-sky-200 font-mono"><strong>453 – 498</strong> <span className="text-slate-400">/ 699</span> (Min: 453)</td>
                <td className="py-3 px-3 text-slate-300">Requires ~35 min speed-reading and formal vocabulary.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Compréhension de l'oral (Listening)</td>
                <td className="py-3 px-3 text-rose-200 font-mono"><strong>249 – 279</strong> <span className="text-slate-400">/ 360</span> (Min: 249)</td>
                <td className="py-3 px-3 text-sky-200 font-mono"><strong>458 – 502</strong> <span className="text-slate-400">/ 699</span> (Min: 458)</td>
                <td className="py-3 px-3 text-slate-300">TEF = Single-pass audio only; TCF = Mixed single/double pass.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Expression écrite (Writing)</td>
                <td className="py-3 px-3 text-rose-200 font-mono"><strong>310 – 348</strong> <span className="text-slate-400">/ 450</span> (Min: 310)</td>
                <td className="py-3 px-3 text-sky-200 font-mono"><strong>10 – 11</strong> <span className="text-slate-400">/ 20</span> (Min: 10)</td>
                <td className="py-3 px-3 text-slate-300">TEF = 1 Fait divers + 1 Formal letter; TCF = 3 short tasks.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Expression orale (Speaking)</td>
                <td className="py-3 px-3 text-rose-200 font-mono"><strong>310 – 348</strong> <span className="text-slate-400">/ 450</span> (Min: 310)</td>
                <td className="py-3 px-3 text-sky-200 font-mono"><strong>10 – 11</strong> <span className="text-slate-400">/ 20</span> (Min: 10)</td>
                <td className="py-3 px-3 text-slate-300">TEF = 5m Inquiry (Vous) + 10m Persuasion (Tu); TCF = 3 tasks.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Buttons for Templates */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Filter Templates:</span>
          {(['ALL', 'TEF_Canada', 'TCF_Canada'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSelectedExamFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedExamFilter === f
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {f === 'ALL' ? 'All Sections' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filteredTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setActiveSectionId(tpl.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                activeSectionId === tpl.id
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {tpl.title.split(':')[1]?.trim() || tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Selected Template Detail */}
      <div className="space-y-5">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {currentTemplate.examType.replace('_', ' ')}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">{currentTemplate.title}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentTemplate.objective}</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Time: {currentTemplate.timeLimitMinutes}m</span>
              {currentTemplate.wordCountTarget && <span>• {currentTemplate.wordCountTarget}</span>}
            </div>
          </div>

          {/* Sample Prompt */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">Official Style Prompt</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium italic">
              "{currentTemplate.samplePrompt}"
            </p>
          </div>

          {/* Formula */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
              Formulaic Structure (Follow this step-by-step)
            </h3>
            <div className="space-y-2">
              {currentTemplate.structuralFormula.map((step, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="font-mono text-sky-400 font-bold">Step {sIdx + 1}:</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connectors */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              Essential Connectors & Phrases
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTemplate.essentialConnectors.map((conn, cIdx) => (
                <div key={cIdx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-emerald-300 font-mono">{conn.french}</div>
                  <div className="text-[11px] text-slate-400">{conn.english}</div>
                  <div className="text-[11px] italic text-slate-300 pt-0.5 border-t border-slate-800">
                    "{conn.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Examiner-Approved Script Model
              </h3>
              <button
                onClick={() => handleCopyScript(currentTemplate.modelScriptSnippet, currentTemplate.id)}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
              >
                {copiedId === currentTemplate.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {currentTemplate.modelScriptSnippet}
            </pre>
          </div>
        </div>

        {/* Live Writing Sandbox */}
        {currentTemplate.section.includes('EE') && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PenTool className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Live Writing Sandbox & Word Counter</h3>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-slate-400">Word Count:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  wordCount >= 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  wordCount >= 80 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {wordCount} words
                </span>
              </div>
            </div>

            <textarea
              value={writingDraft}
              onChange={(e) => setWritingDraft(e.target.value)}
              placeholder="Draft your formal response in French here. Incorporate connectors, proper register, and varied past/subjunctive tenses..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono leading-relaxed"
            ></textarea>

            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="text-slate-500">Insert connector:</span>
              {currentTemplate.essentialConnectors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setWritingDraft(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + c.french + ' ')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-sky-300 border border-slate-700"
                >
                  +{c.french.split('...')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
