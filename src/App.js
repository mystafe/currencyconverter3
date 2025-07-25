import "./App.css";
import Currency from "./compononents/Currency";
import Footer from "./compononents/Footer";

import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(prefersDark ? "dark" : "light");
  const [superMode, setSuperMode] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);

  const toggleLanguage = () => {
    const newLng = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLng);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleTitleClick = () => {
    setTitleClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setSuperMode((s) => !s);
        return 0;
      }
      return next;
    });
  };

  const clearCache = () => {
    localStorage.clear();
    alert('Cache cleared');
    window.location.reload();
  };

  const checkUsage = async () => {
    try {
      const resp = await fetch(
        `https://openexchangerates.org/api/usage.json?app_id=${process.env.REACT_APP_APP_ID}&prettyprint=true`
      );
      if (!resp.ok) throw new Error('Request failed');
      const data = await resp.json();
      const usage = data.usage || data.data?.usage;
      if (!usage) throw new Error('Malformed response');
      alert(`Remaining requests: ${usage.requests_remaining}`);
    } catch {
      alert('Failed to fetch usage info');
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
        {superMode && (
        <>
          <button className="themeToggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="langToggle" onClick={toggleLanguage}>
            {i18n.language === 'tr' ? '🇬🇧' : '🇹🇷'}
          </button>
          <button className="cacheClear" onClick={clearCache}>🗑️</button>
          <button className="usageCheck" onClick={checkUsage}>📈</button>
        </>
      )}
      <Currency isSuper={superMode} onTitleClick={handleTitleClick} />
      <Footer />
    </div>
  );
}

export default App;
