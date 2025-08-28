import React from 'react';
import { useLugha } from '../hooks/useLugha';
import { LESSON_DATA } from '../constants';

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

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-slate-700">{value}</div>
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
);

const Profile: React.FC = () => {
    const { user, userProgress, selectedLanguage, logout, setView } = useLugha();

    const lessonsCompleted = selectedLanguage ? userProgress.completedLessons[selectedLanguage.id]?.length || 0 : 0;
    const totalLessons = selectedLanguage ? LESSON_DATA[selectedLanguage.id]?.levels.reduce((acc, level) => acc + level.lessons.length, 0) : 0;
    const completionPercentage = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

    return (
        <div className="p-4">
            <PageHeader title="Profile" onBack={() => setView('dashboard')} />

            <div className="flex flex-col items-center mb-8">
                 <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                 </div>
                 <h2 className="text-2xl font-bold">{user?.name}</h2>
                 <p className="text-slate-500">{selectedLanguage?.name} Learner</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard label="Total XP" value={userProgress.xp} icon={'⚡️'} />
                <StatCard label="Streak" value={`${userProgress.streak} Days`} icon={'🔥'} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                 <h3 className="text-lg font-bold text-slate-700 mb-2">Course Progress</h3>
                 <p className="text-slate-500 mb-4">{`You've completed ${lessonsCompleted} of ${totalLessons} lessons.`}</p>
                 <div className="w-full bg-slate-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                 </div>
            </div>

            <button
                onClick={logout}
                className="w-full flex items-center justify-center py-3 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                aria-label="Logout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-semibold">Logout</span>
            </button>
        </div>
    );
};

export default Profile;
