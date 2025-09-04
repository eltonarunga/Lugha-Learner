import React, { useState, useMemo } from 'react';
import { useLugha } from '../hooks/useLugha';
import { LESSON_DATA } from '../constants';
import { DictionaryEntry } from '../types';

const DictionaryView: React.FC = () => {
    const { selectedLanguage, setView } = useLugha();
    const [searchTerm, setSearchTerm] = useState('');

    const dictionary = useMemo(() => {
        if (!selectedLanguage) return [];
        return LESSON_DATA[selectedLanguage.id]?.dictionary || [];
    }, [selectedLanguage]);

    const filteredDictionary = useMemo(() => {
        if (!searchTerm) return dictionary;
        return dictionary.filter(entry =>
            entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, dictionary]);

    if (!selectedLanguage) {
        return <div>No language selected.</div>;
    }

    return (
        <div className="p-1 flex flex-col h-[calc(100vh-3rem)]">
            <div className="flex items-center mb-6 relative">
                <button
                    onClick={() => setView('dashboard')}
                    className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                    aria-label="Back to dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold text-slate-800 text-center flex-grow tracking-tight">
                    {selectedLanguage.name} Dictionary
                </h1>
                <div className="w-8"></div>
            </div>

            <div className="relative mb-6">
                 <input
                    type="text"
                    placeholder="Search dictionary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                 />
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {filteredDictionary.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredDictionary.map((entry, index) => (
                            <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200/80">
                                <h3 className="text-lg font-bold text-slate-800">{entry.word}</h3>
                                <p className="text-slate-600 mt-1">{entry.definition}</p>
                                {entry.example && (
                                    <p className="text-sm text-slate-500 italic mt-2">e.g., "{entry.example}"</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16">
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6 6" />
                        </svg>
                        <p className="text-slate-500 mt-4 font-semibold">No entries found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DictionaryView;