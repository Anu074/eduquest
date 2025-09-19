import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const LanguageSwitcher = ({ 
  position = 'dropdown',
  showLabel = true,
  size = 'default',
  className = ''
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [translations, setTranslations] = useState({});
  const dropdownRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      label: 'English', 
      nativeLabel: 'English',
      flag: '🇺🇸',
      direction: 'ltr'
    },
    { 
      code: 'hi', 
      label: 'Hindi', 
      nativeLabel: 'हिंदी',
      flag: '🇮🇳',
      direction: 'ltr'
    }
  ];

  // Load saved language preference and translations
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTranslations = async (langCode) => {
    try {
      // In a real app, this would load from translation files
      const translationMap = {
        en: {
          language: 'Language',
          switchTo: 'Switch to',
          currentLanguage: 'Current language'
        },
        hi: {
          language: 'भाषा',
          switchTo: 'बदलें',
          currentLanguage: 'वर्तमान भाषा'
        }
      };
      
      setTranslations(translationMap?.[langCode] || translationMap?.en);
    } catch (error) {
      console.warn('Failed to load translations:', error);
      setTranslations({
        language: 'Language',
        switchTo: 'Switch to',
        currentLanguage: 'Current language'
      });
    }
  };

  const handleLanguageChange = async (langCode) => {
    if (langCode === currentLanguage) return;

    setCurrentLanguage(langCode);
    localStorage.setItem('eduquest-language', langCode);
    
    // Load new translations
    await loadTranslations(langCode);
    
    // Update document direction if needed
    const selectedLang = languages?.find(lang => lang?.code === langCode);
    if (selectedLang) {
      document.documentElement.dir = selectedLang?.direction;
      document.documentElement.lang = langCode;
    }
    
    // Dispatch language change event for other components
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { 
        language: langCode,
        translations: translations
      }
    }));
    
    setIsOpen(false);
  };

  const getCurrentLanguage = () => {
    return languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];
  };

  const getOtherLanguages = () => {
    return languages?.filter(lang => lang?.code !== currentLanguage);
  };

  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  if (position === 'tabs') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {languages?.map((lang) => (
          <Button
            key={lang?.code}
            variant={currentLanguage === lang?.code ? "default" : "ghost"}
            size={size}
            onClick={() => handleLanguageChange(lang?.code)}
            className="micro-scale"
          >
            <span className="mr-1">{lang?.flag}</span>
            {showLabel && <span>{lang?.code?.toUpperCase()}</span>}
          </Button>
        ))}
      </div>
    );
  }

  if (position === 'toggle') {
    const otherLangs = getOtherLanguages();
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => handleLanguageChange(otherLangs?.[0]?.code)}
        className={`micro-scale ${className}`}
        title={`${translations?.switchTo} ${otherLangs?.[0]?.nativeLabel}`}
      >
        <span className="mr-1">{getCurrentLanguage()?.flag}</span>
        {showLabel && (
          <>
            <span className="mr-1">{getCurrentLanguage()?.code?.toUpperCase()}</span>
            <Icon name="ArrowRightLeft" size={14} />
          </>
        )}
      </Button>
    );
  }

  // Default dropdown position
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className="micro-scale"
        title={`${translations?.currentLanguage}: ${getCurrentLanguage()?.nativeLabel}`}
      >
        <span className="mr-1">{getCurrentLanguage()?.flag}</span>
        {showLabel && (
          <span className={`mr-1 ${sizeClasses?.[size]}`}>
            {getCurrentLanguage()?.code?.toUpperCase()}
          </span>
        )}
        <Icon name="ChevronDown" size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
      </Button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="py-1">
            {languages?.map((lang) => (
              <button
                key={lang?.code}
                onClick={() => handleLanguageChange(lang?.code)}
                className={`w-full px-3 py-2 text-left ${sizeClasses?.[size]} hover:bg-muted transition-colors flex items-center justify-between ${
                  currentLanguage === lang?.code 
                    ? 'bg-muted text-primary font-medium' :'text-foreground'
                } ${
                  lang === languages?.[0] ? 'rounded-t-lg' : ''
                } ${
                  lang === languages?.[languages?.length - 1] ? 'rounded-b-lg' : ''
                }`}
                disabled={currentLanguage === lang?.code}
              >
                <div className="flex items-center">
                  <span className="mr-2">{lang?.flag}</span>
                  <span>{lang?.nativeLabel}</span>
                </div>
                {currentLanguage === lang?.code && (
                  <Icon name="Check" size={14} className="text-primary" />
                )}
              </button>
            ))}
          </div>
          
          {/* Language info footer */}
          <div className="border-t border-border px-3 py-2">
            <div className="text-xs text-muted-foreground">
              {translations?.language || 'Language'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;