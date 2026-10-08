import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowLeft,
  RotateCcw,
  Plus,
  HelpCircle,
  Filter
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types/quiz';

interface ReviewAnswersViewProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake: () => void;
  onCreateNew: () => void;
  onBackToDashboard: () => void;
}

export const ReviewAnswersView: React.FC<ReviewAnswersViewProps> = ({
  quiz,
  attempt,
  onRetake,
  onCreateNew,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  const questions = quiz.questions || [];
  const { answers, score, total } = attempt;
  const incorrectCount = total - score;

  const filteredQuestions = questions.filter((q) => {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Review Answers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {quiz.title} • Score: {score}/{total} ({attempt.percentage}%)
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRetake}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onCreateNew}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Questions ({total})
          </button>

          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            🔴 Incorrect ({incorrectCount})
          </button>

          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'correct'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            🟢 Correct ({score})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Showing {filteredQuestions.length} of {total}
        </span>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No questions match the current filter.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const originalIndex = questions.findIndex((item) => item.id === q.id);
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctIndex;
            const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-6 sm:p-7 shadow-xs space-y-4 transition-all ${
                  isCorrect
                    ? 'border-slate-200 hover:border-emerald-300'
                    : 'border-rose-200 bg-rose-50/15'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      Question {originalIndex + 1}
                    </span>

                    {/* Status Pill */}
                    {isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  {q.concept && (
                    <span className="text-[11px] font-medium text-slate-400">
                      Concept: {q.concept}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {q.question}
                </h3>

                {/* Options List with visual feedback matching wireframe */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isAnswerKey = q.correctIndex === optIdx;
                    const letter = optionLetters[optIdx] || String(optIdx + 1);

                    let itemStyle = 'border-slate-200 bg-white text-slate-700';
                    let badge = null;

                    if (isAnswerKey) {
                      // 🟢 Correct answer styling
                      itemStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500/30';
                      badge = (
                        <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct Answer</span>
                        </span>
                      );
                    } else if (isUserPick && !isCorrect) {
                      // 🔴 User's incorrect choice styling
                      itemStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 font-medium ring-1 ring-rose-400/30';
                      badge = (
                        <span className="text-xs font-bold text-rose-700 flex items-center space-x-1 shrink-0">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Your Answer</span>
                        </span>
                      );
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${itemStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isAnswerKey
                                ? 'bg-emerald-600 text-white'
                                : isUserPick && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        {badge}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box matching wireframe:
                    💡 Explanation
                    Why? Usability refers to how easily users can learn and effectively use an interface.
                */}
                <div className="mt-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-950 text-xs sm:text-sm space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Explanation</span>
                  </div>
                  <p className="leading-relaxed text-amber-900/90 pl-5.5">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          ← Return to Dashboard
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Retake Quiz
          </button>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            + Create New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
