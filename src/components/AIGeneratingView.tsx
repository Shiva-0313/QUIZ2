import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Loader2, Circle, AlertCircle } from 'lucide-react';
import { Quiz, QuizConfig } from '../types/quiz';

interface AIGeneratingViewProps {
  material: {
    materialType: 'file' | 'text' | 'topic';
    content: string;
    topic: string;
    fileName?: string;
  };
  config: QuizConfig;
  onSuccess: (quiz: Quiz) => void;
  onError: (errorMessage: string) => void;
  onCancel: () => void;
}

interface GenerationStep {
  label: string;
  detail: string;
}

const STEPS: GenerationStep[] = [
  { label: 'Reading your material', detail: 'Parsing source syntax & headings' },
  { label: 'Identifying key concepts', detail: 'Synthesizing core learning objectives' },
  { label: 'Generating questions', detail: 'Formulating scenarios & plausible distractors' },
  { label: 'Checking difficulty', detail: 'Calibrating cognitive complexity & tone' },
  { label: 'Preparing quiz', detail: 'Structuring pedagogical explanations & answer keys' },
];

export const AIGeneratingView: React.FC<AIGeneratingViewProps> = ({
  material,
  config,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [discoveredConcepts, setDiscoveredConcepts] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Stepped progression simulation that syncs with the real backend call
  useEffect(() => {
    let isCancelled = false;

    // Simulated progress tick intervals to make the UX state understandable
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setProgressPercent(Math.min(90, Math.round(((next + 1) / STEPS.length) * 85)));

          // Add simulated concept pills
          if (next === 1) {
            setDiscoveredConcepts(['Core Principles', 'Foundations', 'Taxonomy']);
          } else if (next === 2) {
            setDiscoveredConcepts((c) => [...c, 'Heuristics', 'Cognitive Load']);
          } else if (next === 3) {
            setDiscoveredConcepts((c) => [...c, 'Application Scenarios']);
          }
          return next;
        }
        return prev;
      });
    }, 1200);

    // Actual API call to server
    const generate = async () => {
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            materialType: material.materialType,
            content: material.content,
            topic: material.topic,
            numQuestions: config.numQuestions,
            difficulty: config.difficulty,
            questionType: config.questionType,
            language: config.language,
            focusArea: config.topicFocus,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned ${response.status}`);
        }

        const data = await response.json();
        if (isCancelled) return;

        if (data.quiz) {
          // Finalize progress
          setCurrentStepIndex(STEPS.length - 1);
          setProgressPercent(100);

          const generatedQuiz: Quiz = {
            id: `quiz-${Date.now()}`,
            title: data.quiz.title || `${material.topic} Practice Quiz`,
            description: data.quiz.description || 'AI-generated practice quiz.',
            topic: data.quiz.topic || material.topic || 'General',
            keyConcepts: data.quiz.keyConcepts || discoveredConcepts,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questions: data.quiz.questions || [],
            config,
          };

          // Brief delay so user sees 100% completion before smooth transition
          setTimeout(() => {
            if (!isCancelled) {
              onSuccess(generatedQuiz);
            }
          }, 800);
        } else {
          throw new Error('No quiz returned from generator');
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Quiz creation failure:', err);
        setApiError(err.message || 'Failed to generate quiz. Please try again.');
      }
    };

    generate();

    return () => {
      isCancelled = true;
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      {/* Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-8 text-center">
        {/* Animated Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 animate-bounce duration-1000">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Headline requested in prompt */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ✨ Creating your quiz...
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Synthesizing <strong className="text-slate-800 font-semibold">{material.topic || 'study notes'}</strong> into {config.numQuestions} {config.difficulty} questions
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Analyzing material</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Understandable Process Checklist (matching wireframe) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 text-left space-y-3.5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || progressPercent === 100;
            const isCurrent = idx === currentStepIndex && progressPercent < 100;
            const isUpcoming = idx > currentStepIndex && progressPercent < 100;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-sm transition-all ${
                  isCurrent ? 'font-bold text-indigo-900 scale-[1.01]' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Status Indicator matching prompt icons: ✓, ●, ○ */}
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 animate-ping ring-4 ring-indigo-200" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 stroke-[1.5]" />
                    )}
                  </div>

                  <span
                    className={`text-sm ${
                      isCompleted
                        ? 'text-slate-800 font-medium'
                        : isCurrent
                        ? 'text-indigo-700 font-bold'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  {isCompleted ? 'Done' : isCurrent ? 'Working...' : 'Waiting'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Discovered Concepts Preview */}
        {discoveredConcepts.length > 0 && (
          <div className="text-left space-y-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Identified Concepts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {discoveredConcepts.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-medium animate-in fade-in duration-300"
                >
                  #{c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Handling */}
        {apiError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left space-y-2">
            <div className="flex items-center space-x-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Generation Issue</span>
            </div>
            <p>{apiError}</p>
            <div className="pt-2 flex space-x-2">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
