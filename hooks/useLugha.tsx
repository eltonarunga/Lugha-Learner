import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, UserProgress } from '../types';
import { LANGUAGES } from '../constants';

type LughaView = 'login' | 'language-selection' | 'dashboard' | 'lesson' | 'dictionary' | 'profile' | 'leaderboard' | 'goals' | 'adventure' | 'visual-vocab' | 'conversation';

interface User {
    name: string;
    isGuest: boolean;
}

interface LughaContextType {
  view: LughaView;
  setView: (view: LughaView) => void;
  user: User | null;
  login: (name: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  selectedLanguage: Language | null;
  selectLanguage: (languageId: string) => void;
  userProgress: UserProgress;
  completeLesson: (languageId: string, lessonId: number, xp: number) => void;
  activeLessonId: number | null;
  setActiveLessonId: (id: number | null) => void;
  activeGoalId: string | null;
  setActiveGoalId: (id: string | null) => void;
  dailyProgress: { xp: number; lessonsCompleted: number };
}

const LughaContext = createContext<LughaContextType | undefined>(undefined);

const initialProgress: UserProgress = {
  completedLessons: {
    swahili: [],
    luo: [],
    kikuyu: [],
    kalenjin: [],
  },
  xp: 0,
  streak: 0,
};

export const LughaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<LughaView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(initialProgress);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [dailyProgress, setDailyProgress] = useState({ xp: 0, lessonsCompleted: 0 });

  const login = (name: string) => {
    setUser({ name, isGuest: false });
    setView('language-selection');
  };

  const loginAsGuest = () => {
    setUser({ name: 'Guest', isGuest: true });
    setView('language-selection');
  };

  const logout = () => {
      setUser(null);
      setSelectedLanguage(null);
      setUserProgress(initialProgress);
      setActiveLessonId(null);
      setActiveGoalId(null);
      setDailyProgress({ xp: 0, lessonsCompleted: 0 });
      setView('login');
  };

  const selectLanguage = (languageId: string) => {
    const lang = LANGUAGES.find(l => l.id === languageId);
    if (lang) {
      setSelectedLanguage(lang);
      setView('dashboard');
    }
  };

  const completeLesson = (languageId: string, lessonId: number, xp: number) => {
    setUserProgress(prev => {
      const currentCompleted = prev.completedLessons[languageId] || [];
      if (currentCompleted.includes(lessonId)) {
        return prev; // Lesson already completed, no change in progress.
      }

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const lastDateStr = prev.lastCompletionDate;

      // If a lesson was already completed today, just add XP and the lesson.
      if (lastDateStr === todayStr) {
        return {
          ...prev,
          xp: prev.xp + xp,
          completedLessons: {
            ...prev.completedLessons,
            [languageId]: [...currentCompleted, lessonId],
          },
        };
      }

      // It's a new day of activity.
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      let newStreak = 1; // Default to 1 for a new session. Also handles first-ever lesson.
      if (lastDateStr === yesterdayStr) {
        // If the last activity was yesterday, increment the streak.
        newStreak = prev.streak + 1;
      }
      
      return {
        ...prev,
        xp: prev.xp + xp,
        streak: newStreak,
        lastCompletionDate: todayStr,
        completedLessons: {
          ...prev.completedLessons,
          [languageId]: [...currentCompleted, lessonId],
        },
      };
    });

    setDailyProgress(prev => ({
        xp: prev.xp + xp,
        lessonsCompleted: prev.lessonsCompleted + 1,
    }));
  };

  const value = {
    view,
    setView,
    user,
    login,
    loginAsGuest,
    logout,
    selectedLanguage,
    selectLanguage,
    userProgress,
    completeLesson,
    activeLessonId,
    setActiveLessonId,
    activeGoalId,
    setActiveGoalId,
    dailyProgress,
  };

  return <LughaContext.Provider value={value}>{children}</LughaContext.Provider>;
};

export const useLugha = (): LughaContextType => {
  const context = useContext(LughaContext);
  if (context === undefined) {
    throw new Error('useLugha must be used within a LughaProvider');
  }
  return context;
};