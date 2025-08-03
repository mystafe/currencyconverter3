import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

function Navbar({ theme, toggleTheme, toggleLanguage, superMode, clearCache, checkUsage }) {
  const { i18n } = useTranslation();

  const homeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const iconProps = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
  };

  return (
    <nav className="topNav" aria-label="main navigation">
      <motion.button
        className="homeBtn"
        aria-label="Home"
        onClick={homeClick}
        {...iconProps}
      >
        🏠
      </motion.button>
      <div className="navActions">
        <motion.button
          className="themeToggle"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          {...iconProps}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.button>
        <motion.button
          className="langToggle"
          aria-label="Toggle language"
          onClick={toggleLanguage}
          {...iconProps}
        >
          {i18n.language === 'tr' ? '🇬🇧' : '🇹🇷'}
        </motion.button>
        {superMode && (
          <>
            <motion.button
              className="cacheClear"
              aria-label="Clear cache"
              onClick={clearCache}
              {...iconProps}
            >
              🗑️
            </motion.button>
            <motion.button
              className="usageCheck"
              aria-label="Check usage"
              onClick={checkUsage}
              {...iconProps}
            >
              📈
            </motion.button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
