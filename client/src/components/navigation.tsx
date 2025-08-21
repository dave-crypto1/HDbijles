import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Globe, ChevronDown, Menu, Settings } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: "nl" as const, label: "🇳🇱 Nederlands" },
    { code: "en" as const, label: "🇬🇧 English" },
    { code: "fr" as const, label: "🇫🇷 Français" },
    { code: "ar" as const, label: "🇸🇦 العربية" },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 navy-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">HD</span>
            </div>
            <span className="text-xl font-bold text-navy-900 dark:text-white">HD Bijles</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${
                location === "/" 
                  ? "text-navy-600 dark:text-navy-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400"
              }`}
            >
              {t("navigation.home")}
            </Link>
            <a
              href="#services"
              className="text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
            >
              {t("navigation.services")}
            </a>
            <a
              href="#booking"
              className="text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
            >
              {t("navigation.booking")}
            </a>
            <a
              href="#contact"
              className="text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
            >
              {t("navigation.contact")}
            </a>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? "bg-navy-50 dark:bg-navy-900/20" : ""}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="hidden md:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>{t("navigation.admin")}</span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <div className="space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.home")}
              </Link>
              <a
                href="#services"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.services")}
              </a>
              <a
                href="#booking"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.booking")}
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.contact")}
              </a>
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.admin")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
