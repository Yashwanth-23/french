import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, X } from 'lucide-react';
import diagnosticQuestions from '../data/diagnostic.json';
import { DiagnosticQuestion, CEFRLevel } from '../types/curriculum';
import { updateActiveProfile } from '../engine/storage';

interface DiagnosticQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrationComplete: (calibratedLevel: CEFRLevel) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  isOpen,
  onClose,
  onCalibrationComplete
}) => {
  const questions = diagnosticQuestions as DiagnosticQuestion[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const answeredCount = selectedAnswers.filter(a => a !== -1).length;

  const handleSelectOption = (optIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const calculateScoreAndLevel = (): { score: number; level: CEFRLevel; label: string } => {
    let score = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctIndex) score++;
    });

    let level: CEFRLevel = 'A0';
    let label = 'Phase 0: Phonetic Foundation (True Beginner)';

    if (score >= 7) {
      level = 'B2';
      label = 'Phase 4: B2 TEF/TCF Exam Precision Track';
    } else if (score >= 5) {
      level = 'B1';
      label = 'Phase 3: B1 Independent Fluency & News Auditory Parsing';
    } else if (score >= 3) {
      level = 'A2';
      label = 'Phase 2: A2 Narrative & Vocal Shadowing Track';
    } else if (score >= 1) {
      level = 'A1';
      label = 'Phase 1: A1 Grammar Foundations & Lexicon';
    }

    return { score, level, label };
  };

  const handleApplyCalibration = () => {
    const { level, score } = calculateScoreAndLevel();
    updateActiveProfile(prev => ({
      ...prev,
      currentMilestoneId: `milestone-${level.toLowerCase()}`,
      diagnosticScore: score
    }));
    onCalibrationComplete(level);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">CEFR Level Diagnostic & Calibration</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-5">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-sky-400">
                  Target: {currentQ.level} ({currentQ.skill})
                </span>
              </div>

              {/* Question */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-sm font-medium text-slate-100 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isChosen = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition ${
                        isChosen
                          ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-mono text-slate-500 mr-2">[{String.fromCharCode(65 + optIdx)}]</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentIndex] === -1}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold disabled:opacity-40 transition"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Finish & Evaluate' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-5 text-center">
              {(() => {
                const { score, level, label } = calculateScoreAndLevel();
                return (
                  <>
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-xl">
                      {level}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">Diagnostic Score: {score} / {questions.length}</h3>
                      <p className="text-xs text-sky-400 font-medium mt-1">{label}</p>
                    </div>

                    <p className="text-xs text-slate-400 text-left bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                      Based on your grammar and phonetic answers, we recommend starting your active roadmap at <strong className="text-white">{level}</strong>. 
                      This prevents wasting time on beginner material if you already understand core conjugation rules, while ensuring no foundational gaps are skipped.
                    </p>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => {
                          setSelectedAnswers(new Array(questions.length).fill(-1));
                          setCurrentIndex(0);
                          setIsFinished(false);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>

                      <button
                        onClick={handleApplyCalibration}
                        className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-sky-500/20"
                      >
                        Apply Level to My Plan
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
