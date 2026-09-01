import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Clock, 
  Award, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import milestonesData from '../data/milestones.json';
import { Milestone, CEFRLevel } from '../types/curriculum';
import { UserProfile } from '../types/preferences';
import { updateActiveProfile } from '../engine/storage';

interface RoadmapViewProps {
  activeProfile: UserProfile;
  onProfileUpdate: () => void;
  onOpenResource: (resourceId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  activeProfile,
  onProfileUpdate,
  onOpenResource
}) => {
  const milestones = milestonesData as Milestone[];
  const currentMilestoneIndex = milestones.findIndex(m => m.id === activeProfile.currentMilestoneId);

  const handleSetCurrentMilestone = (milestoneId: string) => {
    updateActiveProfile(prev => ({
      ...prev,
      currentMilestoneId: milestoneId
    }));
    onProfileUpdate();
  };

  const handleToggleCompleted = (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateActiveProfile(prev => {
      const completed = prev.completedMilestoneIds || [];
      const nextCompleted = completed.includes(milestoneId)
        ? completed.filter(id => id !== milestoneId)
        : [...completed, milestoneId];
      return {
        ...prev,
        completedMilestoneIds: nextCompleted
      };
    });
    onProfileUpdate();
  };

  const totalCurriculumHours = milestones.reduce((sum, m) => sum + m.targetHoursFloor, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Mastery Pipeline
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total Hours Floor: ~{totalCurriculumHours} Hours
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            CEFR Progression Map (A0 → B2 TEF Canada)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Each milestone sets explicit grammatical and active production thresholds. Click any phase to set it as your active plan.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></div>
          <span>Active Phase: <strong className="text-white">{milestones[currentMilestoneIndex]?.level}</strong></span>
        </div>
      </div>

      {/* Roadmap Tree */}
      <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:left-6 sm:before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
        {milestones.map((milestone, idx) => {
          const isCurrent = milestone.id === activeProfile.currentMilestoneId;
          const isCompleted = (activeProfile.completedMilestoneIds || []).includes(milestone.id);
          const isUnlocked = idx <= currentMilestoneIndex || isCompleted;

          return (
            <div
              key={milestone.id}
              onClick={() => handleSetCurrentMilestone(milestone.id)}
              className={`relative rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-slate-900/90 border-sky-500 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : isCompleted
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Timeline Marker Node */}
              <div
                className={`absolute -left-7 sm:-left-11 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : isCurrent
                    ? 'bg-sky-500 border-sky-300 text-slate-950 shadow-md shadow-sky-500/50'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-bold font-mono">{idx}</span>
                )}
              </div>

              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                    isCurrent ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {milestone.level}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {milestone.title}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">{milestone.phaseLabel}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{milestone.targetHoursFloor}h target</span>
                  </div>

                  <button
                    onClick={(e) => handleToggleCompleted(milestone.id, e)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isCompleted ? 'Completed ✓' : 'Mark Done'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {milestone.description}
              </p>

              {/* Key Grammar Points & Active Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800/80">
                
                {/* Grammar Checkpoints */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Core Grammar Pillars</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {milestone.grammarKeypoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Active Requirements */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Active Output Benchmarks</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {milestone.activeRequirements.map((req, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Active Milestone Indicator */}
              {isCurrent && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-sky-400 font-medium">
                  <span>Current Active Curriculum Focus</span>
                  <span className="flex items-center space-x-1">
                    <span>Generated Daily in "Today's Mission"</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
