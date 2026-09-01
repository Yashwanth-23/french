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
  AlertCircle, 
  Copy, 
  Check, 
  HelpCircle,
  ShieldAlert,
  Headphones,
  Scale
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
          <span>Canadian Express Entry Target: NCLC 7 / B2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          TEF Canada vs TCF Canada Strategy Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Master the exact structural differences, listening playback rules (Single-pass vs Double-pass), and scoring thresholds for Canada's approved French tests.
        </p>

        {/* Free Official Links & Mock Depth Truth Matrix */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          
          {/* TV5Monde */}
          <a
            href="https://apprendre.tv5monde.com/fr/tcf"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500 text-xs flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-indigo-400 transition">TV5Monde Simulator</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Deep Mock Bank</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Dozens of complete 40-question mock series developed with FEI.</p>
            </div>
            <div className="flex items-center space-x-1 text-indigo-400 font-medium text-[11px] mt-2 pt-2 border-t border-slate-800">
              <span>Launch Mock Engine</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          {/* RFI Savoirs TCF */}
          <a
            href="https://francaisfacile.rfi.fr/fr/enseigner/recherche/activite/entrainement-au-tcf"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 text-xs flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-emerald-400 transition">RFI Savoirs TCF Bank</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Deep Audio Bank</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Extensive graded audio practice sets with full answer sheets.</p>
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

      {/* TEF vs TCF Head-to-Head Architectural Comparison */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white">TEF Canada vs TCF Canada: The Critical Differences</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Exam Parameter</th>
                <th className="py-2.5 px-3 text-rose-300">TEF Canada (CCIP)</th>
                <th className="py-2.5 px-3 text-sky-300">TCF Canada (FEI)</th>
                <th className="py-2.5 px-3 text-amber-300">Impact on Your Practice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Listening (CO) Audio Playback</td>
                <td className="py-2.5 px-3 text-rose-200"><strong>Single-Pass Only:</strong> Every audio clip plays strictly once.</td>
                <td className="py-2.5 px-3 text-sky-200"><strong>Mixed Playback:</strong> Short items play once; longer conversations play twice.</td>
                <td className="py-2.5 px-3 text-amber-200">TEF requires immediate note-taking reflexes; TCF gives a safety pass on longer audio.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Expression Orale (Speaking)</td>
                <td className="py-2.5 px-3 text-rose-200"><strong>2 Sections:</strong> Sec A (Inquiry / Vous / 5m) + Sec B (Persuading friend / Tu / 10m).</td>
                <td className="py-2.5 px-3 text-sky-200"><strong>3 Tasks:</strong> Task 1 (Self Intro / 2m) + Task 2 (Inquiry / 3.5m) + Task 3 (Debate / 4.5m).</td>
                <td className="py-2.5 px-3 text-amber-200">TEF focuses on prolonged persuasion debate; TCF tests broad conversational range.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Expression Écrite (Writing)</td>
                <td className="py-2.5 px-3 text-rose-200"><strong>2 Sections:</strong> Sec A (Fait divers continuation ~100w) + Sec B (Formal letter ~220w).</td>
                <td className="py-2.5 px-3 text-sky-200"><strong>3 Tasks:</strong> Task 1 (Short message 60-120w) + Task 2 (Letter/story 120-150w) + Task 3 (Comparison essay 120-180w).</td>
                <td className="py-2.5 px-3 text-amber-200">TEF requires mastering the formal argumentative letter format; TCF requires speed across 3 tasks.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Target Score for NCLC 7 (Express Entry)</td>
                <td className="py-2.5 px-3 text-rose-200">CO: 248+ / CE: 248+ / EO: 310+ / EE: 310+</td>
                <td className="py-2.5 px-3 text-sky-200">CO: 458-502 / CE: 453-499 / EO: 10-11 / EE: 10-11</td>
                <td className="py-2.5 px-3 text-amber-200">Both equate to standard CEFR B2 proficiency.</td>
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
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">Official Sample Prompt</span>
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
