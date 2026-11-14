
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "ur";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  isUrdu: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setCurrentLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("site-language");

    if (savedLanguage === "ur" || savedLanguage === "en") {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.body.classList.toggle("urdu-page", language === "ur");
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    localStorage.setItem("site-language", nextLanguage);

    // Make language available to Server Components.
    document.cookie = `site-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;

    setCurrentLanguage(nextLanguage);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isUrdu: language === "ur",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
