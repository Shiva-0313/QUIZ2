export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'MCQ' | 'True-False' | 'Mixed';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: Difficulty;
  concept?: string;
}

export interface QuizConfig {
  numQuestions: number;
  difficulty: Difficulty;
  questionType: QuestionType;
  topicFocus?: string;
  language: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  date: string;
  answers: Record<string, number>; // questionId -> selectedIndex
  score: number;
  total: number;
  percentage: number;
  timeSeconds: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topic: string;
  keyConcepts?: string[];
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
  config: QuizConfig;
  bestScore?: number;
  lastScore?: number;
  attemptsCount?: number;
  lastAttempt?: QuizAttempt;
}

export type ScreenType =
  | 'landing'
  | 'dashboard'
  | 'add-material'
  | 'configure-quiz'
  | 'ai-generating'
  | 'taking-quiz'
  | 'results'
  | 'review-answers'
  | 'manage-quiz';
