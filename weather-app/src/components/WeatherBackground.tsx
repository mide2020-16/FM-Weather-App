"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";

// Dynamically import to avoid SSR issues with lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export type WeatherCondition =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "stormy"
  | "snowy"
  | "foggy"
  | "night"
  | null;

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  children?: ReactNode;
}

// Map conditions to theme overlay colors — keeps your theme intact
const conditionStyles: Record<NonNullable<WeatherCondition>, { overlay: string; tint: string }> = {
  sunny:  { overlay: "bg-amber-500/5",  tint: "dark:bg-amber-900/10" },
  rainy:  { overlay: "bg-blue-500/5",   tint: "dark:bg-blue-900/10"  },
  cloudy: { overlay: "bg-slate-500/5",  tint: "dark:bg-slate-900/10" },
  stormy: { overlay: "bg-purple-500/5", tint: "dark:bg-purple-900/10"},
  snowy:  { overlay: "bg-sky-500/5",    tint: "dark:bg-sky-900/10"   },
  foggy:  { overlay: "bg-gray-500/5",   tint: "dark:bg-gray-900/10"  },
  night:  { overlay: "bg-indigo-500/5", tint: "dark:bg-indigo-900/10"},
};

export default function WeatherBackground({ condition, children }: WeatherBackgroundProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!condition) {
      setAnimationData(null);
      return;
    }

    // Dynamically fetch the JSON from /public/lottie/
    fetch(`/lottie/${condition}.json`)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [condition]);

  if (!condition || !animationData) return null;

  const styles = conditionStyles[condition];

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none select-none overflow-hidden ${styles.overlay} ${styles.tint} transition-colors duration-700`}
      aria-hidden="true"
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.18,
        }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice", // fills the whole screen
        }}
      >
        {children}
      </Lottie>
    </div>
  );
}