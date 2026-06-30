"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";

export default function WeatherHeading() {
  const { coords } = useLocation();
  const [heading, setHeading] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!coords) return;

    fetch(`/api/weather-heading?lat=${coords.lat}&lon=${coords.lon}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.heading) setHeading(data.heading);
      })
      .catch(() => setHeading("How's the sky looking today?"))
      .finally(() => setMounted(true));
  }, [coords]);

  if (!coords) return (
    <h1 className="font-extrabold font-display text-3xl sm:text-4xl text-center mb-6 min-h-10 text-foreground">
      <span className="opacity-60">How&apos;s the sky looking today?</span>
    </h1>
  );

  return (
    <h1
      className="font-extrabold font-display text-3xl sm:text-4xl text-center mb-6 min-h-10 transition-opacity duration-300 text-foreground"
      suppressHydrationWarning
    >
      <span className={mounted ? "opacity-100" : "opacity-0"}>
        {heading || "Fetching your forecast..."}
      </span>
    </h1>
  );
}