
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, UserProgress } from '../types';
import { LANGUAGES } from '../constants';

type LughaView = 'login' | 'language-selection' | 'dashboard' | 'lesson';

interface User {
    name: string;
    isGuest: boolean;
}

interface LughaContextType {
  view: LughaView;
  setView: (view: LughaView) => void;
  user: User | null;
  loginAsGuest: () => void;
  logout: () => void;
  selectedLanguage: Language | null;
  selectLanguage: (languageId: string) => void;
  userProgress: UserProgress;
  completeLesson: (languageId: string, lessonId: number, xp: number) => void;
  activeLessonId: number | null;
  setActiveLessonId: (id: number | null) => void;
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

  const loginAsGuest = () => {
    setUser({ name: 'Guest', isGuest: true });
    setView('language-selection');
  };

  const logout = () => {
      setUser(null);
      setSelectedLanguage(null);
      setUserProgress(initialProgress);
      setActiveLessonId(null);
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
        return prev; // Already completed
      }
      return {
        ...prev,
        xp: prev.xp + xp,
        // Basic streak logic, can be improved with date checks
        streak: prev.streak + 1,
        completedLessons: {
          ...prev.completedLessons,
          [languageId]: [...currentCompleted, lessonId],
        },
      };
    });
  };

  const value = {
    view,
    setView,
    user,
    loginAsGuest,
    logout,
    selectedLanguage,
    selectLanguage,
    userProgress,
    completeLesson,
    activeLessonId,
    setActiveLessonId,
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
