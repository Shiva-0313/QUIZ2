import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Timer,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  X,
  ListFilter,
  Hourglass,
  Plus
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types/quiz';
import { sounds } from '../utils/sound';

interface QuizScreenViewProps {
  quiz: Quiz;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const QuizScreenView: React.FC<QuizScreenViewProps> = ({
  quiz,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // Total session countdown allocation (e.g. 60 seconds per question, min 180s)
  const initialTotalSeconds = Math.max(180, totalQuestions * 60);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(initialTotalSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(initialTotalSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimeUpModal, setIsTimeUpModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);

  // Keep a ref to answers for auto-submit when timer expires
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Real-time Countdown Timer effect
  useEffect(() => {
    if (isTimerPaused || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerPaused, secondsRemaining]);

  // Handle countdown expiration
  const handleTimeExpired = () => {
    setIsTimeUpModal(true);
    sounds.playComplete();
    setTimeout(() => {
      submitQuiz(totalSessionSeconds);
    }, 1800);
  };

  // Quick button to add +1 minute if user needs more time
  const handleAddExtraMinute = () => {
    setSecondsRemaining((s) => s + 60);
    setTotalSessionSeconds((t) => t + 60);
  };

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    sounds.playSelect();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  // Keyboard navigation support: A/B/C/D or 1/2/3/4 and Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key) - 1;
        if (currentQuestion?.options[idx] !== undefined) {
          handleSelectOption(idx);
        }
      } else if (key === 'A') {
        if (currentQuestion?.options[0] !== undefined) handleSelectOption(0);
      } else if (key === 'B') {
        if (currentQuestion?.options[1] !== undefined) handleSelectOption(1);
      } else if (key === 'C') {
        if (currentQuestion?.options[2] !== undefined) handleSelectOption(2);
      } else if (key === 'D') {
        if (currentQuestion?.options[3] !== undefined) handleSelectOption(3);
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion]);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Time remaining states for UI styling
  const isWarning = secondsRemaining <= 60 && secondsRemaining > 20;
  const isCritical = secondsRemaining <= 20 && secondsRemaining > 0;
  const timePercentRemaining = Math.max(0, Math.min(100, Math.round((secondsRemaining / totalSessionSeconds) * 100)));

  const submitQuiz = (elapsedSecondsTotal: number) => {
    const currentAns = answersRef.current;
    let correctCount = 0;
    questions.forEach((q) => {
      if (currentAns[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: quiz.id,
      date: new Date().toISOString(),
      answers: currentAns,
      score: correctCount,
      total: totalQuestions,
      percentage,
      timeSeconds: Math.max(1, elapsedSecondsTotal),
    };

    sounds.playComplete();
    onFinishQuiz(attempt);
  };

  const handleSubmit = () => {
    const timeSpent = totalSessionSeconds - secondsRemaining;
    submitQuiz(timeSpent);
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No questions available in this quiz.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const selectedAnswer = answers[currentQuestion.id];
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top Bar: Title, Real-time Countdown Timer, Question Palette Button, Exit */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Exit quiz"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
              {quiz.title}
            </h2>
            <span className="text-[11px] font-medium text-slate-500">
              {quiz.topic} • {quiz.config?.difficulty || 'Medium'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Real-time Countdown Timer Widget */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
              isCritical
                ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-500/20 animate-pulse'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-800 shadow-xs'
            }`}
            title="Time remaining for this quiz session"
          >
            <div className="flex items-center space-x-1.5">
              {isCritical ? (
                <Hourglass className="w-4 h-4 text-rose-600 animate-spin" />
              ) : isWarning ? (
                <Timer className="w-4 h-4 text-amber-600" />
              ) : (
                <Clock className="w-4 h-4 text-indigo-600" />
              )}
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold tracking-wider leading-none text-slate-400">
                  {isCritical ? 'Ending Soon' : 'Time Left'}
                </div>
                <div className="text-sm font-mono font-black tracking-tight leading-tight">
                  {formatTime(secondsRemaining)}
                </div>
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex items-center space-x-1 pl-1 border-l border-slate-200/80">
              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                title={isTimerPaused ? 'Resume countdown' : 'Pause countdown'}
              >
                {isTimerPaused ? (
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={handleAddExtraMinute}
                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer text-[10px] font-bold"
                title="Add 1 extra minute"
              >
                +1m
              </button>
            </div>
          </div>

          {/* Palette button */}
          <button
            onClick={() => setShowQuestionPalette(!showQuestionPalette)}
            className="p-2 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            title="View all questions"
          >
            <ListFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown Visual Indicator Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden -mt-3">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${timePercentRemaining}%` }}
        />
      </div>

      {/* Question Palette Drawer (Collapsible) */}
      {showQuestionPalette && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Question Navigator ({answeredCount}/{totalQuestions} answered)
            </span>
            <button
              onClick={() => setShowQuestionPalette(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowQuestionPalette(false);
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Single-Question Card (Matching wireframe layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Wireframe step: "Question 3 of 10" */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          {currentQuestion.concept && (
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Concept: {currentQuestion.concept}
            </span>
          )}
        </div>

        {/* Question Text */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h1>
          <p className="text-xs text-slate-400">
            Choose the best answer below. Press A, B, C, D or 1–4 on your keyboard.
          </p>
        </div>

        {/* Options list matching wireframe:
            ○ A. Accessibility
            ○ B. Usability
            ○ C. Branding
            ○ D. Animation
        */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === optIdx;
            const letter = optionLabels[optIdx] || String(optIdx + 1);

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-950 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Circular radio indicator matching prompt: ○ / ● */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:text-slate-900">
                    {letter}
                  </span>

                  <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions & Navigation matching wireframe */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Quiz 🎉</span>
            </button>
          )}
        </div>

        {/* Progress bar matching wireframe: ████████████░░░░░░ 30% */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {answeredCount} of {totalQuestions} answered
            </span>
            <span className="font-bold text-indigo-600">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Time Expired Notification Modal */}
      {isTimeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-100">
              <Hourglass className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">⏰ Time's Up!</h3>
              <p className="text-xs text-slate-500 mt-1.5">
                The session countdown has ended. Submitting your current answers automatically...
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-600 h-full rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Leave Quiz?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your progress for this session will not be saved if you leave now.
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Keep Going
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

