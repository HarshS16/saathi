import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Google Translate type declarations
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// Google Translate initialization
window.googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,te,mr,gu,pa,ur,bn,ml',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    },
    'google_translate_element'
  );
};

// Google Translate initialization
window.googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,te,mr,gu,pa,ur,bn,ml',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    },
    'google_translate_element'
  );
};

createRoot(document.getElementById("root")!).render(<App />);
