"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Units, UnitsContextType } from "@/types/unitsProvider"

const UnitsContext = createContext<UnitsContextType | undefined>(undefined)

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Units>({
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm",
  })

  // 🟢 Derived state: Automatically calculates true/false based on current selections
  const isCurrentlyImperial = 
    units.temperature === "fahrenheit" && 
    units.wind === "mph" && 
    units.precipitation === "in"

  useEffect(() => {
    const stored = localStorage.getItem("weather-units")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUnits(parsed)
      } catch {
        console.warn("Invalid units in localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("weather-units", JSON.stringify(units))
    document.cookie = `isImperial=${isCurrentlyImperial}; path=/; max-age=31536000`
  }, [units, isCurrentlyImperial])

  return (
    <UnitsContext.Provider value={{ units, setUnits, isCurrentlyImperial }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitsContext)
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider")
  }
  return context
}