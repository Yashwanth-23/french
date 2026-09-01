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
  Sparkles, 
  Zap,
  Info,
  Calendar
} from 'lucide-react';
import { UserProfile } from '../types/preferences';
import { generateDailyPlan, calculateEstimatedTargetDate } from '../engine/recommender';
import { updateActiveProfile } from '../engine/storage';
import { DailyTask } from '../types/curriculum';

interface DailyMissionProps {
  activeProfile: UserProfile;
  onProfileUpdate: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const DailyMission: React.FC<DailyMissionProps> = ({
  activeProfile,
  onProfileUpdate,
  onNavigateToTab
}) => {
  const plan = generateDailyPlan(activeProfile);
  const targetInfo = calculateEstimatedTargetDate(
    activeProfile.currentMilestoneId,
    activeProfile.preferences.dailyTimeMinutes
  );

  // Timer State for active task
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play a subtle alert or alert user
      if (activeTimerTaskId) {
        handleToggleTask(activeTimerTaskId);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining, activeTimerTaskId]);

  const handleStartTimer = (task: DailyTask) => {
    setActiveTimerTaskId(task.id);
    setTimerSecondsRemaining(task.durationMinutes * 60);
    setIsTimerRunning(true);
  };

  const handleToggleTask = (taskId: string) => {
    updateActiveProfile(prev => {
      const currentDone = prev.completedTaskIdsForToday || [];
      const isAlreadyDone = currentDone.includes(taskId);
      const nextDone = isAlreadyDone
        ? currentDone.filter(id => id !== taskId)
        : [...currentDone, taskId];

      // If all tasks done, increment streak
      let nextStreak = prev.streakDays;
      if (nextDone.length === plan.tasks.length && !isAlreadyDone) {
        nextStreak += 1;
      }

      return {
        ...prev,
        completedTaskIdsForToday: nextDone,
        streakDays: nextStreak
      };
    });
    onProfileUpdate();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedCount = (activeProfile.completedTaskIdsForToday || []).length;
  const progressPercent = Math.min(100, Math.round((completedCount / plan.tasks.length) * 100));

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Target Exam Tracker */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {plan.phaseSummary}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeProfile.preferences.dailyTimeMinutes} min/day allocation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Today's Tailored Mission
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Sequenced by your format preferences ({activeProfile.preferences.preferredFormats.join(', ')}) with enforced active output minimums.
            </p>
          </div>

          {/* Exam Target Metric Card */}
          <div className="flex items-center space-x-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 shadow-lg">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Target B2 Date</div>
              <div className="text-lg font-bold text-sky-400 font-mono">{targetInfo.targetDateFormatted}</div>
              <div className="text-[10px] text-slate-500 font-mono">~{targetInfo.monthsRemaining} mos remaining</div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Active Output Ratio</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{plan.activeOutputPercentage}%</div>
              <div className="text-[10px] text-slate-500 font-mono">Anti-passive barrier</div>
            </div>
          </div>
        </div>

        {/* Daily Completion Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-300">
              Daily Completion: <strong className="text-white">{completedCount} of {plan.tasks.length} tasks done</strong>
            </span>
            <span className="text-sky-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Focus Floating Timer (if running) */}
      {activeTimerTaskId && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Active Sprint Timer</div>
              <div className="text-xs text-slate-300 font-medium truncate max-w-sm">
                {plan.tasks.find(t => t.id === activeTimerTaskId)?.title}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-2xl font-black font-mono text-white tracking-widest bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              {formatTimer(timerSecondsRemaining)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-lg bg-indigo-500 text-slate-950 hover:bg-indigo-400 transition font-bold"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setActiveTimerTaskId(null);
              }}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Today's Task Sequence ({plan.totalMinutes} min total)</span>
          </h2>
          <span className="text-xs text-slate-400">Checked items save automatically to your streak</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {plan.tasks.map((task, index) => {
            const isCompleted = (activeProfile.completedTaskIdsForToday || []).includes(task.id);
            const isCurrentTimer = activeTimerTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`relative rounded-xl border p-4 sm:p-5 transition-all glass-panel-hover ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800 opacity-70'
                    : 'bg-slate-900/80 border-slate-700/70 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Checkbox and Title */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-sky-400 transition"
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20 stroke-[2.5]" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:border-sky-400 stroke-[2]" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">0{index + 1}.</span>
                        <h3 className={`text-sm sm:text-base font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
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

                      {/* Instructions */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5">
                        {task.instructions}
                      </p>

                      {/* Indian Learner Linguistic Bridge Note */}
                      {task.notesForIndianLearner && (
                        <div className="mt-2.5 flex items-start space-x-2 p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-sky-200 text-xs">
                          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                          <div className="leading-snug">
                            <strong className="text-sky-300">Indian Learner Bridge:</strong> {task.notesForIndianLearner}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Launch Resource & Start Timer */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>{task.durationMinutes}m</span>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleStartTimer(task)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                          isCurrentTimer
                            ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Start timer for this task"
                      >
                        <Play className="w-3 h-3" />
                        <span className="hidden sm:inline">Timer</span>
                      </button>
                    )}

                    {task.resourceUrl && (
                      <a
                        href={task.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition"
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
      </div>

      {/* Quick Access Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onNavigateToTab('bridges')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
        >
          <div className="text-xs font-semibold text-sky-400 flex items-center justify-between">
            <span>Indian Language Shortcuts</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Hindi gender mapping, Tu/Vous vs Tu/Aap, Nasal vowel rules.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('exam')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
        >
          <div className="text-xs font-semibold text-rose-400 flex items-center justify-between">
            <span>TEF / TCF Strategy Vault</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Official FEI/CCIP sample papers, Section A/B speaking formulas.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('roadmap')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group"
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
