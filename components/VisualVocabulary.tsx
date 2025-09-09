import React, { useState, useRef, useEffect } from 'react';
import { useLugha } from '../hooks/useLugha';
import { GoogleGenAI, Type } from '@google/genai';

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

type VocabularyItem = {
    englishName: string;
    translation: string;
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const VisualVocabulary: React.FC = () => {
    const { setView, selectedLanguage } = useLugha();
    const [imageData, setImageData] = useState<{url: string, part: any} | null>(null);
    const [results, setResults] = useState<VocabularyItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
            setImageData(null);
            setResults([]);
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted. You can still upload a file.");
            setIsCameraOn(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false);
    };

    useEffect(() => {
        return () => stopCamera(); // Cleanup on unmount
    }, []);

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            const part = { inlineData: { data: dataUrl.split(',')[1], mimeType: 'image/jpeg' } };
            setImageData({ url: dataUrl, part });
            stopCamera();
        }
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const part = await fileToGenerativePart(file);
            setImageData({ url: URL.createObjectURL(file), part });
            stopCamera();
            setResults([]);
            setError(null);
        }
    };

    const analyzeImage = async () => {
        if (!imageData) return;
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const textPart = { text: `Identify the main objects in this image. For each object, provide its name in English and its translation in ${selectedLanguage?.name}.` };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imageData.part, textPart] },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            items: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        englishName: { type: Type.STRING },
                                        translation: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const parsed = JSON.parse(response.text);
            setResults(parsed.items || []);
        } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze the image. Please try a different one.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-1">
            <PageHeader title="Visual Vocabulary" onBack={() => setView('dashboard')} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
                <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                    {isCameraOn ? (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : imageData ? (
                        <img src={imageData.url} alt="Selected" className="w-full h-full object-contain" />
                    ) : (
                        <p className="text-slate-500">Camera off or no image selected</p>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden" />

                <div className="grid grid-cols-2 gap-3">
                    {isCameraOn ? (
                        <>
                            <button onClick={takePicture} className="bg-red-500 text-white font-bold py-3 rounded-lg shadow-md">Take Picture</button>
                            <button onClick={stopCamera} className="bg-slate-500 text-white font-bold py-3 rounded-lg shadow-md">Stop Camera</button>
                        </>
                    ) : (
                       <>
                         <button onClick={startCamera} className="bg-blue-500 text-white font-bold py-3 rounded-lg shadow-md">Start Camera</button>
                         <label htmlFor="fileUpload" className="cursor-pointer text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors">Upload File</label>
                         <input type="file" id="fileUpload" accept="image/*" className="hidden" onChange={handleFileChange} />
                       </>
                    )}
                </div>
                
                {imageData && !isCameraOn && (
                    <button onClick={analyzeImage} disabled={loading} className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 disabled:bg-slate-400">
                        {loading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                )}
            </div>
            
            {loading && <div className="text-center p-4">Analyzing image...</div>}
            {error && <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</p>}

            {results.length > 0 && (
                <div className="space-y-2">
                    {results.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200/80 flex justify-between items-center">
                            <span className="font-semibold text-slate-700">{item.englishName}</span>
                            <span className="font-bold text-lg text-blue-600">{item.translation}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VisualVocabulary;