import React from 'react';
import { X, CheckCircle2, ArrowRight, Lightbulb, Compass, Target, Code, PenTool, Layout, Smartphone, CheckCheck, RefreshCw } from 'lucide-react';

interface UXWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToCreate: () => void;
}

export const UXWorkflowModal: React.FC<UXWorkflowModalProps> = ({
  isOpen,
  onClose,
  onJumpToCreate,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1. Discover',
      title: 'Empathize with Learners & Educators',
      desc: 'Understand why users create practice quizzes and what makes manual authoring difficult, repetitive, and time-intensive.',
      icon: Compass,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'Discovery',
    },
    {
      step: '2. Define',
      title: 'Problem Framing & User Personas',
      desc: 'Core statement: "Creating high-quality quizzes manually is time-consuming and cognitively demanding for students and teachers."',
      icon: Target,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Definition',
    },
    {
      step: '3. Ideate',
      title: 'Multimodal Input & AI Synthesis',
      desc: 'Explore file upload (PDF/DOCX), paste text, topic prompting, real-time question refinement, and instant answer explanations.',
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Ideation',
    },
    {
      step: '4. User Flow',
      title: 'Streamlined 5-Stage Path',
      desc: 'Dashboard → Add Material → Configure Quiz → AI Generation → Take Quiz → Results & Review Answers.',
      icon: ArrowRight,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Information Architecture',
    },
    {
      step: '5. Wireframe',
      title: 'Focused Screen Layouts',
      desc: 'Craft clear, single-question quiz cards, clear progress meters, and uncluttered configuration settings.',
      icon: Layout,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      badge: 'Wireframes',
    },
    {
      step: '6. Visual Design',
      title: 'SaaS Design System',
      desc: 'Indigo/Violet primary palette, high-contrast rounded buttons (12–16px radius), Inter sans-serif typography, clean white cards with slate borders.',
      icon: PenTool,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'UI System',
    },
    {
      step: '7. Prototype',
      title: 'Interactive Working MVP',
      desc: 'Fully clickable, working experience with keyboard shortcuts, timer, question review, and AI question regeneration.',
      icon: Smartphone,
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      badge: 'Interactive Flow',
    },
    {
      step: '8. Test',
      title: 'Usability Validation',
      desc: 'Observe students and teachers generating quizzes from raw notes; measure task completion speed and error comprehension.',
      icon: CheckCheck,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      badge: 'Testing',
    },
    {
      step: '9. Iterate',
      title: 'Continuous Polish & Feedback',
      desc: 'Refine question difficulty calibration, explanation clarity, export capabilities, and live generation state feedback.',
      icon: RefreshCw,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Iteration',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Design Process
              </span>
              <h2 className="text-xl font-bold text-slate-900">Universal 9-Step UX Workflow</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              How this AI Quiz Generator was researched, architected, and prototyped for maximum clarity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.step}: {item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-start space-x-3 mt-4">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-900">Key UX Principle: Don’t Overcomplicate</h4>
              <p className="text-xs text-indigo-800/90 mt-0.5">
                The central experience is kept intuitive and fast: <strong>Upload → Choose → Generate → Take → Learn</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              onClose();
              onJumpToCreate();
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
          >
            <span>Start Creating Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
