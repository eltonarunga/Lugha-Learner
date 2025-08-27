
import React from 'react';
import { useLugha } from '../hooks/useLugha';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

const LanguageCard: React.FC<{ language: Language, onSelect: () => void }> = ({ language, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full ${language.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4`}
  >
    <span className="text-5xl">{language.flag}</span>
    <span className="text-2xl font-bold">{language.name}</span>
  </button>
);


const LanguageSelector: React.FC = () => {
  const { selectLanguage } = useLugha();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Welcome to</h1>
      <h2 className="text-5xl font-extrabold text-green-600 mb-8">Lugha Learner</h2>
      <p className="text-xl text-slate-600 mb-12 text-center">Choose a language to start learning!</p>
      <div className="w-full max-w-sm space-y-4">
        {LANGUAGES.map(lang => (
          <LanguageCard key={lang.id} language={lang} onSelect={() => selectLanguage(lang.id)} />
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
