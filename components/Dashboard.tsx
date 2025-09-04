import React from 'react';
import { Language, Level, Lesson } from '../types';
import { LESSON_DATA } from '../constants';
import { useLugha } from '../hooks/useLugha';
import Header from './Header';

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const LessonButton: React.FC<{ lesson: Lesson, isCompleted: boolean, isLocked: boolean, onClick: () => void }> = ({ lesson, isCompleted, isLocked, onClick }) => {
    const language = useLugha().selectedLanguage;
    const color = language?.color.match(/bg-(\w+)-(\d+)/);
    const themeColor = color ? color[1] : 'gray';
    const themeStrength = color ? parseInt(color[2]) : 500;

    const getButtonClasses = () => {
        if (isCompleted) {
            return 'bg-yellow-400 border-yellow-500 hover:bg-yellow-500';
        }
        if (isLocked) {
            return 'bg-slate-300 border-slate-400 cursor-not-allowed';
        }
        return `bg-${themeColor}-${themeStrength} border-${themeColor}-${themeStrength + 100} hover:bg-${themeColor}-${themeStrength + 100}`;
    };

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-bold text-center p-2 shadow-lg border-b-8 transform transition-all duration-200 ${getButtonClasses()} ${!isLocked && 'hover:-translate-y-1'}`}
        >
            {isCompleted ? <CheckmarkIcon /> : isLocked ? <LockIcon /> : (
                <>
                    <span className="block text-sm leading-tight drop-shadow-sm">{lesson.title}</span>
                    <span className="text-xs opacity-80 font-medium mt-1">{lesson.xp} XP</span>
                </>
            )}
        </button>
    );
};


const ModuleCard: React.FC<{ level: Level, languageId: string }> = ({ level, languageId }) => {
    const { userProgress, setView, setActiveLessonId, selectedLanguage } = useLugha();
    const completedLessons = userProgress.completedLessons[languageId] || [];

    const color = selectedLanguage?.color.match(/bg-(\w+)-(\d+)/);
    const themeColorName = color ? color[1] : 'gray';
    const themeStrength = color ? parseInt(color[2]) : 500;
    
    const gradient = `bg-gradient-to-br from-${themeColorName}-${themeStrength} to-${themeColorName}-${themeStrength + 200}`;


    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.questions.length === 0) {
            alert("This lesson is under construction!");
            return;
        }
        setActiveLessonId(lesson.id);
        setView('lesson');
    };

    const isLessonUnlocked = (index: number) => {
        if (index === 0) return true;
        const previousLessonId = level.lessons[index - 1].id;
        return completedLessons.includes(previousLessonId);
    }
    
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 mb-6 overflow-hidden">
            <header className={`flex items-center space-x-4 p-5 text-white ${gradient}`}>
                <span className="text-5xl drop-shadow-sm">{level.icon}</span>
                <div className="flex-grow">
                    <h2 className="text-2xl font-extrabold tracking-tight">{level.name}</h2>
                    <p className="opacity-90 text-sm font-medium">{level.description}</p>
                </div>
            </header>
            <div className="p-6 bg-slate-50/50">
                <div className="flex flex-wrap gap-6 justify-center">
                    {level.lessons.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isLocked = !isLessonUnlocked(index);
                        return (
                            <LessonButton
                                key={lesson.id}
                                lesson={lesson}
                                isCompleted={isCompleted}
                                isLocked={isLocked}
                                onClick={() => handleLessonClick(lesson)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  const { userProgress, setView } = useLugha();
  const languageData = LESSON_DATA[language.id];

  if (!languageData) {
    return <div>Language data not found.</div>;
  }

  return (
    <div>
      <Header 
        xp={userProgress.xp} 
        streak={userProgress.streak}
        onProfileClick={() => setView('profile')}
        onLanguageClick={() => setView('language-selection')}
        onDictionaryClick={() => setView('dictionary')}
        onLeaderboardClick={() => setView('leaderboard')}
        onGoalsClick={() => setView('goals')}
        language={{name: language.name, flag: language.flag}}
      />
      {languageData.levels.map(level => (
        <ModuleCard key={level.id} level={level} languageId={language.id}/>
      ))}
    </div>
  );
};

export default Dashboard;