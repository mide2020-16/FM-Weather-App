"use client";

import { useState, useRef, useEffect } from "react";
import { useUnits } from "@/context/provider/UnitsProvider";
import { Check, ChevronDown, SendHorizontal, Settings } from "lucide-react";
import { Units } from "@/types/unitsProvider";

type UnitOption<T extends keyof Units> = { key: Units[T]; display: string };
type UnitSection<T extends keyof Units> = { type: T; label: string; options: UnitOption<T>[] };

const UNIT_SECTIONS: [
  UnitSection<"temperature">,
  UnitSection<"wind">,
  UnitSection<"precipitation">
] = [
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
];

export default function UnitsDropdown() {
  const { units, setUnits } = useUnits();
  
  const [draftUnits, setDraftUnits] = useState<Units>(units);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDraftUnits(units);
    }
  }, [isOpen, units]);

  const isCurrentlyImperial = 
    draftUnits.temperature === "fahrenheit" && 
    draftUnits.wind === "mph" && 
    draftUnits.precipitation === "in";

  const handleUnitChange = <T extends keyof Units>(type: T, value: Units[T]) => {
    setDraftUnits((prev) => ({ ...prev, [type]: value }));
  };

  const toggleImperialMetricPreset = () => {
    if (isCurrentlyImperial) {
      setDraftUnits({ temperature: "celsius", wind: "kmh", precipitation: "mm" });
    } else {
      setDraftUnits({ temperature: "fahrenheit", wind: "mph", precipitation: "in" });
    }
  };

  const handleUnitSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setUnits(draftUnits); 
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <button
        title="units dropdown"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-2 items-center bg-surface text-foreground border border-border px-4 py-2.5 rounded-2xl font-medium text-sm outline-none hover:bg-foreground/2 transition-colors"
      >
        <Settings className={`w-4 h-4 transition-transform duration-300 text-foreground/70 ${isOpen ? 'rotate-45' : ''}`} />
        Units
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-foreground/70 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Tailwind-powered animated dropdown container */}
      <div 
        className={`absolute right-0 top-12 w-60 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border z-50 p-3 shadow-xl origin-top-right transition-all duration-200 ease-out ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 visible" 
            : "opacity-0 scale-95 -translate-y-2 invisible"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            title={`Switch to ${isCurrentlyImperial ? "metric" : "imperial"} presets`}
            type="button"
            onClick={toggleImperialMetricPreset}
            className="font-medium cursor-pointer hover:bg-foreground/3 rounded-xl flex-1 px-3 py-2 text-left text-sm text-primary transition-colors"
          >
            Switch to {isCurrentlyImperial ? "Metric" : "Imperial"}
          </button>
          
          <button
            title="Apply unit changes"
            type="button"
            onClick={handleUnitSubmit}
            className={`border p-2 rounded-xl cursor-pointer transition-colors ${
              JSON.stringify(draftUnits) !== JSON.stringify(units)
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" 
                : "border-border text-primary hover:bg-foreground/3"
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>

        {UNIT_SECTIONS.map((section, sectionIdx) => (
          <div key={section.type}>
            {sectionIdx > 0 && <hr className="my-2 border-border/60" />}
            
            <p className="text-[11px] font-bold tracking-wider uppercase mb-1 px-3 text-foreground/40">
              {section.label}
            </p>

            {section.options.map((option) => {
              const isActive = draftUnits[section.type] === option.key;
              
              return (
                <button
                  key={option.key}
                  title={`${section.label} selection: ${option.display}`}
                  type="button"
                  onClick={() => handleUnitChange(section.type, option.key)}
                  className="flex justify-between items-center w-full cursor-pointer hover:bg-foreground/3 rounded-xl px-3 py-1.5 text-left text-[14px] mb-0.5 transition-colors"
                >
                  <span className={isActive ? "font-medium text-foreground" : "text-foreground/80"}>
                    {option.display}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}