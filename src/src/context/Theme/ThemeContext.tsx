import type { Theme } from "@/types";
import { createContext } from "react";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
