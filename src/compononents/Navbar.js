import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

function Navbar({ theme, toggleTheme, toggleLanguage, superMode, clearCache, checkUsage }) {
  const { i18n } = useTranslation();

  const iconProps = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
  };

  return (
    <nav className="topNav" aria-label="main navigation">
      <div className="navActions">
        {superMode && (
          <>
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
