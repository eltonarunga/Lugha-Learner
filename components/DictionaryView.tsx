import React, { useState } from 'react';
import { useLugha } from '../hooks/useLugha';
import { getDictionaryDefinition } from '../api';
import { DictionaryEntry } from '../types';

const DictionaryView: React.FC = () => {
    const { selectedLanguage, setView } = useLugha();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DictionaryEntry | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm || !selectedLanguage) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const definition = await getDictionaryDefinition(searchTerm, selectedLanguage.name);

        setIsLoading(false);
        if (definition) {
            setResult({
                word: searchTerm,
                ...definition,
            });
        } else {
            setError(`Could not find a definition for "${searchTerm}". Please try another word.`);
        }
    };

    if (!selectedLanguage) {
        return <div>No language selected.</div>;
    }

    return (
        <div className="p-4 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-6 relative">
                <button
                    onClick={() => setView('dashboard')}
                    className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                    aria-label="Back to dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold text-slate-800 text-center absolute left-1/2 -translate-x-1/2">
                    {selectedLanguage.name} Dictionary
                </h1>
            </div>

            <form onSubmit={handleSearch} className="relative mb-6">
                 <input
                    type="text"
                    placeholder="Enter a word..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-20 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                 />
                 <button type="submit" disabled={isLoading || !searchTerm} className="absolute inset-y-0 right-0 px-4 m-1.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-slate-400">
                    {isLoading ? '...' : 'Search'}
                 </button>
            </form>
            
            <div className="flex-grow overflow-y-auto pr-2">
                {isLoading && (
                    <div className="text-center py-10">
                        <p className="text-slate-500">Looking up definition...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                {result && (
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-slate-800 capitalize">{result.word}</h3>
                        <p className="text-slate-700 mt-2 text-lg">{result.definition}</p>
                        {result.example && (
                            <p className="text-md text-slate-500 italic mt-4">e.g., "{result.example}"</p>
                        )}
                    </div>
                )}
                 {!isLoading && !error && !result && (
                    <div className="text-center py-10">
                        <p className="text-slate-500">Search for a word to see its definition.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DictionaryView;
