import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Flame, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Info, 
  Calendar, 
  Share2, 
  Plus, 
  History, 
  Smartphone, 
  Check, 
  Layers,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '../types/preferences';
import { calculateEstimatedTargetDate } from '../engine/recommender';
import { completeTaskAndLog, appendBonusTasksInCloud, regenerateQueueInCloud } from '../engine/dataService';
import { DailyTask } from '../types/curriculum';

interface DailyMissionProps {
  activeProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DailyMission: React.FC<DailyMissionProps> = ({
  activeProfile,
  onProfileUpdate,
  onNavigateToTab
}) => {
  const targetInfo = calculateEstimatedTargetDate(
    activeProfile.currentMilestoneId,
    activeProfile.preferences.dailyTimeMinutes,
    activeProfile.preferences.targetExamDateMonths
  );

  // Active Timer State
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [copiedSyncLink, setCopiedSyncLink] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const taskQueue = activeProfile.activeTaskQueue || [];
  const totalLoggedHours = ((activeProfile.totalMinutesLogged || 0) / 60).toFixed(1);
  const targetHours = 800;
  const lifetimeProgressPercent = Math.min(100, Math.round(((activeProfile.totalMinutesLogged || 0) / (targetHours * 60)) * 100));

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (activeTimerTaskId) {
        handleCompleteTask(activeTimerTaskId);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining, activeTimerTaskId]);

  const handleStartTimer = (task: DailyTask) => {
    setActiveTimerTaskId(task.id);
    setTimerSecondsRemaining(task.durationMinutes * 60);
    setIsTimerRunning(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const updated = await completeTaskAndLog(activeProfile.id, taskId);
      if (updated) {
        onProfileUpdate(updated);
      }
    } catch (e) {
      console.error('Error completing task:', e);
    }
  };

  const handleLoadMoreTasks = async (minutes: number) => {
    setIsLoadingMore(true);
    try {
      const updated = await appendBonusTasksInCloud(activeProfile.id, minutes);
      if (updated) {
        onProfileUpdate(updated);
      }
    } catch (e) {
      console.error('Error adding bonus tasks', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRegenerateQueue = async () => {
    if (confirm('Regenerate your current rolling task queue with fresh items?')) {
      const updated = await regenerateQueueInCloud(activeProfile.id);
      if (updated) onProfileUpdate(updated);
    }
  };

  const handleCopySyncLink = () => {
    const syncUrl = `${window.location.origin}${window.location.pathname}?user=${activeProfile.id}`;
    navigator.clipboard.writeText(syncUrl);
    setCopiedSyncLink(true);
    setTimeout(() => setCopiedSyncLink(false), 3000);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const queueTotalMinutes = taskQueue.reduce((acc, t) => acc + t.durationMinutes, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* User Info & Live Queue Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                User: @{activeProfile.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeProfile.preferences.targetExam?.replace('_', ' ')} Focus
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Active Rolling Task Backlog
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Tasks stay queued until you complete them. Have extra time? Load more sprint modules anytime.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Lifetime Hours Counter */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 px-4 shadow-lg text-center min-w-[130px]">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Lifetime Study</div>
              <div className="text-lg font-extrabold text-emerald-400 font-mono">
                {totalLoggedHours}h <span className="text-xs text-slate-500 font-normal">/ {targetHours}h</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {lifetimeProgressPercent}% to B2 Target
              </div>
            </div>

            {/* Target Exam Date */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 px-4 shadow-lg text-center min-w-[130px]">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Target B2 Date</div>
              <div className="text-lg font-extrabold text-sky-400 font-mono">{targetInfo.targetDateFormatted}</div>
              <div className="text-[10px] text-slate-400 font-mono">~{targetInfo.monthsRemaining} mos remaining</div>
            </div>

          </div>
        </div>

        {/* Lifetime Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cumulative Hours Logged towards TEF B2: <strong className="text-white">{totalLoggedHours} hours</strong></span>
            </span>
            <span className="text-emerald-400 font-mono font-bold">{lifetimeProgressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(2, lifetimeProgressPercent)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sync & Multi-Device Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Smartphone className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Access on mobile with link: <code className="bg-slate-950 px-2 py-0.5 rounded text-sky-300 font-mono">?user={activeProfile.id}</code>
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleCopySyncLink}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-semibold transition"
          >
            {copiedSyncLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSyncLink ? 'Sync Link Copied!' : 'Copy Mobile Sync Link'}</span>
          </button>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Study Log ({(activeProfile.completedHistory || []).length})</span>
          </button>
        </div>
      </div>

      {/* Active Focus Floating Sprint Timer */}
      {activeTimerTaskId && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 to-slate-900 border border-indigo-500/40 flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Active Study Sprint</div>
              <div className="text-xs text-white font-medium truncate max-w-sm">
                {taskQueue.find(t => t.id === activeTimerTaskId)?.title}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-2xl font-black font-mono text-white tracking-widest bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800">
              {formatTimer(timerSecondsRemaining)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-indigo-500 text-slate-950 hover:bg-indigo-400 transition font-bold"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setActiveTimerTaskId(null);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Task Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Queued Study Tasks ({taskQueue.length} items • ~{queueTotalMinutes} mins)
            </h2>
          </div>

          {/* Load More Sprint Tasks Button for Overachievers */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleLoadMoreTasks(30)}
              disabled={isLoadingMore}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+30m Next Sprint</span>
            </button>

            <button
              onClick={() => handleLoadMoreTasks(60)}
              disabled={isLoadingMore}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+60m Deep Sprint</span>
            </button>

            <button
              onClick={handleRegenerateQueue}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Regenerate task batch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Cards */}
        {taskQueue.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">All Active Tasks Completed!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You've cleared your queue. Click below to pull the next curriculum modules from your roadmap.
            </p>
            <button
              onClick={() => handleLoadMoreTasks(60)}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              ⚡ Load Next Sprint Modules (+60m)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {taskQueue.map((task, index) => {
              const isCurrentTimer = activeTimerTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="relative rounded-2xl bg-slate-900/80 border border-slate-700/70 p-4 sm:p-5 transition-all glass-panel-hover shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Checkbox and Task Details */}
                    <div className="flex items-start space-x-3.5 flex-1">
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
                        title="Click to complete & log hours"
                      >
                        <Circle className="w-5 h-5 text-slate-500 hover:border-emerald-400 stroke-[2]" />
                      </button>

                      <div className="space-y-1.5 flex-1">
                        
                        {/* Action Title & Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-slate-500">0{index + 1}.</span>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {task.title}
                          </h3>
                          
                          {/* Skill Badge */}
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                            {task.skill}
                          </span>

                          {/* Shadowing Badge */}
                          {task.isShadowing && (
                            <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              <Mic className="w-3 h-3" />
                              <span>Active Shadowing</span>
                            </span>
                          )}
                        </div>

                        {/* Source Resource Subtitle */}
                        <div className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                          <span>Source:</span>
                          <span className="text-slate-300 font-semibold">{task.resourceTitle}</span>
                        </div>

                        {/* Instructions */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5">
                          {task.instructions}
                        </p>

                        {/* Tailored Indian Learner Note */}
                        {task.notesForIndianLearner && (
                          <div className="mt-2.5 flex items-start space-x-2 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-200 text-xs">
                            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                            <div className="leading-snug">
                              <strong className="text-sky-300">Linguistic Bridge:</strong> {task.notesForIndianLearner}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Actions: Duration, Timer, Open Resource */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>{task.durationMinutes}m</span>
                      </div>

                      <button
                        onClick={() => handleStartTimer(task)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          isCurrentTimer
                            ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Start timer for this task"
                      >
                        <Play className="w-3 h-3" />
                        <span className="hidden sm:inline">Timer</span>
                      </button>

                      {task.resourceUrl && (
                        <a
                          href={task.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity History Modal / Drawer */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Lifetime Study Session History</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [ESC]
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-3">
              {(activeProfile.completedHistory || []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  No completed tasks yet. Finish a task to log hours.
                </div>
              ) : (
                (activeProfile.completedHistory || []).map(entry => (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{entry.taskTitle}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {entry.resourceTitle} • <span className="text-sky-400">{entry.skill}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400 font-bold">+{entry.durationMinutes}m</span>
                      <div className="text-[10px] text-slate-500">{new Date(entry.completedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onNavigateToTab('bridges')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
        >
          <div className="text-xs font-semibold text-sky-400 flex items-center justify-between">
            <span>Linguistic Shortcuts</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Compare French with English, Spanish, Telugu, or Hindi.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('exam')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
        >
          <div className="text-xs font-semibold text-rose-400 flex items-center justify-between">
            <span>TEF / TCF Strategy Vault</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Official IRCC score tables, Section A/B speaking formulas.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('roadmap')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
        >
          <div className="text-xs font-semibold text-indigo-400 flex items-center justify-between">
            <span>CEFR A0 → B2 Pipeline</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Full 800-hour dependency tree, grammar checkpoints, and milestones.</p>
        </button>
      </div>

    </div>
  );
};
