import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Sparkles,
  Plus,
  Save,
  RotateCcw,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  Printer,
  FileCode,
  X
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../types/quiz';

interface QuizManagementViewProps {
  quiz: Quiz;
  onUpdateQuiz: (updatedQuiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onRetakeQuiz: () => void;
  onBack: () => void;
}

export const QuizManagementView: React.FC<QuizManagementViewProps> = ({
  quiz,
  onUpdateQuiz,
  onDeleteQuiz,
  onRetakeQuiz,
  onBack,
}) => {
  const [title, setTitle] = useState(quiz.title);
  const [topic, setTopic] = useState(quiz.topic);
  const [description, setDescription] = useState(quiz.description);
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions || []);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Question editing form state
  const [editForm, setEditForm] = useState<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    concept: string;
  }>({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    concept: '',
  });

  const handleStartEditQuestion = (q: QuizQuestion) => {
    setEditingQuestionId(q.id);
    setEditForm({
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      concept: q.concept || '',
    });
  };

  const handleSaveQuestionEdit = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              question: editForm.question,
              options: editForm.options,
              correctIndex: editForm.correctIndex,
              explanation: editForm.explanation,
              concept: editForm.concept,
            }
          : q
      )
    );
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingQuestionId === id) setEditingQuestionId(null);
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q_custom_${Date.now()}`,
      question: 'New Question Title',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Why? Provide a clear explanation for this question.',
      concept: topic,
      difficulty: 'Medium',
    };
    setQuestions([...questions, newQ]);
    handleStartEditQuestion(newQ);
  };

  // AI Question Regeneration
  const handleRegenerateQuestion = async (q: QuizQuestion) => {
    setRegeneratingId(q.id);
    try {
      const response = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizTitle: title,
          topic,
          currentQuestion: q,
          difficulty: q.difficulty || quiz.config?.difficulty || 'Medium',
          questionType: quiz.config?.questionType || 'MCQ',
        }),
      });

      if (!response.ok) throw new Error('Regeneration failed');
      const data = await response.json();

      if (data.question) {
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...data.question, id: q.id } : item))
        );
        if (editingQuestionId === q.id) {
          setEditForm({
            question: data.question.question,
            options: data.question.options,
            correctIndex: data.question.correctIndex,
            explanation: data.question.explanation,
            concept: data.question.concept,
          });
        }
      }
    } catch (err) {
      console.error('Failed to regenerate:', err);
      alert('Could not regenerate question right now.');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Save all quiz changes
  const handleSaveAll = () => {
    const updated: Quiz = {
      ...quiz,
      title: title.trim() || quiz.title,
      topic: topic.trim() || quiz.topic,
      description: description.trim(),
      questions,
      updatedAt: new Date().toISOString(),
    };
    onUpdateQuiz(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPrintable = () => {
    const content = `# ${quiz.title}\nTopic: ${quiz.topic}\n\n${questions
      .map(
        (q, idx) =>
          `### Question ${idx + 1}: ${q.question}\n${q.options
            .map((opt, i) => `[ ] ${String.fromCharCode(65 + i)}. ${opt}`)
            .join('\n')}\n\nAnswer Key: ${String.fromCharCode(65 + q.correctIndex)}\nExplanation: ${q.explanation}\n`
      )
      .join('\n---\n\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/\s+/g, '-')}-test.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Quiz
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rename, edit questions, regenerate using AI, or export
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRetakeQuiz}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Retake</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quiz Details Card (Rename / Topic) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quiz Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quiz Title (Rename)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topic / Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Questions Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Questions ({questions.length})
          </h2>
          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const isEditing = editingQuestionId === q.id;
            const isRegenerating = regeneratingId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {q.difficulty || 'Medium'}
                    </span>
                    {q.concept && (
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        • {q.concept}
                      </span>
                    )}
                  </div>

                  {/* Actions for this question */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleRegenerateQuestion(q)}
                      disabled={isRegenerating}
                      className="px-2.5 py-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      title="Generate a fresh alternative question using AI"
                    >
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
                    </button>

                    <button
                      onClick={() =>
                        isEditing ? setEditingQuestionId(null) : handleStartEditQuestion(q)
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Display / Edit Form */}
                {!isEditing ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-sm font-bold text-slate-900">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border flex items-center space-x-2 ${
                            i === q.correctIndex
                              ? 'border-emerald-300 bg-emerald-50/60 font-semibold text-emerald-900'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold text-slate-400">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <span>{opt}</span>
                          {i === q.correctIndex && (
                            <span className="ml-auto text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100 leading-relaxed">
                      💡 {q.explanation}
                    </p>
                  </div>
                ) : (
                  /* Inline Question Editor */
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={editForm.question}
                        onChange={(e) =>
                          setEditForm({ ...editForm, question: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Answer Options (Select the correct radio button)
                      </label>
                      {editForm.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={editForm.correctIndex === optIdx}
                            onChange={() =>
                              setEditForm({ ...editForm, correctIndex: optIdx })
                            }
                            className="w-4 h-4 text-indigo-600 cursor-pointer"
                            title="Mark as correct answer"
                          />
                          <span className="text-xs font-bold text-slate-500 w-4">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...editForm.options];
                              newOpts[optIdx] = e.target.value;
                              setEditForm({ ...editForm, options: newOpts });
                            }}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pedagogical Explanation (Why?)
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.explanation}
                        onChange={(e) =>
                          setEditForm({ ...editForm, explanation: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setEditingQuestionId(null)}
                        className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveQuestionEdit(q.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
                      >
                        Update Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Delete Entire Quiz */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Danger Zone</h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Permanently delete this quiz and its practice attempt history.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${quiz.title}" permanently?`)) {
              onDeleteQuiz(quiz.id);
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          Delete This Quiz
        </button>
      </div>

      {/* Share / Export Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Share or Export Quiz</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Share this assessment with students or export it for use in other LMS platforms.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleCopyLink}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left flex items-center justify-between text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}</span>
                </div>
                {copiedLink && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={handleExportPrintable}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left flex items-center space-x-2.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Export Printable Test (Markdown / PDF)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left flex items-center space-x-2.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-slate-600" />
                <span>Export Quiz Schema (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
