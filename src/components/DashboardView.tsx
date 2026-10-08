import React, { useState } from 'react';
import {
  Plus,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Share2,
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  Search,
  Award
} from 'lucide-react';
import { Quiz } from '../types/quiz';

interface DashboardViewProps {
  quizzes: Quiz[];
  onCreateNewQuiz: () => void;
  onTakeQuiz: (quiz: Quiz) => void;
  onReviewQuiz: (quiz: Quiz) => void;
  onManageQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onShareQuiz: (quiz: Quiz) => void;
  onQuickLoadTopic: (topic: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quizzes,
  onCreateNewQuiz,
  onTakeQuiz,
  onReviewQuiz,
  onManageQuiz,
  onDeleteQuiz,
  onShareQuiz,
  onQuickLoadTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuQuizId, setActiveMenuQuizId] = useState<string | null>(null);

  // Time-based friendly greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 👋';
    if (hour < 18) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 py-2">
      {/* Welcome Banner matching wireframe */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-1.5 font-normal">
            What would you like to learn today?
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onCreateNewQuiz}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Quiz</span>
            </button>

            <button
              onClick={() => onQuickLoadTopic('UX Design')}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Explore UX Design</span>
            </button>

            <button
              onClick={() => onQuickLoadTopic('Biology')}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Explore Biology</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="hidden md:block absolute -right-12 -bottom-12 w-56 h-56 bg-indigo-100/60 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Input Launcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onCreateNewQuiz}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex items-start space-x-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
              Upload File
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">PDF, DOCX, PPTX slides, or TXT notes</p>
          </div>
        </div>

        <div
          onClick={onCreateNewQuiz}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer group flex items-start space-x-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors text-sm">
              Paste Text
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Drop raw study notes, summaries, or articles</p>
          </div>
        </div>

        <div
          onClick={onCreateNewQuiz}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer group flex items-start space-x-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors text-sm">
              Enter Topic
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Generate questions directly on any subject</p>
          </div>
        </div>
      </div>

      {/* Recent Quizzes Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Quizzes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review prior performances, retake practice tests, or modify questions
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Quizzes Grid matching wireframe cards (e.g. Biology, UX Design) */}
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800">No quizzes found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search query' : 'Create your first quiz from study materials in seconds.'}
            </p>
            <button
              onClick={onCreateNewQuiz}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              + Create Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => {
              const score = quiz.lastScore ?? quiz.bestScore;
              const hasAttempted = typeof score === 'number';

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Top Row: Category tag + Score Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                        {quiz.topic}
                      </span>

                      {/* Prominent score badge as requested in wireframe: "82%", "90%" */}
                      {hasAttempted ? (
                        <div
                          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            score >= 80
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : score >= 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/70'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          }`}
                          title={`Last score: ${score}%`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{score}%</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Not started
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {quiz.title}
                    </h3>

                    {/* Meta info matching wireframe: "10 Questions" */}
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2 font-medium">
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{quiz.questions.length} Questions</span>
                      </span>
                      <span>•</span>
                      <span>{quiz.config?.difficulty || 'Medium'}</span>
                    </div>

                    {quiz.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {quiz.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onTakeQuiz(quiz)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{hasAttempted ? 'Retake' : 'Start'}</span>
                      </button>

                      {hasAttempted && (
                        <button
                          onClick={() => onReviewQuiz(quiz)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <span>Review</span>
                        </button>
                      )}
                    </div>

                    {/* Context menu for Edit, Share, Delete */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuQuizId(activeMenuQuizId === quiz.id ? null : quiz.id)
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuQuizId === quiz.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-xs animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              setActiveMenuQuizId(null);
                              onManageQuiz(quiz);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Questions</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuQuizId(null);
                              onShareQuiz(quiz);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Share / Export</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuQuizId(null);
                              if (confirm(`Delete "${quiz.title}"?`)) {
                                onDeleteQuiz(quiz.id);
                              }
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center space-x-2 text-rose-600 border-t border-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete Quiz</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
