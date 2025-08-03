import React from "react";
import { useTranslation } from 'react-i18next';

function Navbar({ theme, toggleTheme, toggleLanguage, superMode, clearCache, checkUsage }) {
  const { i18n } = useTranslation();
  return (
    <nav className="topNav">
      <button className="themeToggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <button className="langToggle" onClick={toggleLanguage}>
        {i18n.language === 'tr' ? '🇬🇧' : '🇹🇷'}
      </button>
      {superMode && (
        <>
          <button className="cacheClear" onClick={clearCache}>🗑️</button>
          <button className="usageCheck" onClick={checkUsage}>📈</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
