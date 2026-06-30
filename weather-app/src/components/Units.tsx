"use client";

import { useUnits } from "@/api/provider/UnitsProvider";
import { Check, LucideChevronDown, SendHorizontal, Settings } from "lucide-react";
import { useState, useRef } from "react";

// 1. Strictly Type your schema mapping keys
const UNIT_SECTIONS = [
  {
    type: "temperature",
    label: "Temperature",
    options: [
      { key: "celsius", display: "Celsius (°C)" },
      { key: "fahrenheit", display: "Fahrenheit (°F)" },
    ],
  },
  {
    type: "wind",
    label: "Wind Speed",
    options: [
      { key: "kmh", display: "km/h" },
      { key: "mph", display: "mph" },
    ],
  },
  {
    type: "precipitation",
    label: "Precipitation",
    options: [
      { key: "mm", display: "Millimeters (mm)" },
      { key: "in", display: "Inches (in)" },
    ],
  },
] as const;

export default function UnitsDropdown() {
  const { units, setUnits } = useUnits();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const isCurrentlyImperial = 
    units.temperature === "fahrenheit" && 
    units.wind === "mph" && 
    units.precipitation === "in";

  const handleUnitChange = (type: keyof typeof units, value: string) => {
    setUnits((prev) => ({ ...prev, [type]: value }));
  };

  const toggleImperialMetricPreset = () => {
    if (isCurrentlyImperial) {
      // Switch all to Metric standard defaults
      setUnits({ temperature: "celsius", wind: "kmh", precipitation: "mm" });
    } else {
      // Switch all to Imperial standard defaults
      setUnits({ temperature: "fahrenheit", wind: "mph", precipitation: "in" });
    }
  };

  const handleUnitSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Submitted Units Payload:", units);
    
    // Clean, React-approved way to programmatically close a native <details> block
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details 
      ref={detailsRef} 
      className="bg-surface text-foreground border border-border p-3 rounded-2xl relative transition-all duration-300 group select-none"
    >
      <summary className="flex gap-2 items-center cursor-pointer list-none font-medium text-sm outline-none">
        <Settings className="w-4 h-4 transition-transform duration-300 group-open:rotate-45 text-foreground/70" />
        Units
        <LucideChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 text-foreground/70" />
      </summary>

      {/* Dropdown Menu Container */}
      <div className="absolute right-0 top-11 mt-2 w-60 rounded-2xl bg-surface border border-border z-50 p-3 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            title={`Switch to ${isCurrentlyImperial ? "metric" : "imperial"} presets`}
            type="button"
            onClick={toggleImperialMetricPreset}
            className="font-medium cursor-pointer hover:bg-foreground/5 rounded-xl flex-1 px-3 py-2 text-left text-sm text-primary transition-colors"
          >
            Switch to {isCurrentlyImperial ? "Metric" : "Imperial"}
          </button>
          
          <button
            title="Submit unit changes"
            type="button"
            onClick={handleUnitSubmit}
            className="border border-border p-2 rounded-xl cursor-pointer hover:bg-foreground/5 text-primary transition-colors"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Schema Rendering */}
        {UNIT_SECTIONS.map((section, sectionIdx) => (
          <div key={section.type}>
            {sectionIdx > 0 && <hr className="my-2 border-border" />}
            
            <p className="text-[11px] font-bold tracking-wider uppercase mb-1 px-3 text-foreground/50">
              {section.label}
            </p>

            {section.options.map((option) => {
              // Safe assertion mapping against the strong definition types
              const isActive = units[section.type as keyof typeof units] === option.key;
              
              return (
                <button
                  key={option.key}
                  title={`${section.label} selection: ${option.display}`}
                  type="button"
                  onClick={() => handleUnitChange(section.type as keyof typeof units, option.key)}
                  className="flex justify-between items-center w-full cursor-pointer hover:bg-foreground/5 rounded-xl px-3 py-1.5 text-left text-[14px] mb-0.5 transition-colors"
                >
                  <span className={isActive ? "font-medium text-foreground" : "text-foreground/80"}>
                    {option.display}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-primary animate-fade-in" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </details>
  );
}