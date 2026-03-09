import { createContext, useContext } from "react";
import type { Theme } from "../models";

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ theme, children }: { theme: Theme; children: React.ReactNode }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme must be used within a ThemeProvider");
  return theme;
};
