import React from 'react';
import { useLugha } from '../hooks/useLugha';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

const LanguageCard: React.FC<{ language: Language, onSelect: () => void }> = ({ language, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-black rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 flex items-center space-x-6 relative overflow-hidden group`}
    style={{
      background: `linear-gradient(135deg, ${language.color.replace('bg-', 'var(--tw-color-')}) 0%, ${language.color.replace('bg-', 'var(--tw-color-').replace('500', '600')}) 100%)`
    }}
  >
    <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${language.color} opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
    <span className="text-5xl drop-shadow-md">{language.flag}</span>
    <span className="text-2xl font-bold tracking-wide drop-shadow-sm">{language.name}</span>
  </button>
);


const LanguageSelector: React.FC = () => {
  const { selectLanguage, selectedLanguage, setView } = useLugha();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {selectedLanguage ? (
        <div className="w-full max-w-sm text-center mb-12 relative">
          <button
            onClick={() => setView('dashboard')}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Back to dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Switch Language</h1>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tighter">Welcome to</h1>
          <h2 className="text-5xl font-extrabold text-green-600 mb-8 tracking-tighter">Lugha Learner</h2>
          <p className="text-xl text-slate-600 mb-12 text-center">Choose a language to start learning!</p>
        </>
      )}
      <div className="w-full max-w-sm space-y-5">
        {LANGUAGES.map(lang => (
          <LanguageCard key={lang.id} language={lang} onSelect={() => selectLanguage(lang.id)} />
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;