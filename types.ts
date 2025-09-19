export interface Language {
  id: string;
  name: string;
  flag: string;
  color: string;
}

export enum QuestionType {
  MCQ = 'MCQ',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  EPIC_ADVENTURE = 'EPIC_ADVENTURE',
}

export interface MCQQuestion {
  type: QuestionType.MCQ;
  question: string;
  options: string[];
  answer: string;
  translation: string;
}

export interface FillInBlankQuestion {
  type: QuestionType.FILL_IN_BLANK;
  questionParts: [string, string]; // e.g., ["Jina langu ni ____", "."]
  answer: string;
  translation: string;
}

export interface EpicAdventureQuestion {
  type: QuestionType.EPIC_ADVENTURE;
  title: string;
  prompt: string;
  translation: string;
}

export type QuizQuestion = MCQQuestion | FillInBlankQuestion | EpicAdventureQuestion;

export interface Lesson {
  id: number;
  title: string;
  xp: number;
  questions: QuizQuestion[];
}

export interface Level {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export interface DictionaryEntry {
  word: string;
  definition: string;
  example?: string;
}

export interface LanguageData {
  name: string;
  levels: Level[];
  dictionary?: DictionaryEntry[];
}

export interface UserProgress {
  completedLessons: { [languageId: string]: number[] };
  xp: number;
  streak: number;
  lastCompletionDate?: string;
}

export enum GoalType {
  XP = 'XP',
  LESSONS = 'LESSONS',
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  icon: string;
}