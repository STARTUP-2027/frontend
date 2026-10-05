import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ThemeContextValue = {
  dark: boolean;
  setDark: (dark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => localStorage.getItem("astra-theme") === "dark");

  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("astra-theme", dark ? "dark" : "light");
  }, [dark]);

  return <ThemeContext.Provider value={{ dark, setDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
