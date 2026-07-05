"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type TemperatureUnit = "celsius" | "fahrenheit"
export type WindUnit = "kmh" | "mph"
export type PrecipitationUnit = "mm" | "in"

export interface Units {
  temperature: TemperatureUnit
  wind: WindUnit
  precipitation: PrecipitationUnit
}

export interface UnitsContextType {
  units: Units
  setUnits: React.Dispatch<React.SetStateAction<Units>>
  isCurrentlyImperial: boolean
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined)

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Units>({
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm",
  })

  // Calculate this on every render so the whole app stays in sync
  const isCurrentlyImperial = 
    units.temperature === "fahrenheit" && 
    units.wind === "mph" && 
    units.precipitation === "in"

  useEffect(() => {
    const stored = localStorage.getItem("weather-units")
    if (stored) {
      try {
        setUnits(JSON.parse(stored))
      } catch {
        console.warn("Invalid units in localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("weather-units", JSON.stringify(units))
  }, [units])

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