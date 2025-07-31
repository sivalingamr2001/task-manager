import { ThemeContext } from "@/context/Theme/ThemeContext";
import { useContext } from "react";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return context;
};
