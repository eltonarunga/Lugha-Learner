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

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const AdventureMode: React.FC = () => {
    const { setView, selectedLanguage } = useLugha();
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [story, setStory] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setStory('');
            setError(null);
        }
    };

    const generateStory = async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setError(null);
        setStory('');

        try {
            const ai = getGeminiAI();
            const imagePart = await fileToGenerativePart(image);
            const textPart = { text: `Create a short, exciting adventure story for a language learner. The story should be set in Kenya, exploring its beautiful landscapes. The main character is the person/creature in this image. The story should be simple and mostly in English, but introduce and repeat some simple ${selectedLanguage?.name} words related to the environment (e.g., journey, tree, river, animal, sun). Make sure to provide the English translation for the new words in parentheses the first time they appear. Keep the story to 4-5 paragraphs.` };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            
            setStory(response.text);

        } catch (err) {
            console.error('Error generating story:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate story. The storyteller might be on a break. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-1">
            <PageHeader title="Adventure Mode" onBack={() => setView('dashboard')} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <p className="text-center text-slate-600 mb-4">Upload a picture of yourself or any character to start a new adventure in Kenya!</p>
                <div className="flex flex-col items-center gap-4">
                    <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <label htmlFor="imageUpload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                        Choose an Image
                    </label>
                    {imageUrl && <img src={imageUrl} alt="Character" className="w-48 h-48 object-cover rounded-xl shadow-md" />}
                    <button onClick={generateStory} disabled={!image || loading} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 disabled:bg-slate-400 transition-all transform hover:scale-105 disabled:hover:scale-100">
                        {loading ? 'Creating Story...' : 'Start Adventure'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center p-8 mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500 mx-auto"></div>
                    <p className="text-slate-600 font-semibold mt-4">Our writer is crafting your unique tale...</p>
                </div>
            )}

            {error && <p className="text-red-500 text-center mt-6 p-4 bg-red-50 rounded-lg">{error}</p>}
            
            {story && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Adventure!</h2>
                    <div className="text-slate-700 space-y-4 leading-relaxed">
                        {story.split('\n').filter(p => p.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdventureMode;
