import { Language, LanguageData, QuestionType, Goal, GoalType } from './types';

export const LANGUAGES: Language[] = [
  { id: 'swahili', name: 'Swahili', flag: '🇰🇪', color: 'bg-green-500' },
  { id: 'luo', name: 'Luo', flag: '🇰🇪', color: 'bg-blue-500' },
  { id: 'kikuyu', name: 'Kikuyu', flag: '🇰🇪', color: 'bg-red-500' },
  { id: 'kalenjin', name: 'Kalenjin', flag: '🇰🇪', color: 'bg-yellow-500' },
];

export const DAILY_GOALS: Goal[] = [
  { id: 'xp-20', title: 'Casual', description: 'Earn 20 XP', type: GoalType.XP, target: 20, icon: '☕️' },
  { id: 'xp-50', title: 'Regular', description: 'Earn 50 XP', type: GoalType.XP, target: 50, icon: '🏃‍♂️' },
  { id: 'lessons-1', title: 'Focused', description: 'Complete 1 lesson', type: GoalType.LESSONS, target: 1, icon: '🎯' },
  { id: 'lessons-3', title: 'Intense', description: 'Complete 3 lessons', type: GoalType.LESSONS, target: 3, icon: '🔥' },
];

export const LEADERBOARD_DATA = [
  { name: 'Aisha', xp: 2540 },
  { name: 'Baraka', xp: 2310 },
  { name: 'Chep', xp: 2050 },
  { name: 'David', xp: 1890 },
  { name: 'Eshe', xp: 1720 },
  { name: 'Faraji', xp: 1500 },
  { name: 'Gitau', xp: 1280 },
  { name: 'Habiba', xp: 1010 },
  { name: 'Imani', xp: 850 },
  { name: 'Jelani', xp: 620 },
];

export const LESSON_DATA: { [key: string]: LanguageData } = {
  swahili: {
    name: 'Swahili',
    levels: [
      {
        id: 'swahili-beginner',
        name: 'Beginner',
        icon: '👋',
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
                questionParts: ['Habari ', '?'],
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
        icon: '🗣️',
        description: 'Build your vocabulary and grammar.',
        lessons: [
            { 
              id: 4, 
              title: 'Epic Adventure', 
              xp: 25, 
              questions: [
                {
                  type: QuestionType.EPIC_ADVENTURE,
                  title: 'The Clever Sungura',
                  prompt: `You are a masterful storyteller for language learners. Create a short, engaging adventure story for a beginner Swahili learner. The story is about a clever rabbit ("sungura") who outsmarts a big lion ("simba").
The story must be simple and mostly in English, but introduce and repeat the Swahili words "sungura" (rabbit) and "simba" (lion) multiple times in a natural way.
Keep the story to about 4-5 paragraphs.
After the story, create a simple multiple-choice question in English about the story to check comprehension.`,
                  translation: "An interactive story to test your skills."
                }
              ] 
            },
            { id: 5, title: 'Shopping', xp: 20, questions: [] },
        ]
      }
    ],
    dictionary: [
      { word: 'Jambo', definition: 'Hello' },
      { word: 'Asante', definition: 'Thank you' },
      { word: 'Chakula', definition: 'Food' },
    ]
  },
  luo: {
    name: 'Luo',
    levels: [
      {
        id: 'luo-beginner',
        name: 'Beginner',
        icon: '👋',
        description: 'Start with the basics of Luo.',
        lessons: [
          {
            id: 1,
            title: 'Greetings',
            xp: 10,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'How do you say "Hello"?',
                options: ['Ber', 'Oyawore', 'Erokamano', 'Dong'],
                answer: 'Ber',
                translation: '"Ber" is a common way to say hello or fine.'
              },
              {
                type: QuestionType.MCQ,
                question: 'How do you say "How are you?"',
                options: ['Idhi nade?', 'Ing\'ama?', 'Erokamano', 'Oriti'],
                answer: 'Idhi nade?',
                translation: '"Idhi nade?" means "How are you?".'
              },
              {
                type: QuestionType.MCQ,
                question: 'What is "Thank you"?',
                options: ['Amosi', 'Ber', 'Erokamano', 'Oriti'],
                answer: 'Erokamano',
                translation: '"Erokamano" means "Thank you".'
              }
            ],
          },
          {
            id: 2,
            title: 'Numbers',
            xp: 15,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'What is "five" in Luo?',
                options: ['Adek', 'Abich', 'Auchiel', 'Abiriyo'],
                answer: 'Abich',
                translation: '"Abich" means "five".'
              },
              {
                type: QuestionType.MCQ,
                question: 'What is "seven" in Luo?',
                options: ['Ang\'wen', 'Aboro', 'Abiriyo', 'Ochiko'],
                answer: 'Abiriyo',
                translation: '"Abiriyo" means "seven".'
              },
               {
                type: QuestionType.MCQ,
                question: 'What is the meaning of "adek"?',
                options: ['One', 'Two', 'Three', 'Four'],
                answer: 'Three',
                translation: '"Adek" means "three".'
              },
            ],
          },
        ],
      },
      {
        id: 'luo-vocab-a',
        name: 'Vocabulary Builder (A)',
        icon: '📚',
        description: 'Learn common words from the dictionary.',
        lessons: [
          {
            id: 3,
            title: 'Words 1',
            xp: 20,
            questions: [
              {
                type: QuestionType.FILL_IN_BLANK,
                questionParts: ["Gibang'o kuon ", "."],
                answer: "abang'a",
                translation: "They are eating plain mush. \"Abang'a\" means dry or plain."
              },
              {
                type: QuestionType.MCQ,
                question: 'What does "abam" mean?',
                options: ['Sideways', 'Twisted', 'Watery', 'Dry'],
                answer: 'Sideways',
                translation: '"Abam" means sideways or to the side.'
              },
              {
                type: QuestionType.FILL_IN_BLANK,
                questionParts: ["Ne giloso wang'yo ", "."],
                answer: "abidha",
                translation: "They fixed the road well. \"Abidha\" means very well or well done."
              },
              {
                type: QuestionType.MCQ,
                question: 'What is an "abawa"?',
                options: ['A patch', 'A spear', 'A sparrow', 'A hut'],
                answer: 'A patch',
                translation: '"Abawa" is a patch for clothing.'
              }
            ]
          },
           {
            id: 4,
            title: 'Words 2',
            xp: 20,
            questions: []
          }
        ]
      }
    ],
    dictionary: [
      { word: "a-", definition: "pronoun: I" },
      { word: "aa", definition: "verb: come from, go from", example: "Ia kanye? (Where did you come from?)" },
      { word: "abach", definition: "noun: paralysis of one side" },
      { word: "abaja", definition: "noun: blade of a large spear" },
      { word: "abam", definition: "adverb: sideways, to the side" },
      { word: "abang'a", definition: "adjective: dry, plain (unaccompanied by sauce or meat)", example: "Gibang'o kuon abang'a. (They are eating plain mush.)" },
      { word: "abich", definition: "adjective: five" },
      { word: "abidha", definition: "adverb: very well, well done", example: "Ne giloso wang'yo abidha. (They fixed the road well.)" },
    ],
  },
  kikuyu: {
    name: 'Kikuyu',
    levels: [
      {
        id: 'kikuyu-beginner',
        name: 'Beginner',
        icon: '👋',
        description: 'Start with the basics of Kikuyu.',
        lessons: [
          {
            id: 1,
            title: 'Greetings',
            xp: 10,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'How do you say "How are you?"',
                options: ['Wĩ mwega?', 'Nĩ kwega', 'Tigwo na wega', 'Nĩ mega'],
                answer: 'Wĩ mwega?',
                translation: 'Wĩ mwega? is a common way to ask someone how they are.',
              },
              {
                type: QuestionType.MCQ,
                question: 'How do you respond to "Wĩ mwega?" if you are fine?',
                options: ['Nĩ mwega', 'Thiiaga', 'Nĩ wega muno', 'Aca'],
                answer: 'Nĩ mwega',
                translation: 'Nĩ mwega means "I am fine."',
              },
              {
                type: QuestionType.MCQ,
                question: 'What does "Nĩ wega muno" mean?',
                options: ['Very good', 'Goodbye', 'Thank you', 'Hello'],
                answer: 'Very good',
                translation: 'Nĩ wega muno can mean "Very good" or act as an emphatic "Thank you".',
              },
              {
                type: QuestionType.MCQ,
                question: 'What is "Goodbye" in Kikuyu?',
                options: ['Tigwo na wega', 'Thie na uhoro', 'Nĩ wega', 'Ūka'],
                answer: 'Thie na uhoro',
                translation: 'Thie na uhoro means "Go in peace" (Goodbye).',
              },
            ],
          },
          {
            id: 2,
            title: 'Numbers',
            xp: 15,
            questions: [
                {
                    type: QuestionType.MCQ,
                    question: 'What is "two" in Kikuyu?',
                    options: ['Imwe', 'Igiri', 'I tatu', 'Inya'],
                    answer: 'Igiri',
                    translation: 'Igiri means "two".',
                },
                {
                    type: QuestionType.MCQ,
                    question: 'What is "five"?',
                    options: ['Itaano', 'Thano', 'Ithanthatu', 'Mugwanja'],
                    answer: 'Thano',
                    translation: 'Thano means "five".',
                },
                {
                    type: QuestionType.MCQ,
                    question: 'What is "ten" in Kikuyu?',
                    options: ['Kenda', 'Mugwanja', 'Ikumi', 'Inya'],
                    answer: 'Ikumi',
                    translation: 'Ikumi means "ten".',
                }
            ],
          },
        ],
      },
      {
        id: 'kikuyu-vocab-ab',
        name: 'Vocabulary Builder (A-B)',
        icon: '📚',
        description: 'Learn common words from the dictionary.',
        lessons: [
            {
                id: 3,
                title: 'Words 1 (A)',
                xp: 20,
                questions: [
                    {
                        type: QuestionType.MCQ,
                        question: 'What does "kothora" mean?',
                        options: ['To abide', 'To abhor', 'To abolish', 'To be able'],
                        answer: 'To abhor',
                        translation: 'Kothora means to abhor or to hate.'
                    },
                    {
                        type: QuestionType.MCQ,
                        question: 'What is the word for "to accuse"?',
                        options: ['Koruta', 'Kuona', 'Kochirithia', 'Komenyera'],
                        answer: 'Kochirithia',
                        translation: 'Kochirithia is the verb for "to accuse".'
                    },
                    {
                        type: QuestionType.MCQ,
                        question: '"Koruta" can mean...',
                        options: ['To act', 'To acquire', 'To ache', 'To add'],
                        answer: 'To act',
                        translation: 'Koruta can mean "to act" or "to do".'
                    },
                    {
                        type: QuestionType.FILL_IN_BLANK,
                        questionParts: ["To add to something is to ", "."],
                        answer: 'kotara',
                        translation: 'Kotara means "to add to" or "to count".'
                    }
                ]
            },
            {
                id: 4,
                title: 'Words 2 (B)',
                xp: 20,
                questions: [
                    {
                        type: QuestionType.MCQ,
                        question: 'What is a "kiondo"?',
                        options: ['A bag', 'A baby', 'A banana', 'A banner'],
                        answer: 'A bag',
                        translation: 'A kiondo is a traditional woven bag.'
                    },
                    {
                        type: QuestionType.MCQ,
                        question: 'The word for "badness" is "Waganu". What does "kobutha" mean?',
                        options: ['To go back', 'To go bad', 'To bake', 'To be bald'],
                        answer: 'To go bad',
                        translation: 'Kobutha means to go bad or to rot.'
                    },
                    {
                        type: QuestionType.FILL_IN_BLANK,
                        questionParts: ["A banana is called an ", "."],
                        answer: 'irigo',
                        translation: 'Irigo is the Kikuyu word for banana.'
                    },
                     {
                        type: QuestionType.MCQ,
                        question: 'Which word means "beauty"?',
                        options: ['Wega', 'Kuega', '-ega', 'Kothondeka'],
                        answer: 'Wega',
                        translation: 'Wega means beauty or goodness. -ega is the adjective "beautiful/good".'
                    }
                ]
            }
        ]
      }
    ],
    dictionary: [
        { word: 'Kolekia', definition: 'verb: to abandon, to throw away' },
        { word: 'Kotiga', definition: 'verb: to abandon, to leave' },
        { word: 'Kuikira thoni', definition: 'verb: to abash, to shame' },
        { word: 'Kothora', definition: 'verb: to abhor, to hate' },
        { word: 'Ogi', definition: 'noun: ability, brains' },
        { word: 'Kogea', definition: 'verb: to be able' },
        { word: 'Nyumba', definition: 'noun: house' },
        { word: 'Kochirithia', definition: 'verb: to accuse' },
        { word: 'Kotara', definition: 'verb: to add, to count' },
        { word: 'Wega', definition: 'noun: beauty, goodness' },
        { word: 'Kobutha', definition: 'verb: to go bad, to rot' },
        { word: 'Irigo', definition: 'noun: banana' },
    ],
  },
  kalenjin: {
    name: 'Kalenjin',
    levels: [
      {
        id: 'kalenjin-proverbs-1',
        name: 'Nandi Proverbs',
        icon: '🦉',
        description: 'Learn wise sayings from the Nandi people.',
        lessons: [
          {
            id: 1,
            title: 'Wise Words 1',
            xp: 20,
            questions: [
              {
                type: QuestionType.MCQ,
                question: 'What is the meaning of the proverb "Inendet ne itorori kurkenyi kocheng\'e ngemisiet"?',
                options: ["Pride comes before a fall.", "A closed door is a safe door.", "A beautiful house is a happy house.", "Do not boast about your family."],
                answer: "Pride comes before a fall.",
                translation: 'It literally means: "The one who glorifies his door (himself) looks for destruction."'
              },
              {
                type: QuestionType.FILL_IN_BLANK,
                questionParts: ["Makikerchin kirukik aeng' eng biy ", "."],
                answer: "akenge",
                translation: '"The bulls cannot stay in the same cowshed." This implies two leaders cannot rule together.'
              },
              {
                type: QuestionType.MCQ,
                question: 'What does "Mo ekyin kerati" mean?',
                options: ["It's never too late.", "The forest is dangerous.", "A journey starts with one step.", "Patience is a virtue."],
                answer: "It's never too late.",
                translation: 'Literally "It\'s never late for the bush." It means it\'s never too late to find a solution or escape trouble.'
              },
              {
                type: QuestionType.MCQ,
                question: 'The proverb "Kerkei kiyaki ak kororibo met" teaches that wealth is...',
                options: ['Temporary', 'Important', 'Hard to get', 'A blessing'],
                answer: 'Temporary',
                translation: '"Livestock is like hair." It suggests that wealth can disappear easily.'
              },
               {
                type: QuestionType.FILL_IN_BLANK,
                questionParts: ["Kerichot ab mat ko ", "."],
                answer: 'mat',
                translation: '"The medicine of fire is fire." This teaches to use bold action for tough situations.'
              }
            ],
          },
          {
            id: 2,
            title: 'Wise Words 2',
            xp: 20,
            questions: []
          }
        ],
      },
    ],
    dictionary: [
        { word: "Inendet ne itorori kurkenyi kocheng'e ngemisiet", definition: "The one who glorifies himself looks for destruction." },
        { word: "Makikerchin kirukik aeng' eng biy akenge", definition: "The bulls cannot stay in the same cowshed." },
        { word: "Ng'wan eng kut sise eng moo", definition: "Even if it's bitter in the mouth, by the time it gets to the stomach the bitterness will have disappeared." },
        { word: "Mo ekyin kerati", definition: "It's never late for the bush." },
        { word: "Chepya kobo chi", definition: "However bad it may be, it belongs to someone." },
        { word: "Ngobo kipng'ulya kobo, ngobo boisio kobo", definition: "When it is play it is play; but when it is business it is business." },
        { word: "Kerkei kiyaki ak kororibo met", definition: "Livestock is like hair." },
        { word: "Kerichot ab mat ko mat", definition: "The medicine of fire is fire." },
        { word: "Kergei lagoi ak kayak", definition: "Children are like cattle." },
        { word: "Menemugei chi met", definition: "A person cannot shave his own hair." }
    ],
  },
};