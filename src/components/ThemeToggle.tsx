"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-gold-100/50 dark:hover:bg-gold-900/50 transition-all duration-300 group"
      aria-label="تبديل المظهر"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all duration-300 text-gold-500 dark:text-gold-400 absolute transform group-hover:rotate-90" 
           style={{ opacity: theme === 'dark' ? 0 : 100 }} />
      <Moon className="h-6 w-6 rotate-90 transition-all duration-300 text-gold-500 dark:text-gold-400 absolute transform group-hover:-rotate-90" 
            style={{ opacity: theme === 'dark' ? 100 : 0 }} />
      <span className="sr-only">تبديل المظهر</span>
    </button>
  );
} 