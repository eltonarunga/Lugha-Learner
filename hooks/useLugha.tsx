
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, UserProgress } from '../types';
import { LANGUAGES, DAILY_GOALS, LESSON_DATA } from '../constants';

type LughaView = 'login' | 'language-selection' | 'dashboard' | 'lesson' | 'dictionary' | 'profile' | 'leaderboard' | 'goals' | 'adventure' | 'visual-vocab' | 'conversation' | 'live-tutor' | 'creative-corner';

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

const getStoredState = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
        return JSON.parse(stored) as T;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};


export const LughaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredState('lugha-user', null));
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(() => getStoredState('lugha-selectedLanguage', null));
  const [userProgress, setUserProgress] = useState<UserProgress>(() => getStoredState('lugha-userProgress', initialProgress));
  const [activeGoalId, setActiveGoalId] = useState<string | null>(() => getStoredState('lugha-activeGoalId', null));
  const [dailyProgress, setDailyProgress] = useState(() => getStoredState('lugha-dailyProgress', { xp: 0, lessonsCompleted: 0 }));
  
  const [view, setView] = useState<LughaView>(() => {
    const storedUser = getStoredState('lugha-user', null);
    if (!storedUser) return 'login';
    const storedLang = getStoredState('lugha-selectedLanguage', null);
    if (!storedLang) return 'language-selection';
    return 'dashboard';
  });

  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  useEffect(() => {
      if (user) localStorage.setItem('lugha-user', JSON.stringify(user));
      else localStorage.removeItem('lugha-user');
  }, [user]);

  useEffect(() => {
      if (user && selectedLanguage) localStorage.setItem('lugha-selectedLanguage', JSON.stringify(selectedLanguage));
      else localStorage.removeItem('lugha-selectedLanguage');
  }, [user, selectedLanguage]);

  useEffect(() => {
      if (user) localStorage.setItem('lugha-userProgress', JSON.stringify(userProgress));
      else localStorage.removeItem('lugha-userProgress');
  }, [user, userProgress]);
  
  useEffect(() => {
      if (user) localStorage.setItem('lugha-activeGoalId', JSON.stringify(activeGoalId));
      else localStorage.removeItem('lugha-activeGoalId');
  }, [user, activeGoalId]);

  useEffect(() => {
      if (user) {
          const today = new Date().toDateString();
          const lastDate = getStoredState('lugha-lastActiveDate', null);
          if (today !== lastDate) {
              setDailyProgress({ xp: 0, lessonsCompleted: 0 });
              localStorage.setItem('lugha-dailyProgress', JSON.stringify({ xp: 0, lessonsCompleted: 0 }));
              localStorage.setItem('lugha-lastActiveDate', JSON.stringify(today));
          }
      }
  }, [user]);

  useEffect(() => {
      if (user) localStorage.setItem('lugha-dailyProgress', JSON.stringify(dailyProgress));
      else localStorage.removeItem('lugha-dailyProgress');
  }, [user, dailyProgress]);


  const login = (name: string) => {
    setUser({ name, isGuest: false });
    const previouslySelectedLang = getStoredState('lugha-selectedLanguage', null);
    if (previouslySelectedLang) {
      setSelectedLanguage(previouslySelectedLang);
      setView('dashboard');
    } else {
      setView('language-selection');
    }
  };

  const loginAsGuest = () => {
    setUser({ name: 'Guest', isGuest: true });
    const previouslySelectedLang = getStoredState('lugha-selectedLanguage', null);
    if (previouslySelectedLang) {
      setSelectedLanguage(previouslySelectedLang);
      setView('dashboard');
    } else {
      setView('language-selection');
    }
  };

  const logout = () => {
      setUser(null);
      setSelectedLanguage(null);
      setUserProgress(initialProgress);
      setActiveLessonId(null);
      setActiveGoalId(null);
      setDailyProgress({ xp: 0, lessonsCompleted: 0 });
      localStorage.clear();
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
        return prev;
      }

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const lastDateStr = prev.lastCompletionDate;

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

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      let newStreak = 1;
      if (lastDateStr === yesterdayStr) {
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
