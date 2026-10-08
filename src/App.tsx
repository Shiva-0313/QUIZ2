import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AddMaterialView } from './components/AddMaterialView';
import { ConfigureQuizView } from './components/ConfigureQuizView';
import { AIGeneratingView } from './components/AIGeneratingView';
import { QuizScreenView } from './components/QuizScreenView';
import { ResultsView } from './components/ResultsView';
import { ReviewAnswersView } from './components/ReviewAnswersView';
import { QuizManagementView } from './components/QuizManagementView';
import { UXWorkflowModal } from './components/UXWorkflowModal';
import { INITIAL_QUIZZES } from './data/defaultQuizzes';
import { Quiz, QuizAttempt, QuizConfig, ScreenType } from './types/quiz';

const STORAGE_KEY = 'quizgen_quizzes_v1';

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_QUIZZES;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(
    quizzes[0]?.lastAttempt || null
  );

  // Creation Wizard states
  const [creationMaterial, setCreationMaterial] = useState<{
    materialType: 'file' | 'text' | 'topic';
    content: string;
    topic: string;
    fileName?: string;
  } | null>(null);

  const [creationConfig, setCreationConfig] = useState<QuizConfig | null>(null);

  // UX Workflow Guide Modal
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
    } catch {}
  }, [quizzes]);

  // Handlers for Creation
  const handleMaterialContinue = (data: {
    materialType: 'file' | 'text' | 'topic';
    content: string;
    topic: string;
    fileName?: string;
  }) => {
    setCreationMaterial(data);
    setCurrentScreen('configure-quiz');
  };

  const handleConfigGenerate = (config: QuizConfig) => {
    setCreationConfig(config);
    setCurrentScreen('ai-generating');
  };

  const handleGenerationSuccess = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
    setActiveQuiz(newQuiz);
    setCurrentScreen('taking-quiz');
  };

  // Handlers for Taking Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentScreen('taking-quiz');
  };

  const handleFinishQuiz = (attempt: QuizAttempt) => {
    setActiveAttempt(attempt);

    // Update quiz history & best score
    if (activeQuiz) {
      setQuizzes((prev) =>
        prev.map((q) => {
          if (q.id === activeQuiz.id) {
            const best = Math.max(q.bestScore || 0, attempt.percentage);
            return {
              ...q,
              bestScore: best,
              lastScore: attempt.percentage,
              attemptsCount: (q.attemptsCount || 0) + 1,
              lastAttempt: attempt,
              updatedAt: new Date().toISOString(),
            };
          }
          return q;
        })
      );
    }

    setCurrentScreen('results');
  };

  const handleReviewAnswers = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    if (quiz.lastAttempt) {
      setActiveAttempt(quiz.lastAttempt);
    } else {
      // Mock full attempt if review requested before session
      const fallbackAnswers: Record<string, number> = {};
      quiz.questions.forEach((q) => {
        fallbackAnswers[q.id] = q.correctIndex;
      });
      setActiveAttempt({
        id: `att-demo-${quiz.id}`,
        quizId: quiz.id,
        date: new Date().toISOString(),
        answers: fallbackAnswers,
        score: quiz.questions.length,
        total: quiz.questions.length,
        percentage: 100,
        timeSeconds: 180,
      });
    }
    setCurrentScreen('review-answers');
  };

  const handleManageQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentScreen('manage-quiz');
  };

  const handleUpdateQuiz = (updated: Quiz) => {
    setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setActiveQuiz(updated);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    if (activeQuiz?.id === quizId) {
      setActiveQuiz(null);
    }
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenWorkflow={() => setWorkflowModalOpen(true)}
        totalQuizzesCount={quizzes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4">
        {currentScreen === 'landing' && (
          <LandingView
            onCreateQuiz={() => setCurrentScreen('add-material')}
            onTryDemo={(demoQuiz) => handleStartQuiz(demoQuiz)}
            demoQuiz={quizzes[0] || INITIAL_QUIZZES[0]}
            onOpenWorkflow={() => setWorkflowModalOpen(true)}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardView
            quizzes={quizzes}
            onCreateNewQuiz={() => setCurrentScreen('add-material')}
            onTakeQuiz={handleStartQuiz}
            onReviewQuiz={handleReviewAnswers}
            onManageQuiz={handleManageQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onShareQuiz={(q) => handleManageQuiz(q)}
            onQuickLoadTopic={(topic) => {
              setCreationMaterial({
                materialType: 'topic',
                content: `Study topic: ${topic}`,
                topic,
              });
              setCurrentScreen('configure-quiz');
            }}
          />
        )}

        {currentScreen === 'add-material' && (
          <AddMaterialView
            onContinue={handleMaterialContinue}
            onCancel={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'configure-quiz' && creationMaterial && (
          <ConfigureQuizView
            topic={creationMaterial.topic}
            materialType={creationMaterial.materialType}
            onGenerate={handleConfigGenerate}
            onBack={() => setCurrentScreen('add-material')}
          />
        )}

        {currentScreen === 'ai-generating' && creationMaterial && creationConfig && (
          <AIGeneratingView
            material={creationMaterial}
            config={creationConfig}
            onSuccess={handleGenerationSuccess}
            onError={() => setCurrentScreen('configure-quiz')}
            onCancel={() => setCurrentScreen('configure-quiz')}
          />
        )}

        {currentScreen === 'taking-quiz' && activeQuiz && (
          <QuizScreenView
            quiz={activeQuiz}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'results' && activeQuiz && activeAttempt && (
          <ResultsView
            quiz={activeQuiz}
            attempt={activeAttempt}
            onReviewAnswers={() => setCurrentScreen('review-answers')}
            onTryAgain={() => setCurrentScreen('taking-quiz')}
            onCreateNewQuiz={() => setCurrentScreen('add-material')}
            onGoToDashboard={() => setCurrentScreen('dashboard')}
            onShareQuiz={() => handleManageQuiz(activeQuiz)}
          />
        )}

        {currentScreen === 'review-answers' && activeQuiz && activeAttempt && (
          <ReviewAnswersView
            quiz={activeQuiz}
            attempt={activeAttempt}
            onRetake={() => setCurrentScreen('taking-quiz')}
            onCreateNew={() => setCurrentScreen('add-material')}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'manage-quiz' && activeQuiz && (
          <QuizManagementView
            quiz={activeQuiz}
            onUpdateQuiz={handleUpdateQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onRetakeQuiz={() => setCurrentScreen('taking-quiz')}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">QuizGen</span>
            <span>—</span>
            <span>Turn your study material into ready-to-use quizzes with AI</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentScreen('landing')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Welcome Screen
            </button>
            <button
              onClick={() => setWorkflowModalOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              9-Step UX Workflow
            </button>
            <button
              onClick={() => {
                setQuizzes(INITIAL_QUIZZES);
                localStorage.removeItem(STORAGE_KEY);
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Reset all demo quizzes to initial state"
            >
              Reset Demos
            </button>
          </div>
        </div>
      </footer>

      {/* UX Workflow Methodology Modal */}
      <UXWorkflowModal
        isOpen={workflowModalOpen}
        onClose={() => setWorkflowModalOpen(false)}
        onJumpToCreate={() => setCurrentScreen('add-material')}
      />
    </div>
  );
}
