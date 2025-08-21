import { createContext, useContext, useState } from "react";
import { translations, type Language } from "@/lib/translations";

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

interface LanguageProviderState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

export function LanguageProvider({ children, defaultLanguage = "nl" }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to Dutch if key not found
        value = translations.nl;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
