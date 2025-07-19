import "./App.css";
import Currency from "./compononents/Currency";
import Footer from "./compononents/Footer";

import { useEffect, useState } from "react";

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(prefersDark ? "dark" : "light");
  const [superMode, setSuperMode] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);

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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
      {superMode && (
        <button className="themeToggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      )}
      <Currency isSuper={superMode} onTitleClick={handleTitleClick} />
      <Footer />
    </div>
  );
}

export default App;
