import { LanguageProvider as BaseLanguageProvider } from "@/hooks/use-language";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return <BaseLanguageProvider>{children}</BaseLanguageProvider>;
}
