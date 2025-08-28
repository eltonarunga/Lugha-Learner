import React, { useState, useMemo } from 'react';
import { LESSON_DATA } from '../constants';
import { useLugha } from '../hooks/useLugha';
import { QuizQuestion, QuestionType } from '../types';
import ProgressBar from './ProgressBar';

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
      return selected === option ? 'bg-blue-500 text-white' : 'bg-white hover:bg-slate-100';
    }
    if (option === question.answer) {
      return 'bg-green-500 text-white';
    }
    if (option === selected && option !== question.answer) {
      return 'bg-red-500 text-white';
    }
    return 'bg-slate-200 text-slate-500';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map(option => (
          <button key={option} onClick={() => handleSelect(option)} disabled={submitted} className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 font-semibold transition-all duration-200 ${getButtonClass(option)}`}>
            {option}
          </button>
        ))}
      </div>
      {!submitted && (
        <button onClick={handleSubmit} disabled={!selected} className="mt-6 w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
          Check
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

  return (
    <div>
      <div className="bg-slate-100 p-6 rounded-lg text-center mb-6">
        <p className="text-2xl text-slate-700">
          {question.questionParts[0]}
          <span className="inline-block bg-white border-b-2 border-slate-400 focus-within:border-blue-500 mx-2 px-2">
            <input
              type="text"
              value={input}
              onChange={(e) => !submitted && setInput(e.target.value)}
              className="outline-none bg-transparent text-center font-bold text-blue-600 w-24"
              disabled={submitted}
            />
          </span>
          {question.questionParts[1]}
        </p>
      </div>
       <form onSubmit={handleSubmit}>
         {!submitted && (
          <button type="submit" disabled={!input} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
            Check
          </button>
        )}
       </form>
       {submitted && (
        <div className={`mt-4 p-4 rounded-lg text-white font-bold text-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
          {isCorrect ? 'Correct!' : `Correct answer: ${question.answer}`}
        </div>
       )}
    </div>
  );
};


const LessonView: React.FC<{ language: string, lessonId: number }> = ({ language, lessonId }) => {
  const { setView, setActiveLessonId, completeLesson } = useLugha();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');

  const lesson = useMemo(() => {
    return LESSON_DATA[language]?.levels.flatMap(l => l.lessons).find(l => l.id === lessonId);
  }, [language, lessonId]);

  if (!lesson) return <div>Lesson not found!</div>;

  const currentQuestion = lesson.questions[currentIndex];

  const handleAnswer = (correct: boolean) => {
    setAnswerState(correct ? 'correct' : 'incorrect');
  };

  const handleContinue = () => {
    if (currentIndex < lesson.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswerState('unanswered');
    } else {
      // Lesson complete
      completeLesson(language, lessonId, lesson.xp);
      setActiveLessonId(null);
      setView('dashboard');
    }
  };

  const handleExit = () => {
    setActiveLessonId(null);
    setView('dashboard');
  };

  const getFeedbackBgColor = () => {
      if (answerState === 'correct') return 'bg-green-100 border-green-500';
      if (answerState === 'incorrect') return 'bg-red-100 border-red-500';
      return 'bg-transparent border-transparent';
  }

  return (
    <div className="flex flex-col h-[90vh]">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={handleExit} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Exit lesson">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <ProgressBar current={currentIndex} total={lesson.questions.length} />
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
            {currentQuestion.type === QuestionType.MCQ && <QuizMCQ question={currentQuestion} onAnswer={handleAnswer} />}
            {currentQuestion.type === QuestionType.FILL_IN_BLANK && <QuizFillInBlank question={currentQuestion} onAnswer={handleAnswer} />}
        </div>
        
        {answerState !== 'unanswered' && (
            <div className={`p-4 rounded-t-2xl border-t-4 transition-all duration-300 ${getFeedbackBgColor()}`}>
               <div className="flex justify-between items-center">
                    <div>
                        <h3 className={`font-bold text-xl ${answerState === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                            {answerState === 'correct' ? "You are correct!" : "Incorrect."}
                        </h3>
                        <p className="text-slate-600">{currentQuestion.translation}</p>
                    </div>
                    <button onClick={handleContinue} className={`px-8 py-3 rounded-lg text-white font-bold shadow-md transition-colors ${answerState === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                        Continue
                    </button>
               </div>
            </div>
        )}
    </div>
  );
};

export default LessonView;