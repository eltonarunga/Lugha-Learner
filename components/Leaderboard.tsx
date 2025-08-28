import React, { useMemo } from 'react';
import { useLugha } from '../hooks/useLugha';
import { LEADERBOARD_DATA } from '../constants';

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


const Leaderboard: React.FC = () => {
    const { user, userProgress, setView, selectedLanguage } = useLugha();

    const rankedUsers = useMemo(() => {
        const currentUserData = {
            name: user?.name || 'Guest',
            xp: userProgress.xp,
            isCurrentUser: true,
        };

        const allUsers = [...LEADERBOARD_DATA.map(u => ({...u, isCurrentUser: false})), currentUserData];

        return allUsers
            .sort((a, b) => b.xp - a.xp)
            .map((u, index) => ({...u, rank: index + 1 }));

    }, [user, userProgress]);
    
    const themeColor = selectedLanguage?.color || 'bg-blue-500';
    const highlightBg = themeColor.replace('500', '100');
    const highlightBorder = themeColor.replace('bg', 'border');

    return (
        <div className="p-4">
            <PageHeader title="Leaderboard" onBack={() => setView('dashboard')} />

            <ul className="space-y-3">
                {rankedUsers.map(rankedUser => (
                    <li
                        key={rankedUser.name}
                        className={`flex items-center p-4 rounded-xl shadow-sm transition-transform duration-200 ${rankedUser.isCurrentUser ? `${highlightBg} border-2 ${highlightBorder}` : 'bg-white'}`}
                    >
                        <div className="text-xl font-bold text-slate-500 w-10">{rankedUser.rank}</div>
                        <div className="flex-grow font-bold text-slate-700 text-lg">
                            {rankedUser.name}
                            {rankedUser.isCurrentUser && <span className="ml-2 text-sm font-semibold text-blue-600">(You)</span>}
                        </div>
                        <div className="flex items-center font-extrabold text-yellow-500">
                            <span className="text-xl mr-1">⚡️</span>
                            <span>{rankedUser.xp}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
