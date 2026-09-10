import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'nixima_language';
export const LANGUAGE_CHANGE_EVENT = 'nixima_language_changed';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'uk') return saved;
    if (navigator.language && navigator.language.toLowerCase().startsWith('uk')) {
      return 'uk';
    }
  } catch (e) {
    // ignore
  }
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLang }));
    } catch (e) {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'uk')) {
        setLanguageState(e.newValue);
      }
    };
    const handleCustomChange = (e: any) => {
      if (e.detail === 'en' || e.detail === 'uk') {
        setLanguageState(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      t: translations[language] || translations.en,
      toggleLanguage,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Safe fallback if used outside provider
    const lang = getInitialLanguage();
    return {
      language: lang,
      setLanguage: () => {},
      t: translations[lang] || translations.en,
      toggleLanguage: () => {},
    };
  }
  return context;
};
