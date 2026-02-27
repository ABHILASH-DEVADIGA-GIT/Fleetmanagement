import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export const PublicHeader = ({ client, enabledLanguages }) => {
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const languageNames = {
    en: 'English',
    kn: 'ಕನ್ನಡ',
    hi: 'हिंदी'
  };

  const navItems = [
    { label: { en: 'Home', kn: 'ಮುಖಪುಟ', hi: 'घर' }, path: '' },
    { label: { en: 'About', kn: 'ಬಗ್ಗೆ', hi: 'के बारे में' }, path: 'about' },
    { label: { en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' }, path: 'services' },
    { label: { en: 'Booking', kn: 'ಬುಕಿಂಗ್', hi: 'बुकिंग' }, path: 'booking' },
  ];

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border z-50" data-testid="public-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="" className="font-heading text-2xl font-bold text-foreground hover:text-primary transition-colors">
          {client.business_name}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="font-ui text-sm uppercase tracking-wider hover:text-primary transition-colors"
              data-testid={`nav-${item.path || 'home'}`}
            >
              {item.label[language] || item.label.en}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {enabledLanguages && enabledLanguages.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="language-selector">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {enabledLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={language === lang ? 'bg-muted' : ''}
                    data-testid={`language-${lang}`}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button onClick={toggleTheme} variant="ghost" size="icon" data-testid="theme-toggle">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
