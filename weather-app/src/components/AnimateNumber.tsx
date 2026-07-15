"use client";

import { AnimatedNumberProps } from "@/types/componentTypes";
import { useEffect, useState } from "react";



export default function AnimatedNumberVanilla({ value, duration = 1500 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // An ease-out quad function to slow down beautifully at the end
      const easeOutQuad = (x: number) => x * (2 - x);
      
      setCount(Math.floor(easeOutQuad(progress) * (value - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, [value, duration]);

  return <span>{count}</span>;
}