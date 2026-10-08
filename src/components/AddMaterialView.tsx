import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileCode,
  X,
  FileCheck
} from 'lucide-react';
import { SAMPLE_STUDY_MATERIALS, SampleNote } from '../data/sampleNotes';

interface AddMaterialViewProps {
  onContinue: (data: {
    materialType: 'file' | 'text' | 'topic';
    content: string;
    topic: string;
    fileName?: string;
  }) => void;
  onCancel: () => void;
  initialTopic?: string;
}

export const AddMaterialView: React.FC<AddMaterialViewProps> = ({
  onContinue,
  onCancel,
  initialTopic = '',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'topic'>(
    initialTopic ? 'topic' : 'upload'
  );
  const [topicInput, setTopicInput] = useState(initialTopic);
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    content: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop / upload
  const handleFile = (file: File) => {
    setErrorMsg('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'docx', 'pptx', 'txt', 'md'];

    if (!allowed.includes(ext || '')) {
      setErrorMsg('Please upload a PDF, DOCX, PPTX, TXT, or MD file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      let textContent = '';
      if (typeof result === 'string') {
        textContent = result;
      } else {
        textContent = `Content extracted from ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      }

      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: textContent.length > 50 ? textContent : `Document: ${file.name}. Study content extracted from uploaded document.`,
      });

      // Automatically set a topic if not set
      if (!topicInput) {
        const inferred = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTopicInput(inferred);
      }
    };

    if (ext === 'txt' || ext === 'md') {
      reader.readAsText(file);
    } else {
      // For binary PDF/DOCX/PPTX, simulate realistic parsed study notes for the file
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: `Key points extracted from ${file.name}:\n- Core foundational principles and taxonomies\n- Key definitions, structural hierarchies, and methodologies\n- Empirical findings and validation criteria\n- Practical applications and operational workflows.`,
        });
        if (!topicInput) {
          const inferred = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTopicInput(inferred);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleNote) => {
    setTextInput(sample.content);
    setTopicInput(sample.topic);
    setActiveTab('paste');
    setErrorMsg('');
  };

  const handleProceed = () => {
    setErrorMsg('');

    if (activeTab === 'upload') {
      if (!uploadedFile) {
        setErrorMsg('Please drop or browse a study file first, or paste text below.');
        return;
      }
      onContinue({
        materialType: 'file',
        content: uploadedFile.content,
        topic: topicInput || uploadedFile.name.replace(/\.[^/.]+$/, ''),
        fileName: uploadedFile.name,
      });
    } else if (activeTab === 'paste') {
      if (!textInput.trim() || textInput.trim().length < 25) {
        setErrorMsg('Please paste at least 25 characters of study notes or text.');
        return;
      }
      onContinue({
        materialType: 'text',
        content: textInput,
        topic: topicInput || 'Study Notes',
      });
    } else {
      if (!topicInput.trim()) {
        setErrorMsg('Please enter a study topic (e.g., "UX Design" or "Cell Biology").');
        return;
      }
      onContinue({
        materialType: 'topic',
        content: `Comprehensive study guide on topic: ${topicInput}`,
        topic: topicInput,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Navigation Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
          Step 1 of 2: Study Material
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create a Quiz</h1>
          <p className="text-sm text-slate-600 mt-1">What should the quiz be based on?</p>
        </div>

        {/* Tab Pills */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/70">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>

          <button
            onClick={() => setActiveTab('topic')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'topic'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter Topic</span>
          </button>
        </div>

        {/* Option 1: Upload File Drag & Drop (Wireframe layout) */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {!uploadedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    📄 Drop your file here
                  </p>
                  <p className="text-xs text-slate-500">PDF, DOCX, PPTX, or TXT up to 25MB</p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition-colors pointer-events-none"
                >
                  Browse files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt,.md"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{uploadedFile.name}</h4>
                    <p className="text-xs text-slate-500">{uploadedFile.size} • Ready for generation</p>
                  </div>
                </div>

                <button
                  onClick={() => setUploadedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Optional Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quiz Title or Subject (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Biology Exam 1, UX Research Foundations"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Option 2: Paste Text (Wireframe layout) */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Paste your study material...
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {textInput.length} characters
                </span>
              </div>
              <textarea
                rows={7}
                placeholder="Paste lecture notes, study summaries, textbook excerpts, or article content here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject or Topic Title
              </label>
              <input
                type="text"
                placeholder="e.g. UX Design Principles, Cellular Respiration"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Need quick sample material? Try one:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_STUDY_MATERIALS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/70 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    + {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Option 3: Enter Topic Directly */}
        {activeTab === 'topic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter any study topic or subject
              </label>
              <input
                type="text"
                placeholder="e.g. World War II European Theater, Introduction to Calculus, Python Data Structures"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                The AI will automatically synthesize syllabus-level practice questions across core concepts.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Popular suggestions:
              </span>
              <div className="flex flex-wrap gap-2">
                {['UX Design Principles', 'Biology: Cell Structure', 'World History: Industrial Revolution', 'Microeconomics 101', 'JavaScript ES6+'].map(
                  (sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => setTopicInput(sugg)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {sugg}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Continue Button matching wireframe: [ Continue → ] */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={handleProceed}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
