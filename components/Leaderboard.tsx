import React, { useMemo } from 'react';
import { useLugha } from '../hooks/useLugha';
import { LEADERBOARD_DATA } from '../constants';

const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Back">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="flex-grow text-center text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
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
    
    const color = selectedLanguage?.color.match(/bg-(\w+)-(\d+)/);
    const themeColorName = color ? color[1] : 'blue';
    
    const highlightBg = `bg-${themeColorName}-100`;
    const highlightBorder = `border-${themeColorName}-300`;
    const highlightText = `text-${themeColorName}-600`;


    return (
        <div className="p-1">
            <PageHeader title="Leaderboard" onBack={() => setView('dashboard')} />

            <ul className="space-y-3">
                {rankedUsers.map(rankedUser => (
                    <li
                        key={`${rankedUser.name}-${rankedUser.rank}`}
                        className={`flex items-center p-4 rounded-xl shadow-sm transition-transform duration-200 border ${rankedUser.isCurrentUser ? `${highlightBg} ${highlightBorder} border-2` : 'bg-white border-slate-200/80'}`}
                    >
                        <div className="text-xl font-bold text-slate-500 w-10">{rankedUser.rank}</div>
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div className="flex-grow font-bold text-slate-800 text-lg">
                            {rankedUser.name}
                            {rankedUser.isCurrentUser && <span className={`ml-2 text-sm font-semibold ${highlightText}`}>(You)</span>}
                        </div>
                        <div className="flex items-center font-extrabold text-yellow-500">
                            <span className="text-xl mr-1">⚡️</span>
                            <span className="text-lg">{rankedUser.xp}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;