import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, UserProgress } from '../types';
import { LANGUAGES } from '../constants';

type LughaView = 'login' | 'language-selection' | 'dashboard' | 'lesson' | 'dictionary' | 'profile' | 'leaderboard';

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

// Helper function to get item from localStorage
const getStoredState = <T,>(key: string, defaultValue: T): T => {
    const savedItem = localStorage.getItem(key);
    if (savedItem) {
        try {
            return JSON.parse(savedItem);
        } catch (error) {
            console.error(`Error parsing localStorage item ${key}:`, error);
            return defaultValue;
        }
    }
    return defaultValue;
};


export const LughaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredState('lugha-user', null));

  const [view, setView] = useState<LughaView>(() => {
      const savedUser = getStoredState<User | null>('lugha-user', null);
      if (!savedUser) return 'login';
      return getStoredState('lugha-view', 'language-selection');
  });

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(() => getStoredState('lugha-selectedLanguage', null));
  const [userProgress, setUserProgress] = useState<UserProgress>(() => getStoredState('lugha-userProgress', initialProgress));
  const [activeLessonId, setActiveLessonId] = useState<number | null>(() => getStoredState('lugha-activeLessonId', null));

  // Effect to synchronize state with localStorage
  useEffect(() => {
      if (user) {
          localStorage.setItem('lugha-view', JSON.stringify(view));
          localStorage.setItem('lugha-user', JSON.stringify(user));
          localStorage.setItem('lugha-selectedLanguage', JSON.stringify(selectedLanguage));
          localStorage.setItem('lugha-userProgress', JSON.stringify(userProgress));
          localStorage.setItem('lugha-activeLessonId', JSON.stringify(activeLessonId));
      } else {
          // Clear localStorage on logout
          localStorage.removeItem('lugha-view');
          localStorage.removeItem('lugha-user');
          localStorage.removeItem('lugha-selectedLanguage');
          localStorage.removeItem('lugha-userProgress');
          localStorage.removeItem('lugha-activeLessonId');
      }
  }, [view, user, selectedLanguage, userProgress, activeLessonId]);


  const loginAsGuest = () => {
    const guestUser = { name: 'Guest', isGuest: true };
    setUser(guestUser);
    setView('language-selection');
  };

  const logout = () => {
      setUser(null);
      setView('login');
      setSelectedLanguage(null);
      setUserProgress(initialProgress);
      setActiveLessonId(null);
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