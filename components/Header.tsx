import React from 'react';

interface HeaderProps {
    xp: number;
    streak: number;
    onAvatarClick: () => void;
    onLanguageClick: () => void;
    onDictionaryClick: () => void;
    language: {
        name: string;
        flag: string;
    }
}

const UserAvatar: React.FC<{onClick: () => void}> = ({onClick}) => (
    <button onClick={onClick} className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-2xl shadow-sm transform hover:scale-105 hover:bg-slate-300 transition-all duration-300" aria-label="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    </button>
)

const StatItem: React.FC<{icon: React.ReactNode, value: number, color: string}> = ({ icon, value, color }) => (
    <div className={`flex items-center space-x-2 ${color} bg-opacity-10 rounded-full px-4 py-2`}>
        {icon}
        <span className="font-bold text-lg">{value}</span>
    </div>
);


const Header: React.FC<HeaderProps> = ({ xp, streak, onAvatarClick, onLanguageClick, language, onDictionaryClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm mb-6">
      <button onClick={onLanguageClick} className="flex items-center space-x-3 rounded-lg p-2 -ml-2 hover:bg-slate-100 transition-colors duration-200" aria-label="Switch language">
         <span className="text-3xl">{language.flag}</span>
         <div className="flex items-center space-x-1">
            <h1 className="text-2xl font-bold text-slate-700">{language.name}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
         </div>
      </button>
      <div className="flex items-center space-x-3">
        <StatItem 
          icon={<span className="text-xl">⚡️</span>} 
          value={xp}
          color="text-yellow-500"
        />
        <StatItem 
          icon={<span className="text-xl">🔥</span>} 
          value={streak}
          color="text-orange-500"
        />
        <button onClick={onDictionaryClick} className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-2xl shadow-sm transform hover:scale-105 hover:bg-slate-300 transition-all duration-300" aria-label="Open Dictionary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        </button>
        <UserAvatar onClick={onAvatarClick} />
      </div>
    </header>
  );
};

export default Header;
