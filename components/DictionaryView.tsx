
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLugha } from '../hooks/useLugha';
import { LESSON_DATA } from '../constants';
import { DictionaryEntry } from '../types';
import { getGeminiAI } from '../lib/gemini';
import { Modality } from '@google/genai';
import { decode, decodeAudioData } from '../lib/audioUtils';

const DictionaryView: React.FC = () => {
    const { selectedLanguage, setView } = useLugha();
    const [searchTerm, setSearchTerm] = useState('');
    const [playingWord, setPlayingWord] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Safari requires the audio context to be created after a user gesture,
        // but we initialize it here and resume it on the first click.
        // FIX: Cast window to any to support webkitAudioContext for older browsers.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        return () => {
            audioContextRef.current?.close();
        }
    }, []);

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

    const handlePlayAudio = async (word: string) => {
        if (playingWord || !audioContextRef.current) return;
        
        // Ensure AudioContext is running
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        setPlayingWord(word);
        setError(null);

        try {
            const ai = getGeminiAI();
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: word }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
                source.onended = () => setPlayingWord(null);
            } else {
                throw new Error("No audio data received from API.");
            }
        } catch (err) {
            console.error("TTS Error:", err);
            setError("Sorry, couldn't play audio. Please try again.");
            setPlayingWord(null);
        }
    };

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
            
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {filteredDictionary.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredDictionary.map((entry, index) => (
                            <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200/80">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">{entry.word}</h3>
                                    <button onClick={() => handlePlayAudio(entry.word)} disabled={!!playingWord} className="p-2 rounded-full hover:bg-slate-100 disabled:cursor-not-allowed">
                                        {playingWord === entry.word ? (
                                            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
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