export interface PhrasePair {
  sanskrit: string;
  english: string;
}

export interface MCQOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface WordMeaning {
  word: string;
  devanagari: string;
  meaning: string;
  partOfSpeech: string;
}

export interface Commentary {
  author: string;
  tradition: string;
  text: string;
}

export interface TeachingSlide {
  type: 'verse_intro' | 'word_card' | 'meaning_reveal';
  title: string;
  content: string;
  highlight?: string;
  wordData?: WordMeaning;
}

export type Question =
  | {
      id: string;
      type: 'phrase_matching';
      prompt: string;
      pairs: PhrasePair[];
    }
  | {
      id: string;
      type: 'sentence_rebuilding';
      prompt: string;
      targetSentence: string;
      tiles: string[];
      explanation: string;
    }
  | {
      id: string;
      type: 'fill_in_the_blank';
      prompt: string;
      translation: string;
      options: string[];
      answer: string;
      explanation: string;
    }
  | {
      id: string;
      type: 'multiple_choice';
      prompt: string;
      options: MCQOption[];
    }
  | {
      id: string;
      type: 'reflection';
      prompt: string;
      verseContext?: string;
      guidance?: string;
    };

export interface VersePart {
  partIndex: number;
  title: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  wordBreakdown: WordMeaning[];
  questions: Question[];
  commentary?: Commentary;
  reflectionPrompt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  verseRef: string;
  verseSanskrit: string;
  verseTransliteration: string;
  translation: string;
  purport: string;
  commentary?: Commentary;
  reflectionPrompt?: string;
  parts?: VersePart[];
  finalSynthesisQuestions?: Question[];
  wordBreakdown: WordMeaning[];
  teachingSlides: TeachingSlide[];
  questions: Question[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  sections: Section[];
}

export interface GitaData {
  chapters: Chapter[];
}

const bg247WordBreakdown: WordMeaning[] = [
  { word: 'karmaṇi', devanagari: 'कर्मणि', meaning: 'in action / prescribed duty', partOfSpeech: 'noun (locative)' },
  { word: 'eva', devanagari: 'एव', meaning: 'only / certainly', partOfSpeech: 'particle' },
  { word: 'adhikāraḥ', devanagari: 'अधिकारः', meaning: 'right / authority', partOfSpeech: 'noun' },
  { word: 'te', devanagari: 'ते', meaning: 'your', partOfSpeech: 'pronoun' },
  { word: 'mā', devanagari: 'मा', meaning: 'never / not', partOfSpeech: 'particle' },
  { word: 'phaleṣu', devanagari: 'फलेषु', meaning: 'in the fruits / results', partOfSpeech: 'noun (locative)' },
  { word: 'kadācana', devanagari: 'कदाचन', meaning: 'at any time', partOfSpeech: 'adverb' },
  { word: 'karma-phala', devanagari: 'कर्मफल', meaning: 'fruits of action', partOfSpeech: 'compound noun' },
  { word: 'hetuḥ', devanagari: 'हेतुः', meaning: 'cause / motive', partOfSpeech: 'noun' },
  { word: 'bhūḥ', devanagari: 'भूः', meaning: 'become', partOfSpeech: 'verb' },
  { word: 'saṅgaḥ', devanagari: 'सङ्गः', meaning: 'attachment', partOfSpeech: 'noun' },
  { word: 'akarmaṇi', devanagari: 'अकर्मणि', meaning: 'in inaction / not doing duty', partOfSpeech: 'noun (locative)' },
];

const bg247TeachingSlides: TeachingSlide[] = [
  {
    type: 'verse_intro',
    title: 'BG 2.47 — The Heart of Karma Yoga',
    content: 'This is one of the most famous verses in the Bhagavad Gita. Krishna teaches Arjuna the essence of selfless action — how to act without being enslaved by the desire for results.',
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: 'Your right is to action alone — "karmaṇi" is the locative case of "karma", meaning the field of duty or prescribed action.',
    wordData: { word: 'karmaṇi', devanagari: 'कर्मणि', meaning: 'in action / prescribed duty', partOfSpeech: 'noun (locative)' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"eva" is an emphatic particle that means "only" or "certainly". It stresses that your right is ONLY in action, nothing else.',
    wordData: { word: 'eva', devanagari: 'एव', meaning: 'only / certainly', partOfSpeech: 'particle' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"adhikāraḥ" means right, authority, or entitlement. Combined with "te" (your), it says: your right/authority…',
    wordData: { word: 'adhikāraḥ', devanagari: 'अधिकारः', meaning: 'right / authority', partOfSpeech: 'noun' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"mā" is a prohibition particle — it means "never" or "do not". Krishna is commanding: do NOT claim rights over the fruits.',
    wordData: { word: 'mā', devanagari: 'मा', meaning: 'never / not', partOfSpeech: 'particle' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"phaleṣu" comes from "phala" (fruit/result). In locative case, it means "in the fruits". You have no right in the results of your work.',
    wordData: { word: 'phaleṣu', devanagari: 'फलेषु', meaning: 'in the fruits / results', partOfSpeech: 'noun (locative)' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"karma-phala-hetuḥ" is a compound: the one who acts motivated ONLY by results. Krishna says: never be such a person.',
    wordData: { word: 'karma-phala', devanagari: 'कर्मफल', meaning: 'fruits of action', partOfSpeech: 'compound noun' },
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"saṅgaḥ" means attachment or clinging. "akarmaṇi" means inaction. The final warning: don\'t become attached to NOT doing your duty either.',
    wordData: { word: 'akarmaṇi', devanagari: 'अकर्मणि', meaning: 'in inaction / not doing duty', partOfSpeech: 'noun (locative)' },
  },
  {
    type: 'meaning_reveal',
    title: 'Putting It All Together',
    content: 'karmaṇy-evādhikāras te — Your right is in action only\nmā phaleṣu kadācana — Never in the fruits at any time\nmā karma-phala-hetur bhūḥ — Never be motivated only by results\nmā te saṅgo \'stv akarmaṇi — Nor be attached to inaction',
  },
];

// Mock data for BG 2.48
const bg248TeachingSlides: TeachingSlide[] = [
  {
    type: 'verse_intro',
    title: 'BG 2.48 — Equanimity in Action',
    content: 'Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called Yoga.',
  },
  {
    type: 'word_card',
    title: 'New Word',
    content: '"yogasthaḥ" means established in Yoga (balanced mind).',
    wordData: { word: 'yogasthaḥ', devanagari: 'योगस्थः', meaning: 'established in Yoga', partOfSpeech: 'adjective' },
  },
  {
    type: 'meaning_reveal',
    title: 'Equanimity is Yoga',
    content: 'yogasthaḥ kuru karmāṇi — Perform duty established in Yoga\nsamatvaṁ yoga ucyate — Evenness of mind is called Yoga',
  }
];

export const gitaData: GitaData = {
  chapters: [
    {
      id: 'ch2',
      number: 2,
      title: 'Sankhya Yoga',
      summary: 'Yoga of Knowledge',
      sections: [
        {
          id: 'ch2_sec1',
          title: 'Duty and Right Action',
          lessons: [
            {
              id: 'ch2_sec1_l1',
              title: 'Right to Action',
              verseRef: 'BG 2.47',
              verseSanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
              verseTransliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
              translation: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, and never be attached to not doing your duty.',
              purport: 'This famous verse outlines the foundation of Karma Yoga. Krishna advises Arjuna to focus entirely on his duty (action) without anxiety about the outcomes (fruits) of those actions, and warns against resolving not to do work (inaction) just because he cannot control the results.',
              commentary: {
                author: 'Swami Sivananda',
                tradition: 'Divine Life Society',
                text: 'Work done with expectation of reward brings anxiety and bondage. Perform your duty with an unattached mind, treating success and failure with equanimity. By giving up claim to the fruits of action, you purify the mind and gain liberation.'
              },
              reflectionPrompt: 'Where in your life today are you clinging to results rather than bringing full presence and dedication to the action itself?',
              wordBreakdown: bg247WordBreakdown,
              teachingSlides: [],
              questions: [],
              parts: [
                {
                  partIndex: 1,
                  title: 'Part 1: Your Right to Action',
                  sanskrit: 'कर्मण्येवाधिकारस्ते',
                  transliteration: 'karmaṇy-evādhikāras te',
                  translation: 'You have a right to perform your prescribed duties.',
                  wordBreakdown: [
                    { word: 'karmaṇi', devanagari: 'कर्मणि', meaning: 'in action / duty', partOfSpeech: 'noun' },
                    { word: 'eva', devanagari: 'एव', meaning: 'only / certainly', partOfSpeech: 'particle' },
                    { word: 'adhikāraḥ', devanagari: 'अधिकारः', meaning: 'right / entitlement', partOfSpeech: 'noun' },
                    { word: 'te', devanagari: 'ते', meaning: 'your', partOfSpeech: 'pronoun' }
                  ],
                  questions: [
                    {
                      id: 'p1_q1',
                      type: 'phrase_matching',
                      prompt: 'Match the words in Part 1 to their English meanings.',
                      pairs: [
                        { sanskrit: 'karmaṇi eva', english: 'in prescribed duty only' },
                        { sanskrit: 'adhikāraḥ te', english: 'your right is' }
                      ]
                    },
                    {
                      id: 'p1_q2',
                      type: 'sentence_rebuilding',
                      prompt: 'Arrange the words to form Part 1 of the verse.',
                      targetSentence: 'karmaṇi eva adhikāraḥ te',
                      tiles: ['karmaṇi', 'eva', 'adhikāraḥ', 'te'],
                      explanation: '"karmaṇi eva adhikāraḥ te" — Your right is in action only.'
                    }
                  ]
                },
                {
                  partIndex: 2,
                  title: 'Part 2: Detachment from Results',
                  sanskrit: 'मा फलेषु कदाचन',
                  transliteration: 'mā phaleṣu kadācana',
                  translation: 'Never in the fruits at any time.',
                  wordBreakdown: [
                    { word: 'mā', devanagari: 'मा', meaning: 'never / not', partOfSpeech: 'particle' },
                    { word: 'phaleṣu', devanagari: 'फलेषु', meaning: 'in the fruits / results', partOfSpeech: 'noun' },
                    { word: 'kadācana', devanagari: 'कदाचन', meaning: 'at any time', partOfSpeech: 'adverb' }
                  ],
                  questions: [
                    {
                      id: 'p2_q1',
                      type: 'fill_in_the_blank',
                      prompt: 'Complete Part 2: "mā phaleṣu ______"',
                      translation: 'Never in the fruits at any time.',
                      options: ['kadācana', 'akarmaṇi', 'eva', 'karmasu'],
                      answer: 'kadācana',
                      explanation: '"kadācana" means at any time. You are never entitled to results.'
                    },
                    {
                      id: 'p2_q2',
                      type: 'phrase_matching',
                      prompt: 'Match Part 2 terms to their meanings.',
                      pairs: [
                        { sanskrit: 'mā phaleṣu', english: 'never in the fruits' },
                        { sanskrit: 'kadācana', english: 'at any time' }
                      ]
                    }
                  ]
                },
                {
                  partIndex: 3,
                  title: 'Part 3: Freedom from Motive & Inaction',
                  sanskrit: 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
                  transliteration: 'mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
                  translation: 'Never be motivated by results, nor be attached to inaction.',
                  wordBreakdown: [
                    { word: 'karma-phala', devanagari: 'कर्मफल', meaning: 'fruits of action', partOfSpeech: 'compound' },
                    { word: 'hetuḥ', devanagari: 'हेतुः', meaning: 'motive / cause', partOfSpeech: 'noun' },
                    { word: 'bhūḥ', devanagari: 'भूः', meaning: 'become', partOfSpeech: 'verb' },
                    { word: 'saṅgaḥ', devanagari: 'सङ्गः', meaning: 'attachment', partOfSpeech: 'noun' },
                    { word: 'akarmaṇi', devanagari: 'अकर्मणि', meaning: 'in inaction', partOfSpeech: 'noun' }
                  ],
                  questions: [
                    {
                      id: 'p3_q1',
                      type: 'fill_in_the_blank',
                      prompt: 'Complete: "mā te saṅgo \'stv ______"',
                      translation: '...let not your attachment be to inaction.',
                      options: ['akarmaṇi', 'karmaṇi', 'phaleṣu', 'karmasu'],
                      answer: 'akarmaṇi',
                      explanation: '"akarmaṇi" means inaction. Krishna warns: never quit your duty out of frustration.'
                    },
                    {
                      id: 'p3_q2',
                      type: 'multiple_choice',
                      prompt: 'What does "mā karma-phala-hetur bhūḥ" instruct us to do?',
                      options: [
                        { text: 'Do not let the desire for results be the motive for your work.', isCorrect: true, explanation: 'Correct! Work for the sake of duty, not greed for results.' },
                        { text: 'Always demand high rewards before working.', isCorrect: false, explanation: 'Incorrect.' }
                      ]
                    }
                  ]
                }
              ],
              finalSynthesisQuestions: [
                {
                  id: 'syn_q1',
                  type: 'phrase_matching',
                  prompt: 'FINAL MASTER STAGE: Match all phrase parts of the complete verse!',
                  pairs: [
                    { sanskrit: 'karmaṇi eva', english: 'in duty only' },
                    { sanskrit: 'adhikāraḥ te', english: 'your right is' },
                    { sanskrit: 'mā phaleṣu', english: 'never in results' },
                    { sanskrit: 'akarmaṇi', english: 'in inaction' }
                  ]
                },
                {
                  id: 'syn_q2',
                  type: 'sentence_rebuilding',
                  prompt: 'REBUILD THE ENTIRE VERSE: Arrange the complete first half of BG 2.47!',
                  targetSentence: 'karmaṇi eva adhikāraḥ te mā phaleṣu kadācana',
                  tiles: ['karmaṇi', 'eva', 'adhikāraḥ', 'te', 'mā', 'phaleṣu', 'kadācana'],
                  explanation: '"karmaṇi eva adhikāraḥ te mā phaleṣu kadācana" — You have a right to action alone, never to its fruits.'
                },
                {
                  id: 'syn_q3',
                  type: 'multiple_choice',
                  prompt: 'How does mastering BG 2.47 reduce performance anxiety in modern daily life?',
                  options: [
                    {
                      text: 'By focusing 100% on effort and preparation while releasing worry over outcome.',
                      isCorrect: true,
                      explanation: 'Correct! Directing mind power to the task itself eliminates fear of failure.'
                    },
                    {
                      text: 'By quitting difficult projects immediately.',
                      isCorrect: false,
                      explanation: 'Incorrect. Krishna warns against attachment to inaction ("mā te saṅgo \'stv akarmaṇi").'
                    }
                  ]
                },
                {
                  id: 'syn_q4',
                  type: 'reflection',
                  prompt: 'Personal Reflection on Karma Yoga:',
                  verseContext: 'BG 2.47: "karmaṇy-evādhikāras te mā phaleṣu kadācana — You have a right to perform your prescribed duties, but never to the fruits."',
                  guidance: 'Reflect on a personal project or goal you are currently pursuing. How would your peace of mind and effort change if you detached from the final outcome and focused entirely on the craftsmanship of your action today?'
                }
              ]
            },
            {
              id: 'ch2_sec1_l2',
              title: 'Equanimity in Action',
              verseRef: 'BG 2.48',
              verseSanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
              verseTransliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
              translation: 'Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called Yoga.',
              purport: 'Krishna advises Arjuna to maintain a balanced mind regardless of victory or defeat.',
              commentary: {
                author: 'Adi Shankaracharya',
                tradition: 'Advaita Vedanta',
                text: 'Equanimity (samatvam) is remaining unshaken in praise or blame, gain or loss. When the mind is steady and undisturbed by external results, every action becomes a spiritual discipline (Yoga).'
              },
              reflectionPrompt: 'Recall a recent situation where an unexpected outcome disturbed your peace. How could practicing "samatvam" (evenness of mind) help you respond differently next time?',
              wordBreakdown: [
                { word: 'yogasthaḥ', devanagari: 'योगस्थः', meaning: 'established in Yoga', partOfSpeech: 'adjective' },
                { word: 'samatvaṁ', devanagari: 'समत्वम्', meaning: 'evenness of mind', partOfSpeech: 'noun' }
              ],
              teachingSlides: [],
              questions: [],
              parts: [
                {
                  partIndex: 1,
                  title: 'Part 1: Established in Yoga',
                  sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय',
                  transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
                  translation: 'Perform your duty established in Yoga, abandoning all attachment, O Arjuna.',
                  wordBreakdown: [
                    { word: 'yogasthaḥ', devanagari: 'योगस्थः', meaning: 'established in Yoga', partOfSpeech: 'adjective' },
                    { word: 'kuru', devanagari: 'कुरु', meaning: 'do / perform', partOfSpeech: 'verb' },
                    { word: 'karmāṇi', devanagari: 'कर्माणि', meaning: 'duties / actions', partOfSpeech: 'noun' },
                    { word: 'tyaktvā', devanagari: 'त्यक्त्वा', meaning: 'abandoning', partOfSpeech: 'verb' }
                  ],
                  questions: [
                    {
                      id: 'bg248_p1_q1',
                      type: 'phrase_matching',
                      prompt: 'Match Part 1 terms to their meanings.',
                      pairs: [
                        { sanskrit: 'yogasthaḥ', english: 'established in Yoga' },
                        { sanskrit: 'kuru karmāṇi', english: 'perform duties' }
                      ]
                    }
                  ]
                },
                {
                  partIndex: 2,
                  title: 'Part 2: Definition of Yoga',
                  sanskrit: 'सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते',
                  transliteration: 'siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
                  translation: 'Be equal in success and failure. Such evenness of mind is called Yoga.',
                  wordBreakdown: [
                    { word: 'samo', devanagari: 'समो', meaning: 'equal / equipoised', partOfSpeech: 'adjective' },
                    { word: 'samatvaṁ', devanagari: 'समत्वम्', meaning: 'evenness of mind', partOfSpeech: 'noun' },
                    { word: 'yoga', devanagari: 'योग', meaning: 'Yoga', partOfSpeech: 'noun' }
                  ],
                  questions: [
                    {
                      id: 'bg248_p2_q1',
                      type: 'multiple_choice',
                      prompt: 'What does Krishna define as "Yoga" in BG 2.48?',
                      options: [
                        { text: 'Equanimity of mind in both success and failure ("samatvaṁ yoga ucyate").', isCorrect: true, explanation: 'Correct! Evenness of mind is true Yoga.' },
                        { text: 'Only physical postures.', isCorrect: false, explanation: 'Incorrect.' }
                      ]
                    }
                  ]
                }
              ],
              finalSynthesisQuestions: [
                {
                  id: 'bg248_syn_q1',
                  type: 'sentence_rebuilding',
                  prompt: 'REBUILD FULL VERSE: Arrange the second half of BG 2.48!',
                  targetSentence: 'siddhy asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
                  tiles: ['siddhy', 'asiddhyoḥ', 'samo', 'bhūtvā', 'samatvaṁ', 'yoga', 'ucyate'],
                  explanation: '"siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate" — Evenness in success and failure is called Yoga.'
                }
              ]
            },
            {
              id: 'ch2_sec1_l3',
              title: 'Skill in Action',
              verseRef: 'BG 2.50',
              verseSanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।\ntasmād yogāya yujyasva yogaḥ karmasu kauśalam ॥',
              verseTransliteration: 'buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte\ntasmād yogāya yujyasva yogaḥ karmasu kauśalam',
              translation: 'A person engaged in devotional service rids himself of both good and bad actions even in this life. Therefore, strive for Yoga, which is the art of all work.',
              purport: 'Yoga is skill in action ("yogaḥ karmasu kauśalam").',
              wordBreakdown: [
                { word: 'kauśalam', devanagari: 'कौशलम्', meaning: 'skill / artfulness', partOfSpeech: 'noun' }
              ],
              teachingSlides: [],
              questions: [],
              parts: [
                {
                  partIndex: 1,
                  title: 'Part 1: Wisdom Overcomes Reaction',
                  sanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते',
                  transliteration: 'buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte',
                  translation: 'One endowed with wisdom casts off both good and bad karma in this life.',
                  wordBreakdown: [
                    { word: 'buddhi-yukto', devanagari: 'बुद्धियुक्तो', meaning: 'endowed with wisdom', partOfSpeech: 'adjective' },
                    { word: 'jahātīha', devanagari: 'जहातीह', meaning: 'casts off in this life', partOfSpeech: 'verb' }
                  ],
                  questions: [
                    {
                      id: 'bg250_p1_q1',
                      type: 'phrase_matching',
                      prompt: 'Match Part 1 terms.',
                      pairs: [
                        { sanskrit: 'buddhi-yukto', english: 'endowed with wisdom' },
                        { sanskrit: 'jahātīha', english: 'casts off in this life' }
                      ]
                    }
                  ]
                },
                {
                  partIndex: 2,
                  title: 'Part 2: Yoga is Skill in Action',
                  sanskrit: 'तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्',
                  transliteration: 'tasmād yogāya yujyasva yogaḥ karmasu kauśalam',
                  translation: 'Therefore strive for Yoga; Yoga is skill in action.',
                  wordBreakdown: [
                    { word: 'yogāya', devanagari: 'योगाय', meaning: 'for Yoga', partOfSpeech: 'noun' },
                    { word: 'kauśalam', devanagari: 'कौशलम्', meaning: 'skill / mastery', partOfSpeech: 'noun' }
                  ],
                  questions: [
                    {
                      id: 'bg250_p2_q1',
                      type: 'multiple_choice',
                      prompt: 'What famous declaration is made in BG 2.50?',
                      options: [
                        { text: 'Yoga is skill in action ("yogaḥ karmasu kauśalam").', isCorrect: true, explanation: 'Correct!' },
                        { text: 'Work is to be avoided.', isCorrect: false, explanation: 'Incorrect.' }
                      ]
                    }
                  ]
                }
              ],
              finalSynthesisQuestions: [
                {
                  id: 'bg250_syn_q1',
                  type: 'sentence_rebuilding',
                  prompt: 'FULL VERSE SYNTHESIS: Arrange the famous second line!',
                  targetSentence: 'tasmād yogāya yujyasva yogaḥ karmasu kauśalam',
                  tiles: ['tasmād', 'yogāya', 'yujyasva', 'yogaḥ', 'karmasu', 'kauśalam'],
                  explanation: '"yogaḥ karmasu kauśalam" — Yoga is skill in action.'
                }
              ]
            },
            {
              id: 'ch2_sec1_l4',
              title: 'Attaining Peace',
              verseRef: 'BG 2.71',
              verseSanskrit: 'विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः ।\nनिर्ममो निरहङ्कारः स शान्तिमधिगच्छति ॥',
              verseTransliteration: 'vihāya kāmān yaḥ sarvān pumāṁś carati niḥspṛhaḥ\nnirmamo nirahaṅkāraḥ sa śāntim adhigacchati',
              translation: 'A person who has given up all desires for sense gratification, who lives free from desires, who has given up all sense of proprietorship and is devoid of false ego — he alone attains real peace.',
              purport: 'True peace comes when we drop possessiveness ("nirmamaḥ") and false ego ("nirahaṅkāraḥ").',
              wordBreakdown: [
                { word: 'nirmamo', devanagari: 'निर्ममः', meaning: 'without possessiveness', partOfSpeech: 'adjective' },
                { word: 'nirahaṅkāraḥ', devanagari: 'निरहङ्कारः', meaning: 'without false ego', partOfSpeech: 'adjective' }
              ],
              teachingSlides: [],
              questions: [],
              parts: [
                {
                  partIndex: 1,
                  title: 'Part 1: Giving Up Desires',
                  sanskrit: 'विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः',
                  transliteration: 'vihāya kāmān yaḥ sarvān pumāṁś carati niḥspṛhaḥ',
                  translation: 'That person who relinquishes all desires and moves about free from longing.',
                  wordBreakdown: [
                    { word: 'vihāya', devanagari: 'विहाय', meaning: 'giving up / abandoning', partOfSpeech: 'verb' },
                    { word: 'kāmān', devanagari: 'कामान्', meaning: 'desires', partOfSpeech: 'noun' },
                    { word: 'niḥspṛhaḥ', devanagari: 'निःस्पृहः', meaning: 'free from craving', partOfSpeech: 'adjective' }
                  ],
                  questions: [
                    {
                      id: 'bg271_p1_q1',
                      type: 'phrase_matching',
                      prompt: 'Match Part 1 terms.',
                      pairs: [
                        { sanskrit: 'vihāya kāmān', english: 'giving up desires' },
                        { sanskrit: 'niḥspṛhaḥ', english: 'free from craving' }
                      ]
                    }
                  ]
                },
                {
                  partIndex: 2,
                  title: 'Part 2: Without Ego & Possessiveness',
                  sanskrit: 'निर्ममो निरहङ्कारः स शान्तिमधिगच्छति',
                  transliteration: 'nirmamo nirahaṅkāraḥ sa śāntim adhigacchati',
                  translation: 'Free from possessiveness and false ego, he alone attains real peace.',
                  wordBreakdown: [
                    { word: 'nirmamo', devanagari: 'निर्ममः', meaning: 'without possessiveness', partOfSpeech: 'adjective' },
                    { word: 'nirahaṅkāraḥ', devanagari: 'निरहङ्कारः', meaning: 'without false ego', partOfSpeech: 'adjective' },
                    { word: 'śāntim', devanagari: 'शान्तिम्', meaning: 'peace', partOfSpeech: 'noun' }
                  ],
                  questions: [
                    {
                      id: 'bg271_p2_q1',
                      type: 'multiple_choice',
                      prompt: 'Who attains real peace according to BG 2.71?',
                      options: [
                        { text: 'One who lives free from false ego ("nirahaṅkāraḥ") and possessiveness ("nirmamaḥ").', isCorrect: true, explanation: 'Correct!' },
                        { text: 'One who accumulates physical wealth.', isCorrect: false, explanation: 'Incorrect.' }
                      ]
                    }
                  ]
                }
              ],
              finalSynthesisQuestions: [
                {
                  id: 'bg271_syn_q1',
                  type: 'sentence_rebuilding',
                  prompt: 'FULL VERSE SYNTHESIS: Rebuild the final line of BG 2.71!',
                  targetSentence: 'nirmamo nirahaṅkāraḥ sa śāntim adhigacchati',
                  tiles: ['nirmamo', 'nirahaṅkāraḥ', 'sa', 'śāntim', 'adhigacchati'],
                  explanation: '"nirmamo nirahaṅkāraḥ sa śāntim adhigacchati" — Without possessiveness or false ego, one attains supreme peace.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
