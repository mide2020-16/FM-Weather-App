"use client"

import { Units, UnitsContextType } from "@/types/unitsProvider"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"



const UnitsContext = createContext<UnitsContextType | undefined>(undefined)

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Units>({
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm",
  })

  // Load from localStorage on mount
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

  // Save to localStorage whenever units change
  useEffect(() => {
    localStorage.setItem("weather-units", JSON.stringify(units))
  }, [units])

  return (
    <UnitsContext.Provider value={{ units, setUnits }}>
      {children}
    </UnitsContext.Provider>
  )
}

// 🔥 Custom hook for convenience
export function useUnits() {
  const context = useContext(UnitsContext)
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider")
  }
  return context
}
