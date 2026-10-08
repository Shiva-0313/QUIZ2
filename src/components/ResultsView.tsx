import React, { useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  ArrowRight,
  Share2,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types/quiz';

interface ResultsViewProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onReviewAnswers: () => void;
  onTryAgain: () => void;
  onCreateNewQuiz: () => void;
  onGoToDashboard: () => void;
  onShareQuiz: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quiz,
  attempt,
  onReviewAnswers,
  onTryAgain,
  onCreateNewQuiz,
  onGoToDashboard,
  onShareQuiz,
}) => {
  const { score, total, percentage, timeSeconds } = attempt;
  const incorrectCount = total - score;

  // Format time MM:SS
  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Qualitative feedback headline
  const getFeedbackMessage = () => {
    if (percentage >= 90) return 'Exceptional mastery! 🌟';
    if (percentage >= 80) return 'Excellent work! 👏';
    if (percentage >= 70) return 'Great effort! Keep it up! 👍';
    if (percentage >= 50) return 'Solid foundation, review missed concepts! 📚';
    return 'Good practice run. Review explanations to improve! 💪';
  };

  // Canvas confetti on high score
  useEffect(() => {
    if (percentage >= 70) {
      const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{
        x: number;
        y: number;
        size: number;
        color: string;
        vx: number;
        vy: number;
        rotation: number;
        vRot: number;
      }> = [];

      const colors = ['#6366F1', '#8B5CF6', '#10B981', '#38BDF8', '#F59E0B', '#EC4899'];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: canvas.height * 0.35 + (Math.random() - 0.5) * 50,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * -6 - 2,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
        });
      }

      let animationFrame: number;
      let opacity = 1;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // gravity
          p.rotation += p.vRot;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        });

        opacity -= 0.007;
        if (opacity > 0) {
          animationFrame = requestAnimationFrame(render);
        }
      };

      render();
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [percentage]);

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6 relative">
      <canvas
        id="confetti-canvas"
        className="fixed inset-0 pointer-events-none z-40 w-full h-full"
      />

      {/* Main Results Card matching wireframe */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm text-center space-y-8 relative z-10">
        {/* Celebration header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-2xl font-black text-slate-900 tracking-tight">
            <span>🎉</span>
            <span>Quiz Complete!</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {quiz.title} • {quiz.topic}
          </p>
        </div>

        {/* Large Score Counter matching wireframe:
               8 / 10
                80%
        */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-slate-50 border border-indigo-100 max-w-xs mx-auto space-y-2">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            <span className="text-indigo-600">{score}</span>
            <span className="text-slate-400 text-3xl font-light"> / </span>
            <span>{total}</span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">
            {percentage}%
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-indigo-200 text-indigo-700 shadow-xs">
            {getFeedbackMessage()}
          </div>
        </div>

        {/* Metric summary rows matching wireframe:
            Correct answers     8
            Incorrect answers   2
            Time                04:32
        */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Correct answers</span>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">
              {score}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-600">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Incorrect answers</span>
            </div>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 font-mono">
              {incorrectCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Time taken</span>
            </div>
            <span className="font-bold text-slate-800 font-mono">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Actions matching wireframe:
            [ Review Answers ]
            [ Try Again ]     [ Create New Quiz ]
        */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onReviewAnswers}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Review Answers</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onTryAgain}
              className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Try Again</span>
            </button>

            <button
              onClick={onCreateNewQuiz}
              className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Create New Quiz</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-4 text-xs">
            <button
              onClick={onGoToDashboard}
              className="text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <span>•</span>
            <button
              onClick={onShareQuiz}
              className="text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Score</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
