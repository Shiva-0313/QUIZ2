import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Sliders, Globe, Layers, HelpCircle, Check } from 'lucide-react';
import { Difficulty, QuestionType, QuizConfig } from '../types/quiz';

interface ConfigureQuizViewProps {
  topic: string;
  materialType: 'file' | 'text' | 'topic';
  onGenerate: (config: QuizConfig) => void;
  onBack: () => void;
}

export const ConfigureQuizView: React.FC<ConfigureQuizViewProps> = ({
  topic,
  materialType,
  onGenerate,
  onBack,
}) => {
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionType, setQuestionType] = useState<QuestionType>('MCQ');
  const [topicFocus, setTopicFocus] = useState('');
  const [language, setLanguage] = useState('English');

  const handleGenerate = () => {
    onGenerate({
      numQuestions,
      difficulty,
      questionType,
      topicFocus: topicFocus.trim() || undefined,
      language,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Material</span>
        </button>

        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
          Step 2 of 2: Quiz Preferences
        </span>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-7">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Configure Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quiz Preferences</h1>
          <p className="text-xs text-slate-500 mt-1">
            Targeting: <strong className="text-slate-800 font-semibold">{topic || 'Your Material'}</strong>
          </p>
        </div>

        {/* 1. Number of Questions: 5 / 10 / 15 / 20 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[5, 10, 15, 20].map((num) => {
              const active = numQuestions === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base block">{num}</span>
                  <span className="text-[10px] font-normal text-slate-500">Questions</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty: Easy / Medium / Hard */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { level: 'Easy' as Difficulty, label: 'Easy', sub: 'Foundations & definitions' },
              { level: 'Medium' as Difficulty, label: 'Medium', sub: 'Application & concepts' },
              { level: 'Hard' as Difficulty, label: 'Hard', sub: 'Analysis & edge cases' },
            ].map(({ level, label, sub }) => {
              const active = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Question Type: MCQ / True-False / Mixed */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Question Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { type: 'MCQ' as QuestionType, title: 'MCQ', desc: 'Multiple Choice (4 options)' },
              { type: 'True-False' as QuestionType, title: 'True / False', desc: 'Binary checks' },
              { type: 'Mixed' as QuestionType, title: 'Mixed', desc: 'Combined formats' },
            ].map(({ type, title, desc }) => {
              const active = questionType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionType(type)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{title}</span>
                    {active && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Topic Focus & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Topic Focus (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Heuristics, formulas, key dates"
              value={topicFocus}
              onChange={(e) => setTopicFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Guides question generation to focus on specific sub-areas
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Mandarin">Mandarin (中文)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Questions and explanations will be generated in this language
            </span>
          </div>
        </div>

        {/* Primary CTA: ✨ Generate Quiz */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>Ready: </span>
            <strong className="text-slate-800 font-semibold">{numQuestions} {difficulty} {questionType} questions</strong>
          </div>

          <button
            onClick={handleGenerate}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
