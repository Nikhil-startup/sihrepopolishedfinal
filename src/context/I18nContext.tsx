'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '@/i18n/en';
import { te } from '@/i18n/te';
import { ta } from '@/i18n/ta';
import { ml } from '@/i18n/ml';
import { hi } from '@/i18n/hi';
import { bn } from '@/i18n/bn';
import { mr } from '@/i18n/mr';

export type SupportedLanguage = 'en' | 'te' | 'ta' | 'ml' | 'hi' | 'bn' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  en,
  te,
  ta,
  ml,
  hi,
  bn,
  mr,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  syncWithUserProfile: (lang?: SupportedLanguage) => void;
  t: (key: string) => string;
  supportedLanguages: LanguageOption[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Load temporary cache on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('agriflow_cached_lang') as SupportedLanguage;
      if (cached && dictionaries[cached]) {
        setLanguageState(cached);
      }
    }
  }, []);

  // Synchronize language from authenticated backend user profile (Source of Truth)
  const syncWithUserProfile = (userLang?: SupportedLanguage) => {
    if (userLang && dictionaries[userLang]) {
      setLanguageState(userLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('agriflow_cached_lang', userLang);
      }
    }
  };

  const setLanguage = (newLang: SupportedLanguage) => {
    if (!dictionaries[newLang]) return;
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriflow_cached_lang', newLang);
    }
  };

  const t = (key: string): string => {
    const currentDict = dictionaries[language] || dictionaries.en;
    return currentDict[key] || dictionaries.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, syncWithUserProfile, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}

