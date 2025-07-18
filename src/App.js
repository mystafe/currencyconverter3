import "./App.css";
import Currency from "./compononents/Currency";
import Footer from "./compononents/Footer";
import { useEffect, useState } from "react";

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(prefersDark ? "dark" : "light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
      <button className="themeToggle" onClick={toggleTheme}>
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <Currency />
      <Footer />
    </div>
  );
}

export default App;
