import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export const PublicHeader = ({ client, enabledLanguages, enabledModules = [] }) => {
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clientId } = useParams();

  const languageNames = {
    en: 'English',
    kn: 'ಕನ್ನಡ',
    hi: 'हिंदी'
  };

  // Base path for all links
  const basePath = `/site/${clientId}`;

  // Define all possible nav items with their module requirements
  const allNavItems = [
    { label: { en: 'Home', kn: 'ಮುಖಪುಟ', hi: 'होम' }, path: '', module: null },
    { label: { en: 'About', kn: 'ಬಗ್ಗೆ', hi: 'के बारे में' }, path: '/about', module: 'about' },
    { label: { en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' }, path: '/services', module: 'services' },
    { label: { en: 'Gallery', kn: 'ಗ್ಯಾಲರಿ', hi: 'गैलरी' }, path: '/gallery', module: 'gallery' },
    { label: { en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು', hi: 'उत्पाद' }, path: '/products', module: 'products' },
    { label: { en: 'Pricing', kn: 'ಬೆಲೆ', hi: 'मूल्य' }, path: '/pricing', module: 'booking' },
    { label: { en: 'Contact', kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' }, path: '/contact', module: 'contact' },
    { label: { en: 'Book Now', kn: 'ಬುಕ್ ಮಾಡಿ', hi: 'बुक करें' }, path: '/booking', module: 'booking', highlight: true },
  ];

  // Filter nav items based on enabled modules
  const navItems = allNavItems.filter(item => 
    item.module === null || enabledModules.includes(item.module)
  );

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border z-50" data-testid="public-header">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={basePath} className="flex items-center gap-3">
          {client?.logo_url && (
            <img src={client.logo_url} alt={client.business_name} className="h-10 w-auto" />
          )}
          <span className="font-heading text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors">
            {client?.business_name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            item.highlight ? (
              <Link key={item.path} to={`${basePath}${item.path}`}>
                <Button size="sm" className="font-ui uppercase tracking-wider" data-testid={`nav-${item.path.slice(1) || 'home'}`}>
                  {item.label[language] || item.label.en}
                </Button>
              </Link>
            ) : (
              <Link
                key={item.path}
                to={`${basePath}${item.path}`}
                className="font-ui text-sm uppercase tracking-wider hover:text-primary transition-colors"
                data-testid={`nav-${item.path.slice(1) || 'home'}`}
              >
                {item.label[language] || item.label.en}
              </Link>
            )
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
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

          {/* Theme Toggle */}
          <Button onClick={toggleTheme} variant="ghost" size="icon" data-testid="theme-toggle">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-background px-4 py-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={`${basePath}${item.path}`}
                className={`font-ui text-sm uppercase tracking-wider py-2 px-4 rounded-lg ${
                  item.highlight 
                    ? 'bg-primary text-primary-foreground text-center' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label[language] || item.label.en}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
