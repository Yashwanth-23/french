import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import diagnosticQuestions from '../data/diagnostic.json';
import { CEFRLevel } from '../types/curriculum';

interface DiagnosticQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrationComplete: (level: CEFRLevel) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  isOpen,
  onClose,
  onCalibrationComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const questions = diagnosticQuestions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScoreAndLevel = (): { score: number; level: CEFRLevel } => {
    let totalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        totalScore += 10;
      }
    });

    let diagnosedLevel: CEFRLevel = 'A0';
    if (totalScore >= 70) diagnosedLevel = 'B2';
    else if (totalScore >= 50) diagnosedLevel = 'B1';
    else if (totalScore >= 30) diagnosedLevel = 'A2';
    else if (totalScore >= 15) diagnosedLevel = 'A1';

    return { score: totalScore, level: diagnosedLevel };
  };

  const handleApplyResult = () => {
    const { level } = calculateScoreAndLevel();
    onCalibrationComplete(level);
    onClose();
  };

  const { score, level } = calculateScoreAndLevel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">CEFR Level Diagnostic</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-amber-400">Target Level: {currentQ.level}</span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">
                {currentQ.question}
              </h4>

              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-40"
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">Diagnostic Result</div>
                <div className="text-3xl font-black text-white mt-1 font-mono">Calibrated Level: {level}</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">Raw Score: {score} / 80 points</div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your study roadmap and daily backlog can be calibrated to start from <strong>{level}</strong>.
              </p>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={handleApplyResult}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
                >
                  Apply {level} to My Roadmap
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
