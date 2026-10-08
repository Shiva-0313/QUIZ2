import React from 'react';
import { Sparkles, Plus, BookOpen, Layers, Volume2, VolumeX } from 'lucide-react';
import { ScreenType } from '../types/quiz';
import { sounds } from '../utils/sound';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenWorkflow: () => void;
  totalQuizzesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenWorkflow,
  totalQuizzesCount,
}) => {
  const [muted, setMuted] = React.useState(!sounds.isEnabled());

  const handleToggleSound = () => {
    const isEnabled = sounds.toggleMute();
    setMuted(!isEnabled);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  QuizGen
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-indigo-200/60">
                  AI MVP
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentScreen === 'dashboard'
                ? 'bg-slate-100 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>My Quizzes ({totalQuizzesCount})</span>
          </button>

          <button
            onClick={onOpenWorkflow}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
            title="View the 9-Step UX Workflow methodology"
          >
            <Layers className="w-4 h-4 text-violet-500" />
            <span>9-Step UX Workflow</span>
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleToggleSound}
            aria-label={muted ? 'Unmute audio cues' : 'Mute audio cues'}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => onNavigate('add-material')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};
