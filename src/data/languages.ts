export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
  direction?: 'ltr' | 'rtl';
}

export const AUTO_DETECT_LANGUAGE: Language = {
  code: 'auto',
  name: 'Auto-Detect',
  nativeName: 'Автовизначення',
  flag: '✨',
  popular: true,
};

export const WORLD_LANGUAGES: Language[] = [
  // Top Popular Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', popular: true },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', popular: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', popular: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', popular: true, direction: 'rtl' },

  // European & Slavic Languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🌐' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },

  // Middle Eastern & Central Asian
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', direction: 'rtl' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: '🇹🇷', direction: 'rtl' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', direction: 'rtl' },

  // South & East Asian Languages
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་', flag: '🇨🇳' },

  // African & Indigenous Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga', flag: '🇸🇴' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chinyanja', flag: '🇲🇼' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼' },

  // Classical & Auxiliary
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🏛️' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🟢' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🕉️' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🕎', direction: 'rtl' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🌺' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flag: '🇳🇿' },
];

export const POPULAR_LANGUAGES: Language[] = WORLD_LANGUAGES.filter(l => l.popular);

export function getLanguageByCode(code: string): Language {
  if (code === 'auto') return AUTO_DETECT_LANGUAGE;
  const match = WORLD_LANGUAGES.find(l => l.code.toLowerCase() === code.toLowerCase());
  return match || {
    code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
    flag: '🌐',
  };
}

export function searchLanguages(query: string): Language[] {
  if (!query.trim()) return WORLD_LANGUAGES;
  const q = query.trim().toLowerCase();
  return WORLD_LANGUAGES.filter(
    l => l.name.toLowerCase().includes(q) || 
         l.nativeName.toLowerCase().includes(q) || 
         l.code.toLowerCase().includes(q)
  );
}

/**
 * Lightweight heuristic natural language detection
 */
export function detectLanguageFromText(text: string): Language {
  const trimmed = text.trim();
  if (!trimmed) return getLanguageByCode('en');

  // Specific Cyrillic features
  if (/[іїєґ]/i.test(trimmed)) {
    return getLanguageByCode('uk'); // Ukrainian distinct characters
  }
  if (/[ыэъё]/i.test(trimmed)) {
    return getLanguageByCode('ru'); // Russian distinct characters
  }
  if (/[ў]/i.test(trimmed)) {
    return getLanguageByCode('be'); // Belarusian
  }
  if (/[ђјљњћџ]/i.test(trimmed)) {
    return getLanguageByCode('sr'); // Serbian Cyrillic
  }
  if (/[абвгдежзийклмнопрстуфхцчшщьюя]/i.test(trimmed)) {
    return getLanguageByCode('uk'); // Default Cyrillic
  }

  // East Asian Scripts
  if (/[\u3040-\u30ff]/i.test(trimmed)) {
    return getLanguageByCode('ja'); // Japanese Hiragana/Katakana
  }
  if (/[\uac00-\ud7af]/i.test(trimmed)) {
    return getLanguageByCode('ko'); // Korean Hangul
  }
  if (/[\u4e00-\u9fa5]/i.test(trimmed)) {
    return getLanguageByCode('zh'); // Chinese Hanzi
  }

  // Middle Eastern Scripts
  if (/[\u0600-\u06ff]/i.test(trimmed)) {
    if (/[پچژگک]/i.test(trimmed)) return getLanguageByCode('fa'); // Persian
    if (/[ٹڈڑںے]/i.test(trimmed)) return getLanguageByCode('ur'); // Urdu
    return getLanguageByCode('ar'); // Arabic
  }
  if (/[\u0590-\u05ff]/i.test(trimmed)) {
    return getLanguageByCode('he'); // Hebrew
  }

  // South Asian Scripts
  if (/[\u0900-\u097f]/i.test(trimmed)) {
    return getLanguageByCode('hi'); // Devanagari (Hindi)
  }
  if (/[\u0980-\u09ff]/i.test(trimmed)) {
    return getLanguageByCode('bn'); // Bengali
  }
  if (/[\u0b80-\u0bff]/i.test(trimmed)) {
    return getLanguageByCode('ta'); // Tamil
  }
  if (/[\u0e00-\u0e7f]/i.test(trimmed)) {
    return getLanguageByCode('th'); // Thai
  }
  if (/[\u0370-\u03ff]/i.test(trimmed)) {
    return getLanguageByCode('el'); // Greek
  }
  if (/[\u10a0-\u10ff]/i.test(trimmed)) {
    return getLanguageByCode('ka'); // Georgian
  }
  if (/[\u0530-\u058f]/i.test(trimmed)) {
    return getLanguageByCode('hy'); // Armenian
  }

  // European Latin features
  if (/[ąćęłńóśźż]/i.test(trimmed)) {
    return getLanguageByCode('pl'); // Polish
  }
  if (/[ěščřžýáíéůúďťň]/i.test(trimmed)) {
    return getLanguageByCode('cs'); // Czech
  }
  if (/[äöüß]/i.test(trimmed)) {
    return getLanguageByCode('de'); // German
  }
  if (/[éèêëàâùûçîïôœæ]/i.test(trimmed)) {
    return getLanguageByCode('fr'); // French
  }
  if (/[ñáéíóúü¿¡]/i.test(trimmed)) {
    return getLanguageByCode('es'); // Spanish
  }
  if (/[ãõçáéíóúâêôà]/i.test(trimmed)) {
    return getLanguageByCode('pt'); // Portuguese
  }
  if (/[ğışçöü]/i.test(trimmed)) {
    return getLanguageByCode('tr'); // Turkish
  }
  if (/[åæø]/i.test(trimmed)) {
    return getLanguageByCode('no'); // Nordic
  }
  if (/[åäö]/i.test(trimmed)) {
    return getLanguageByCode('sv'); // Swedish
  }
  if (/[ăâîșț]/i.test(trimmed)) {
    return getLanguageByCode('ro'); // Romanian
  }
  if (/[őűáéíóöúü]/i.test(trimmed)) {
    return getLanguageByCode('hu'); // Hungarian
  }
  if (/[đčćšž]/i.test(trimmed)) {
    return getLanguageByCode('hr'); // Croatian
  }
  if (/[àèéìíîòóùú]/i.test(trimmed)) {
    return getLanguageByCode('it'); // Italian
  }

  return getLanguageByCode('en');
}
