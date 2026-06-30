"use client";

import { useTheme } from "next-themes";
import { MoonStar, SunDim } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2">
        <div className="w-11 h-11 bg-border/50 animate-pulse rounded-2xl" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="p-2">
      <button
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex items-center justify-center p-3 rounded-2xl border border-border bg-surface text-foreground cursor-pointer transition-all duration-300 ease-in-out transform shadow-sm"
      >
        {isDark ? (
          <MoonStar className="h-5 w-5 transition-transform duration-300" />
        ) : (
          <SunDim className="h-5 w-5 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}