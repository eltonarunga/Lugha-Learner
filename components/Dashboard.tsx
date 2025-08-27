
import React from 'react';
import { Language, Level, Lesson } from '../types';
import { LESSON_DATA } from '../constants';
import { useLugha } from '../hooks/useLugha';
import Header from './Header';

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const LessonButton: React.FC<{ lesson: Lesson, isCompleted: boolean, isLocked: boolean, onClick: () => void }> = ({ lesson, isCompleted, isLocked, onClick }) => {
    const language = useLugha().selectedLanguage;
    const baseColor = language?.color || 'bg-gray-500';

    const getButtonClasses = () => {
        if (isCompleted) {
            return 'bg-green-500 hover:bg-green-600';
        }
        if (isLocked) {
            return 'bg-slate-400 cursor-not-allowed';
        }
        return `${baseColor} hover:bg-opacity-80`;
    };

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-300 ${getButtonClasses()} ${!isLocked && 'hover:scale-105'}`}
        >
            {isCompleted ? <CheckmarkIcon /> : isLocked ? <LockIcon /> : (
                <>
                    <span className="block">{lesson.title}</span>
                    <span className="text-xs opacity-80">{lesson.xp} XP</span>
                </>
            )}
        </button>
    );
};


const LevelSection: React.FC<{ level: Level, languageId: string }> = ({ level, languageId }) => {
    const { userProgress, setView, setActiveLessonId } = useLugha();
    const completedLessons = userProgress.completedLessons[languageId] || [];

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.questions.length === 0) {
            // Mock completion for empty lessons
            alert("This lesson is under construction!");
            return;
        }
        setActiveLessonId(lesson.id);
        setView('lesson');
    };

    // Simple logic: unlock the next lesson after completing the previous one
    const isLessonUnlocked = (lessonId: number, index: number) => {
        if (index === 0) return true; // First lesson is always unlocked
        const previousLessonId = level.lessons[index - 1].id;
        return completedLessons.includes(previousLessonId);
    }
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{level.name}</h2>
            <p className="text-slate-500 mb-6">{level.description}</p>
            <div className="flex flex-wrap gap-6 justify-center">
                {level.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isLocked = !isLessonUnlocked(lesson.id, index);
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
    );
}

const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  const { userProgress, logout } = useLugha();
  const languageData = LESSON_DATA[language.id];

  if (!languageData) {
    return <div>Language data not found.</div>;
  }

  return (
    <div>
      <Header 
        xp={userProgress.xp} 
        streak={userProgress.streak}
        onAvatarClick={logout}
        language={{name: language.name, flag: language.flag}}
      />
      {languageData.levels.map(level => (
        <LevelSection key={level.id} level={level} languageId={language.id}/>
      ))}
    </div>
  );
};

export default Dashboard;
