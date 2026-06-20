import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const root = window.document.documentElement;
    // Force dark theme on landing page
    if (theme === "light" && !isLandingPage) {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme, isLandingPage]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
