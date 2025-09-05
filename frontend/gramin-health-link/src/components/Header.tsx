import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Menu,
  X,
  Phone,
  Stethoscope,
  Users,
  Calendar,
  Languages,
  Video
} from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  useEffect(() => {
    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,te,mr,gu,pa,ur,bn,ml',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    }
  }, []);

  const navItems = [
    { label: t('services'), href: '#services', icon: Stethoscope },
    { label: t('doctors'), href: '#doctors', icon: Users },
    { label: t('contact'), href: '#contact', icon: Phone },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent 
        ? 'bg-white/80 backdrop-blur-md shadow-sm' 
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Sehat Saathi</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Your Trusted Healthcare Companion</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-primary hover:bg-primary/10"
            >
              {t('loginWithOTP')}
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-primary to-green-600 hover:from-primary-dark hover:to-green-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t('bookAppointment')}
            </Button>
            
            {/* Doctor Consultation Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/doctor/consultation')}
              className="text-primary hover:bg-primary/10"
            >
              <Video className="h-4 w-4" />
            </Button>
            
            <div id="google_translate_element" className="hidden"></div>
            <Button
              variant="ghost"
              onClick={() => {
                const element = document.getElementById('google_translate_element');
                if (element) {
                  element.classList.toggle('hidden');
                  setShowTranslate(!showTranslate);
                }
              }}
              className="text-primary hover:bg-primary/10"
            >
              <Languages className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="px-4 py-2 space-y-3 border-t border-gray-200 mt-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  {t('loginWithOTP')}
                </Button>
                
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-primary to-green-600"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('bookAppointment')}
                </Button>
                
                {/* Doctor Consultation Link */}
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/doctor/consultation');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Consultation
                </Button>
                
                <div id="google_translate_element_mobile" className="hidden"></div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const element = document.getElementById('google_translate_element_mobile');
                    if (element) {
                      element.classList.toggle('hidden');
                      // Copy the content from the main translate element
                      const mainElement = document.getElementById('google_translate_element');
                      if (mainElement) {
                        element.innerHTML = mainElement.innerHTML;
                      }
                    }
                  }}
                  className="w-full"
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {t('translate')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;