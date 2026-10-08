import React from 'react';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Users, Brain, CheckCircle2, FileText, Zap, ShieldCheck } from 'lucide-react';
import { Quiz } from '../types/quiz';

interface LandingViewProps {
  onCreateQuiz: () => void;
  onTryDemo: (quiz: Quiz) => void;
  demoQuiz: Quiz;
  onOpenWorkflow: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onCreateQuiz,
  onTryDemo,
  demoQuiz,
  onOpenWorkflow,
}) => {
  return (
    <div className="space-y-14 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>UI/UX Design MVP • AI Quiz Generator</span>
        </div>

        {/* Headline requested by user */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Turn your study material into a quiz with AI.
        </h1>

        {/* Supporting message */}
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Upload notes, paste text, and generate a personalized quiz in seconds.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreateQuiz}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onTryDemo(demoQuiz)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Try Demo (UX Design Quiz)</span>
          </button>
        </div>

        {/* Value proofs */}
        <div className="flex items-center justify-center gap-6 pt-3 text-xs font-medium text-slate-500 flex-wrap">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No sign-up required</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>PDF, DOCX, TXT & Paste</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant explanations</span>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Tailored For Learning</h2>
          <p className="text-2xl font-bold text-slate-900">Designed for everyone who teaches or learns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Students */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Preparing for midterms or finals? Convert lecture slides and dense textbook chapters into active-recall flash quizzes to test memory retention.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Exam Preparation</span>
              <span>Active Recall →</span>
            </div>
          </div>

          {/* Teachers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-200 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Teachers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create weekly reading checks or formative classroom assessments in seconds, complete with pedagogically sound rationale for each distractor.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-violet-600 font-semibold">
              <span>Quick Assessments</span>
              <span>Save 3+ hrs/wk →</span>
            </div>
          </div>

          {/* Trainers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Corporate Trainers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turn SOPs, compliance handbooks, and onboarding decks into bite-sized knowledge checks that verify employee comprehension without manual friction.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold">
              <span>Knowledge Checks</span>
              <span>Instant Verification →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Simple Flow Banner */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Core MVP Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Input → AI Generation → Quiz → Results
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            No complicated prompt engineering required. Simply paste your notes, select question count and difficulty, and let QuizGen do the heavy lifting.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onCreateQuiz}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-indigo-900 hover:bg-indigo-50 shadow-sm transition-all cursor-pointer"
            >
              Get Started Now
            </button>
            <button
              onClick={onOpenWorkflow}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-800/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/50 transition-all cursor-pointer"
            >
              Explore UX Workflow
            </button>
          </div>
        </div>

        {/* Visual flow watermark */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col space-y-2 opacity-90">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-indigo-200 flex items-center space-x-3">
            <FileText className="w-4 h-4 text-indigo-300" />
            <span>1. Study Notes / Topic</span>
          </div>
          <div className="w-0.5 h-3 bg-indigo-500/50 ml-6" />
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-indigo-200 flex items-center space-x-3">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>2. AI Concept Synthesis</span>
          </div>
          <div className="w-0.5 h-3 bg-indigo-500/50 ml-6" />
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-indigo-200 flex items-center space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>3. Instant Quiz & Review</span>
          </div>
        </div>
      </section>
    </div>
  );
};
