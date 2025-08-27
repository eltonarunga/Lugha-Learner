
import { Language, LanguageData, QuestionType } from './types';

export const LANGUAGES: Language[] = [
  { id: 'swahili', name: 'Swahili', flag: '🇰🇪', color: 'bg-green-500' },
  { id: 'luo', name: 'Luo', flag: '🇰🇪', color: 'bg-blue-500' },
  { id: 'kikuyu', name: 'Kikuyu', flag: '🇰🇪', color: 'bg-red-500' },
  { id: 'kalenjin', name: 'Kalenjin', flag: '🇰🇪', color: 'bg-yellow-500' },
];

export const LESSON_DATA: { [key: string]: LanguageData } = {
  swahili: {
    name: 'Swahili',
    levels: [
      {
        id: 'swahili-beginner',
        name: 'Beginner',
        description: 'Start with the basics of Swahili.',
        lessons: [
          {
            id: 1,
            title: 'Greetings',
            xp: 10,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'How do you say "Hello"?',
                options: ['Jambo', 'Kwaheri', 'Asante', 'Ndiyo'],
                answer: 'Jambo',
                translation: '"Jambo" is a common greeting.',
              },
              {
                type: QuestionType.FILL_IN_BLANK,
                questionParts: ['Habari ____?', ' Gani'],
                answer: 'gani',
                translation: '"Habari gani?" means "How are you?".',
              },
              {
                type: QuestionType.MCQ,
                question: 'What is "Thank you"?',
                options: ['Tafadhali', 'Asante', 'Karibu', 'Samahani'],
                answer: 'Asante',
                translation: '"Asante" means "Thank you".',
              },
            ],
          },
          {
            id: 2,
            title: 'Numbers 1-3',
            xp: 10,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'What is "One"?',
                options: ['Moja', 'Mbili', 'Tatu', 'Nne'],
                answer: 'Moja',
                translation: '"Moja" means "One".',
              },
              {
                 type: QuestionType.MCQ,
                question: 'What is "Two"?',
                options: ['Moja', 'Mbili', 'Tatu', 'Nne'],
                answer: 'Mbili',
                translation: '"Mbili" means "Two".',
              },
            ],
          },
          {
            id: 3,
            title: 'Food',
            xp: 15,
            questions: []
          }
        ],
      },
       {
        id: 'swahili-intermediate',
        name: 'Intermediate',
        description: 'Build your vocabulary and grammar.',
        lessons: [
            { id: 4, title: 'Tenses', xp: 20, questions: [] },
            { id: 5, title: 'Shopping', xp: 20, questions: [] },
        ]
      }
    ],
  },
  // Add placeholder data for other languages
  luo: {
    name: 'Luo',
    levels: [
      {
        id: 'luo-beginner',
        name: 'Beginner',
        description: 'Start with the basics of Luo.',
        lessons: [{ id: 1, title: 'Greetings', xp: 10, questions: [] }],
      },
    ],
  },
  kikuyu: {
    name: 'Kikuyu',
    levels: [
      {
        id: 'kikuyu-beginner',
        name: 'Beginner',
        description: 'Start with the basics of Kikuyu.',
        lessons: [{ id: 1, title: 'Greetings', xp: 10, questions: [] }],
      },
    ],
  },
  kalenjin: {
    name: 'Kalenjin',
    levels: [
      {
        id: 'kalenjin-beginner',
        name: 'Beginner',
        description: 'Start with the basics of Kalenjin.',
        lessons: [{ id: 1, title: 'Greetings', xp: 10, questions: [] }],
      },
    ],
  },
};
