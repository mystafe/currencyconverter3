import "./App.css";
import Currency from "./compononents/Currency";
import Footer from "./compononents/Footer";
// import logo from "./logo.svg";
import logo from "./logo.png"; // Adjust the path as necessary

import { useEffect, useState } from "react";

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(prefersDark ? "dark" : "light");
  const [superMode, setSuperMode] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
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
      <img src={logo} alt="logo" className="logo" onClick={handleLogoClick} />
      {superMode && (
        <button className="themeToggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      )}
      <Currency isSuper={superMode} />
      <Footer />
    </div>
  );
}

export default App;
