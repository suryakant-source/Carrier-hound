export interface SanskritDisplay {
  englishSyllables: string;
  devanagari: string;
}

// Dictionary of predefined Sanskrit words & phrases to English syllable breakdowns and Devanagari
const SANSKRIT_DICT: Record<string, SanskritDisplay> = {
  // BG 2.47
  'karmaṇi': { englishSyllables: 'kar · ma · ṇi', devanagari: 'कर्मणि' },
  'karmaṇy': { englishSyllables: 'kar · ma · ṇy', devanagari: 'कर्मण्य्' },
  'eva': { englishSyllables: 'e · va', devanagari: 'एव' },
  'evādhikāras': { englishSyllables: 'e · vā · dhi · kā · ras', devanagari: 'एवाधिकारः' },
  'adhikāraḥ': { englishSyllables: 'a · dhi · kā · raḥ', devanagari: 'अधिकारः' },
  'te': { englishSyllables: 'te', devanagari: 'ते' },
  'mā': { englishSyllables: 'mā', devanagari: 'मा' },
  'phaleṣu': { englishSyllables: 'pha · le · ṣu', devanagari: 'फलेषु' },
  'kadācana': { englishSyllables: 'ka · dā · ca · na', devanagari: 'कदाचन' },
  'karma-phala': { englishSyllables: 'kar · ma · pha · la', devanagari: 'कर्मफल' },
  'hetuḥ': { englishSyllables: 'he · tuḥ', devanagari: 'हेतुः' },
  'bhūḥ': { englishSyllables: 'bhūḥ', devanagari: 'भूः' },
  'saṅgaḥ': { englishSyllables: 'saṅ · gaḥ', devanagari: 'सङ्गः' },
  'saṅgo': { englishSyllables: 'saṅ · go', devanagari: 'सङ्गो' },
  'astv': { englishSyllables: 'astv', devanagari: 'अस्तु' },
  '\'stv': { englishSyllables: '\'stv', devanagari: 'ऽस्तु' },
  'akarmaṇi': { englishSyllables: 'a · kar · ma · ṇi', devanagari: 'अकर्मणि' },
  'karmasu': { englishSyllables: 'kar · ma · su', devanagari: 'कर्मसु' },

  // Phrases
  'karmaṇi eva': { englishSyllables: 'kar · ma · ṇi   e · va', devanagari: 'कर्मणि एव' },
  'adhikāraḥ te': { englishSyllables: 'a · dhi · kā · raḥ   te', devanagari: 'अधिकारः ते' },
  'mā phaleṣu': { englishSyllables: 'mā   pha · le · ṣu', devanagari: 'मा फलेषु' },

  // BG 2.48
  'yogasthaḥ': { englishSyllables: 'yo · ga · sthaḥ', devanagari: 'योगस्थः' },
  'kuru': { englishSyllables: 'ku · ru', devanagari: 'कुरु' },
  'karmāṇi': { englishSyllables: 'kar · mā · ṇi', devanagari: 'कर्माणि' },
  'saṅgaṁ': { englishSyllables: 'saṅ · gaṁ', devanagari: 'सङ्गम्' },
  'tyaktvā': { englishSyllables: 'tyak · tvā', devanagari: 'त्यक्त्वा' },
  'dhanañjaya': { englishSyllables: 'dha · nañ · ja · ya', devanagari: 'धनञ्जय' },
  'siddhy-asiddhyoḥ': { englishSyllables: 'sid · dhy  a · sid · dhyoḥ', devanagari: 'सिद्ध्यसिद्ध्योः' },
  'siddhy': { englishSyllables: 'sid · dhy', devanagari: 'सिद्ध्य्' },
  'asiddhyoḥ': { englishSyllables: 'a · sid · dhyoḥ', devanagari: 'असिद्ध्योः' },
  'samo': { englishSyllables: 'sa · mo', devanagari: 'समो' },
  'bhūtvā': { englishSyllables: 'bhū · tvā', devanagari: 'भूत्वा' },
  'samatvaṁ': { englishSyllables: 'sa · ma · tvaṁ', devanagari: 'समत्वम्' },
  'yoga': { englishSyllables: 'yo · ga', devanagari: 'योग' },
  'yogaḥ': { englishSyllables: 'yo · gaḥ', devanagari: 'योगः' },
  'ucyate': { englishSyllables: 'u · cya · te', devanagari: 'उच्यते' },

  // BG 2.50
  'buddhi-yukto': { englishSyllables: 'bud · dhi  yuk · to', devanagari: 'बुद्धियुक्तो' },
  'jahātīha': { englishSyllables: 'ja · hā · tī · ha', devanagari: 'जहातीह' },
  'ubhe': { englishSyllables: 'u · bhe', devanagari: 'उभे' },
  'sukṛta-duṣkṛte': { englishSyllables: 'su · kṛ · ta  duṣ · kṛ · te', devanagari: 'सुकृतदुष्कृते' },
  'tasmād': { englishSyllables: 'tas · mād', devanagari: 'तस्मात्' },
  'yogāya': { englishSyllables: 'yo · gā · ya', devanagari: 'योगाय' },
  'yujyasva': { englishSyllables: 'yuj · yas · va', devanagari: 'युज्यस्व' },
  'kauśalam': { englishSyllables: 'kau · śa · lam', devanagari: 'कौशलम्' },

  // BG 2.71
  'vihāya': { englishSyllables: 'vi · hā · ya', devanagari: 'विहाय' },
  'kāmān': { englishSyllables: 'kā · mān', devanagari: 'कामान्' },
  'yaḥ': { englishSyllables: 'yaḥ', devanagari: 'यः' },
  'sarvān': { englishSyllables: 'sar · vān', devanagari: 'सर्वान्' },
  'pumāṁś': { englishSyllables: 'pu · māṁś', devanagari: 'पुमांश्च' },
  'carati': { englishSyllables: 'ca · ra · ti', devanagari: 'चरति' },
  'niḥspṛhaḥ': { englishSyllables: 'niḥ · spṛ · haḥ', devanagari: 'निःस्पृहः' },
  'nirmamo': { englishSyllables: 'nir · ma · mo', devanagari: 'निर्ममः' },
  'nirahaṅkāraḥ': { englishSyllables: 'nir · a · haṅ · kā · raḥ', devanagari: 'निरहङ्कारः' },
  'sa': { englishSyllables: 'sa', devanagari: 'सः' },
  'śāntim': { englishSyllables: 'śān · tim', devanagari: 'शान्तिम्' },
  'adhigacchati': { englishSyllables: 'a · dhi · gac · cha · ti', devanagari: 'अधिगच्छति' }
};

// Map of IAST/Roman letters to basic Devanagari script for fallback
const IAST_TO_DEVANAGARI: [RegExp, string][] = [
  [/karmaṇy/gi, 'कर्मण्य्'],
  [/karmaṇi/gi, 'कर्मणि'],
  [/evādhikāras/gi, 'एवाधिकारः'],
  [/eva/gi, 'एव'],
  [/adhikāraḥ/gi, 'अधिकारः'],
  [/phaleṣu/gi, 'फलेषु'],
  [/kadācana/gi, 'कदाचन'],
  [/saṅgo/gi, 'सङ्गो'],
  [/saṅgaḥ/gi, 'सङ्गः'],
  [/akarmaṇi/gi, 'अकर्मणि'],
  [/karmasu/gi, 'कर्मसु'],
  [/te/gi, 'ते'],
  [/mā/gi, 'मा'],
  [/astv/gi, 'अस्तु']
];

/**
 * Returns top English syllables and bottom Sanskrit Devanagari representation for a given word or phrase
 */
export function getSanskritDisplay(input: string): SanskritDisplay {
  const cleanInput = input.trim();
  const lowerInput = cleanInput.toLowerCase();

  // Check dictionary
  if (SANSKRIT_DICT[lowerInput]) {
    return SANSKRIT_DICT[lowerInput];
  }

  // If input is already Devanagari (contains Unicode Sanskrit characters 0900-097F)
  if (/[\u0900-\u097F]/.test(cleanInput)) {
    return {
      englishSyllables: cleanInput, // Fallback transliteration
      devanagari: cleanInput
    };
  }

  // Fallback: generate syllable separators for English transliteration
  const syllables = cleanInput.replace(/([aeiouāīūēōṛḷṁḥñṅṇtṭdḍsṣś])/gi, '$1 · ').replace(/ · $/g, '').replace(/ ·\s+/g, '   ');

  // Derive Devanagari fallback
  let dev = cleanInput;
  for (const [pattern, devText] of IAST_TO_DEVANAGARI) {
    if (pattern.test(dev)) {
      dev = dev.replace(pattern, devText);
    }
  }

  return {
    englishSyllables: syllables || cleanInput,
    devanagari: dev
  };
}
