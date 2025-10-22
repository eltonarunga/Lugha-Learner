
import React, { useState } from 'react';
import { useLugha } from '../hooks/useLugha';
import { getGeminiAI } from '../lib/gemini';

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

const CreativeCorner: React.FC = () => {
    const { setView, selectedLanguage } = useLugha();
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult('');

        try {
            const ai = getGeminiAI();
            const fullPrompt = `You are an expert creative writer and ${selectedLanguage?.name} cultural expert. The user wants you to perform a complex creative task. Use your deep thinking capabilities to provide a high-quality, detailed, and imaginative response. Here is the user's request: "${prompt}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: fullPrompt,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });

            setResult(response.text);

        } catch (err) {
            console.error('Error in Creative Corner:', err);
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. The AI might be pondering too hard. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-1">
            <PageHeader title="Creative Corner" onBack={() => setView('dashboard')} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <p className="text-slate-600 mb-4 text-center">Challenge our most powerful AI model with a complex creative request. Write a short story, a poem, or ask a deep question!</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a short story about a brave warrior from the Maasai tribe who learns to speak to animals..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                    disabled={loading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                    {loading ? 'Thinking Deeply...' : 'Generate Response'}
                </button>
            </div>
            
            {loading && (
                <div className="text-center p-8 mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
                    <p className="text-slate-600 font-semibold mt-4">The AI is engaging its advanced reasoning. This may take a moment...</p>
                </div>
            )}

            {error && <p className="text-red-500 text-center mt-6 p-4 bg-red-50 rounded-lg">{error}</p>}

            {result && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Result</h2>
                    <div className="text-slate-700 space-y-4 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreativeCorner;
