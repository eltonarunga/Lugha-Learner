import React, { useState, useMemo, useEffect } from 'react';
import { LESSON_DATA } from '../constants';
import { useLugha } from '../hooks/useLugha';
import { QuizQuestion, QuestionType } from '../types';
import ProgressBar from './ProgressBar';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// Component for Multiple Choice Questions
const QuizMCQ: React.FC<{ question: Extract<QuizQuestion, { type: QuestionType.MCQ }>, onAnswer: (correct: boolean) => void }> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onAnswer(selected === question.answer);
  };

  const getButtonClass = (option: string) => {
    if (!submitted) {
      return selected === option 
        ? 'bg-blue-100 border-blue-500 text-blue-600' 
        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300';
    }
    if (option === question.answer) {
      return 'bg-green-100 border-green-500 text-green-600';
    }
    if (option === selected && option !== question.answer) {
      return 'bg-red-100 border-red-500 text-red-600';
    }
    return 'bg-slate-100 border-slate-200 text-slate-500 opacity-80';
  };
  
  const getIconContainerClass = (option: string) => {
    if (!submitted) return 'hidden';
    if (option === question.answer) return 'bg-green-500';
    if (option === selected) return 'bg-red-500';
    return 'hidden';
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 tracking-tight">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map(option => (
          <button 
            key={option} 
            onClick={() => handleSelect(option)} 
            disabled={submitted} 
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 font-semibold transition-all duration-200 text-lg ${getButtonClass(option)}`}
          >
            <span>{option}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconContainerClass(option)}`}>
               {option === question.answer ? <CheckIcon /> : <CrossIcon />}
            </div>
          </button>
        ))}
      </div>
      {!submitted && (
        <button 
          onClick={handleSubmit} 
          disabled={!selected} 
          className="mt-8 w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          Check Answer
        </button>
      )}
    </div>
  );
};

// Component for Fill-in-the-Blank Questions
const QuizFillInBlank: React.FC<{ question: Extract<QuizQuestion, { type: QuestionType.FILL_IN_BLANK }>, onAnswer: (correct: boolean) => void }> = ({ question, onAnswer }) => {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted || !input) return;
    setSubmitted(true);
    onAnswer(input.trim().toLowerCase() === question.answer.toLowerCase());
  };

  const isCorrect = input.trim().toLowerCase() === question.answer.toLowerCase();
  
  const borderColor = submitted ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-slate-400 focus-within:border-blue-500';

  return (
    <div>
      <div className="bg-slate-100 p-8 rounded-xl text-center mb-6 border border-slate-200">
        <p className="text-3xl text-slate-800 tracking-tight leading-relaxed">
          {question.questionParts[0]}
          <span className={`inline-block bg-white border-b-2 mx-2 px-2 transition-colors ${borderColor}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => !submitted && setInput(e.target.value)}
              className="outline-none bg-transparent text-center font-bold text-blue-600 w-32 text-3xl"
              disabled={submitted}
              autoFocus
            />
          </span>
          {question.questionParts[1]}
        </p>
      </div>
       <form onSubmit={handleSubmit}>
         {!submitted && (
          <button type="submit" disabled={!input} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:hover:scale-100">
            Check
          </button>
        )}
       </form>
    </div>
  );
};


const LessonView: React.FC<{ language: string, lessonId: number }> = ({ language, lessonId }) => {
  const { setView, setActiveLessonId, completeLesson } = useLugha();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [showFeedback, setShowFeedback] = useState(false);

  const lesson = useMemo(() => {
    return LESSON_DATA[language]?.levels.flatMap(l => l.lessons).find(l => l.id === lessonId);
  }, [language, lessonId]);
  
  const handleContinue = () => {
    if (!lesson) return;
    setShowFeedback(false);
    
    // Add a small delay for the feedback panel to slide out
    setTimeout(() => {
      if (currentIndex < lesson.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnswerState('unanswered');
      } else {
        // Lesson complete
        completeLesson(language, lessonId, lesson.xp);
        setActiveLessonId(null);
        setView('dashboard');
      }
    }, 300);
  };

  useEffect(() => {
    if (answerState === 'correct' || answerState === 'incorrect') {
        const timer = setTimeout(() => {
            setShowFeedback(true);
        }, 100); // Small delay to trigger transition
        return () => clearTimeout(timer);
    }
  }, [answerState]);


  if (!lesson) return <div>Lesson not found!</div>;

  const currentQuestion = lesson.questions[currentIndex];

  const handleAnswer = (correct: boolean) => {
    setAnswerState(correct ? 'correct' : 'incorrect');
  };

  const handleExit = () => {
    if(confirm('Are you sure you want to exit? Your progress in this lesson will be lost.')) {
        setActiveLessonId(null);
        setView('dashboard');
    }
  };

  const feedbackBgColor = answerState === 'correct' ? 'bg-green-100' : 'bg-red-100';
  const feedbackTextColor = answerState === 'correct' ? 'text-green-600' : 'text-red-600';
  const feedbackButtonColor = answerState === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const feedbackTitle = answerState === 'correct' ? "You are correct!" : "Incorrect";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={handleExit} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Exit lesson">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <ProgressBar current={currentIndex + (answerState !== 'unanswered' ? 1 : 0) } total={lesson.questions.length} />
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
            {currentQuestion.type === QuestionType.MCQ && <QuizMCQ key={currentIndex} question={currentQuestion} onAnswer={handleAnswer} />}
            {currentQuestion.type === QuestionType.FILL_IN_BLANK && <QuizFillInBlank key={currentIndex} question={currentQuestion} onAnswer={handleAnswer} />}
        </div>
        
        <div className={`fixed bottom-0 left-0 right-0 w-full transition-transform duration-300 ease-in-out ${showFeedback ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className={`p-6 shadow-2xl-top rounded-t-2xl ${feedbackBgColor}`}>
               <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div>
                        <h3 className={`font-bold text-2xl ${feedbackTextColor}`}>
                            {feedbackTitle}
                        </h3>
                        {answerState !== 'unanswered' && <p className="text-slate-700 mt-1 font-medium">{currentQuestion.translation}</p>}
                    </div>
                    <button onClick={handleContinue} className={`px-10 py-4 rounded-xl text-white font-bold shadow-md transition-colors ${feedbackButtonColor}`}>
                        Continue
                    </button>
               </div>
            </div>
        </div>
    </div>
  );
};

export default LessonView;