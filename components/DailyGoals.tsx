import React from 'react';
import { useLugha } from '../hooks/useLugha';
import { DAILY_GOALS } from '../constants';
import { Goal, GoalType } from '../types';
import ProgressBar from './ProgressBar';

const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center justify-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Back">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800">{title}</h1>
    </div>
);

const GoalCard: React.FC<{ goal: Goal; isSelected: boolean; onSelect: () => void }> = ({ goal, isSelected, onSelect }) => {
    const language = useLugha().selectedLanguage;
    const themeColor = language?.color.replace('bg-', 'border-') || 'border-blue-500';

    return (
        <button
            onClick={onSelect}
            className={`w-full p-6 bg-white rounded-2xl shadow-sm text-left transition-all duration-300 ${isSelected ? `border-4 ${themeColor}` : 'border-4 border-transparent hover:border-slate-300'}`}
        >
            <div className="flex items-center">
                <span className="text-4xl mr-4">{goal.icon}</span>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{goal.title}</h3>
                    <p className="text-slate-600">{goal.description}</p>
                </div>
            </div>
        </button>
    );
};

const DailyGoals: React.FC = () => {
    const { activeGoalId, setActiveGoalId, dailyProgress, setView } = useLugha();

    const activeGoal = DAILY_GOALS.find(g => g.id === activeGoalId);

    let currentProgress = 0;
    let goalTarget = 1;
    let progressText = "Select a goal to get started!";

    if (activeGoal) {
        if (activeGoal.type === GoalType.XP) {
            currentProgress = dailyProgress.xp;
            goalTarget = activeGoal.target;
            progressText = `You've earned ${currentProgress} of ${goalTarget} XP today.`;
        } else {
            currentProgress = dailyProgress.lessonsCompleted;
            goalTarget = activeGoal.target;
            progressText = `You've completed ${currentProgress} of ${goalTarget} lessons today.`;
        }
    }
    
    const isGoalCompleted = activeGoal && currentProgress >= goalTarget;

    return (
        <div className="p-4">
            <PageHeader title="Daily Goals" onBack={() => setView('dashboard')} />

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-xl font-bold text-slate-700 mb-2">Current Progress</h2>
                {isGoalCompleted ? (
                    <div className="text-center py-4">
                        <span className="text-5xl">🎉</span>
                        <p className="font-bold text-green-600 text-lg mt-2">Goal Complete! Well done!</p>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-500 mb-4">{progressText}</p>
                        {activeGoal && <ProgressBar current={currentProgress} total={goalTarget} />}
                    </>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-slate-700 mb-4">Set Your Goal</h2>
                <div className="space-y-4">
                    {DAILY_GOALS.map(goal => (
                        <GoalCard 
                            key={goal.id} 
                            goal={goal}
                            isSelected={activeGoalId === goal.id}
                            onSelect={() => setActiveGoalId(goal.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DailyGoals;