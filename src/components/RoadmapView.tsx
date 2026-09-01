import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock
} from 'lucide-react';
import milestonesData from '../data/milestones.json';
import { Milestone } from '../types/curriculum';
import { UserProfile } from '../types/preferences';
import { saveProfileToCloud } from '../engine/dataService';

interface RoadmapViewProps {
  activeProfile: UserProfile | null;
  onProfileUpdate: () => void;
  onOpenResource: (resourceId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  activeProfile,
  onProfileUpdate
}) => {
  const milestones = milestonesData as Milestone[];
  const currentMilestoneId = activeProfile?.currentMilestoneId || 'milestone-a0';
  const completedMilestoneIds = activeProfile?.completedMilestoneIds || [];

  const handleSelectMilestone = async (milestoneId: string) => {
    if (!activeProfile) return;
    const updated: UserProfile = {
      ...activeProfile,
      currentMilestoneId: milestoneId
    };
    await saveProfileToCloud(updated);
    onProfileUpdate();
  };

  const handleToggleCompleteMilestone = async (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProfile) return;
    const isCompleted = completedMilestoneIds.includes(milestoneId);
    const nextCompleted = isCompleted
      ? completedMilestoneIds.filter(id => id !== milestoneId)
      : [...completedMilestoneIds, milestoneId];

    const updated: UserProfile = {
      ...activeProfile,
      completedMilestoneIds: nextCompleted
    };
    await saveProfileToCloud(updated);
    onProfileUpdate();
  };

  const totalHours = milestones.reduce((sum, m) => sum + m.targetHoursFloor, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-sky-950/60 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Pedagogical Framework
            </span>
            <span className="text-xs text-slate-400 font-mono">~{totalHours} Total Hours Floor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            CEFR A0 → B2 Master Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Designed for non-Romance native speakers. Click any phase card to calibrate your active milestone.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 px-4 shadow-lg text-center">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Milestones Done</div>
            <div className="text-xl font-extrabold text-indigo-400 font-mono">
              {completedMilestoneIds.length} / {milestones.length}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Tree */}
      <div className="space-y-4">
        {milestones.map((m, idx) => {
          const isCurrent = m.id === currentMilestoneId;
          const isDone = completedMilestoneIds.includes(m.id);

          return (
            <div
              key={m.id}
              onClick={() => handleSelectMilestone(m.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-md ${
                isCurrent
                  ? 'bg-slate-900/95 border-sky-500 shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 opacity-80'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={(e) => handleToggleCompleteMilestone(m.id, e)}
                    className="mt-1 text-slate-500 hover:text-emerald-400 transition"
                    title={isDone ? 'Mark milestone incomplete' : 'Mark milestone completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">0{idx + 1}.</span>
                      <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                        {m.level}
                      </span>
                      <h3 className="text-base font-bold text-white">{m.phaseLabel}</h3>

                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          Active Phase
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.description}
                    </p>

                    {/* Checkpoints */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[11px] font-bold text-sky-400 mb-1">Grammar Pillars</div>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {m.grammarKeypoints.map((g: string, i: number) => (
                            <li key={i} className="flex items-center space-x-1.5">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[11px] font-bold text-emerald-400 mb-1">Active Output Requirements</div>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {m.activeRequirements.map((req: string, rIdx: number) => (
                            <li key={rIdx} className="flex items-center space-x-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-white font-bold">~{m.targetHoursFloor}h</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Non-Romance floor</div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
