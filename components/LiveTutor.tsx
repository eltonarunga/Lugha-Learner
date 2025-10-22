
import React, { useState, useEffect, useRef } from 'react';
import { useLugha } from '../hooks/useLugha';
import { getGeminiAI } from '../lib/gemini';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { encode, decode, decodeAudioData } from '../lib/audioUtils';

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

type TranscriptMessage = {
    role: 'user' | 'model';
    text: string;
    isFinal: boolean;
};

const LiveTutor: React.FC = () => {
    const { setView, selectedLanguage } = useLugha();
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LISTENING' | 'ERROR'>('IDLE');
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopSession();
        };
    }, []);

    const startSession = async () => {
        setStatus('CONNECTING');
        setError(null);
        setTranscript([]);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support audio recording.');
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // FIX: Cast window to any to support webkitAudioContext for older browsers.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to any to support webkitAudioContext for older browsers.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const ai = getGeminiAI();
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a friendly and encouraging ${selectedLanguage?.name} language tutor. Keep your responses short and conversational. Guide the user to practice speaking.`,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setStatus('LISTENING');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createPcmBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: handleServerMessage,
                    onerror: (e) => {
                        console.error('Session error:', e);
                        setError('A session error occurred. Please try again.');
                        setStatus('ERROR');
                        stopSession();
                    },
                    onclose: () => {
                       // Handled by user action
                    },
                },
            });
        } catch (err) {
            console.error('Failed to start session:', err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to start session: ${message}`);
            setStatus('ERROR');
        }
    };

    const stopSession = () => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        
        outputSourcesRef.current.forEach(source => source.stop());
        outputSourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        setStatus('IDLE');
    };

    const handleServerMessage = async (message: LiveServerMessage) => {
        // Handle transcription
        if (message.serverContent?.inputTranscription || message.serverContent?.outputTranscription || message.serverContent?.turnComplete) {
            setTranscript(prev => processTranscription(prev, message.serverContent!));
        }

        // Handle audio output
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
        if (base64Audio && outputAudioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContextRef.current.destination);
            source.addEventListener('ended', () => {
                outputSourcesRef.current.delete(source);
            });
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            outputSourcesRef.current.add(source);
        }

        // Handle interruption
        if (message.serverContent?.interrupted) {
            outputSourcesRef.current.forEach(source => source.stop());
            outputSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
        }
    };

    const processTranscription = (currentTranscript: TranscriptMessage[], content: LiveServerMessage['serverContent']): TranscriptMessage[] => {
        let newTranscript = [...currentTranscript];
        
        const lastUserTurn = newTranscript.slice().reverse().find(t => t.role === 'user');
        if (content.inputTranscription?.text) {
            if (lastUserTurn && !lastUserTurn.isFinal) {
                lastUserTurn.text += content.inputTranscription.text;
            } else {
                newTranscript.push({ role: 'user', text: content.inputTranscription.text, isFinal: false });
            }
        }
        
        const lastModelTurn = newTranscript.slice().reverse().find(t => t.role === 'model');
        if (content.outputTranscription?.text) {
            if (lastModelTurn && !lastModelTurn.isFinal) {
                lastModelTurn.text += content.outputTranscription.text;
            } else {
                newTranscript.push({ role: 'model', text: content.outputTranscription.text, isFinal: false });
            }
        }

        if (content.turnComplete) {
             newTranscript = newTranscript.map(t => ({ ...t, isFinal: true }));
        }

        return newTranscript;
    };
    
    const createPcmBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
    };

    return (
        <div className="p-1 flex flex-col h-[calc(100vh-3rem)]">
            <PageHeader title="Live Tutor" onBack={() => setView('dashboard')} />

            <div className="flex-grow bg-white p-4 rounded-2xl shadow-inner border border-slate-200/80 overflow-y-auto space-y-4">
                {transcript.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {status === 'LISTENING' && transcript.length === 0 && (
                     <p className="text-center text-slate-500 p-8">Start speaking to your tutor...</p>
                )}
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-3">
                 <p className="font-semibold text-slate-600 h-6">
                    {status === 'IDLE' && 'Press Start to talk'}
                    {status === 'CONNECTING' && 'Connecting...'}
                    {status === 'LISTENING' && <span className="flex items-center gap-2 text-green-600">Listening <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span></span>}
                    {status === 'ERROR' && <span className="text-red-500">{error || 'An error occurred'}</span>}
                </p>
                {status === 'IDLE' || status === 'ERROR' ? (
                     <button onClick={startSession} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all">Start Conversation</button>
                ) : (
                     <button onClick={stopSession} className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-all">Stop Conversation</button>
                )}
            </div>
        </div>
    );
};

export default LiveTutor;