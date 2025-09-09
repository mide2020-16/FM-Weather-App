"use client"
import Image from "next/image"
import { useState } from "react"

export default function UnitsDropdown() {
  const [isImperial, setIsImperial] = useState(false)
  const [selectedTemp, setSelectedTemp] = useState<"celsius" | "fahrenheit">("celsius")
  const [selectedWind, setSelectedWind] = useState<"kmh" | "mph">("kmh")
  const [selectedPrecip, setSelectedPrecip] = useState<"mm" | "in">("mm")

  return (
    <nav className="bg-neutral-800 px-4 py-2 rounded-lg">
      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-neutral-50 font-medium font-sans">
          <Image src="/icon-units.svg" width={20} height={20} alt="Units" />
          Units
          <Image src="/icon-dropdown.svg" width={10} height={10} alt="Dropdown" />
        </summary>

        <div className="absolute right-0 top-10 mt-2 w-60 rounded-md bg-neutral-800 border border-amber-100 p-4 font-sans text-sm text-neutral-200 space-y-3 shadow-lg">
          {/* Switch */}
          <button
            onClick={() => setIsImperial(!isImperial)}
            className="font-semibold"
          >
            Switch to {isImperial ? "Metric" : "Imperial"}
          </button>

          <hr className="border-neutral-600" />

          {/* Temperature */}
          <div>
            <p className="text-xs mb-1">Temperature</p>
            <button
              onClick={() => setSelectedTemp("celsius")}
              className="flex w-full items-center justify-between"
            >
              Celsius (°C)
              {selectedTemp === "celsius" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
            <button
              onClick={() => setSelectedTemp("fahrenheit")}
              className="flex w-full items-center justify-between"
            >
              Fahrenheit (°F)
              {selectedTemp === "fahrenheit" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
          </div>

          <hr className="border-neutral-600" />

          {/* Wind Speed */}
          <div>
            <p className="text-xs mb-1">Wind Speed</p>
            <button
              onClick={() => setSelectedWind("kmh")}
              className="flex w-full items-center justify-between"
            >
              km/h
              {selectedWind === "kmh" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
            <button
              onClick={() => setSelectedWind("mph")}
              className="flex w-full items-center justify-between"
            >
              mph
              {selectedWind === "mph" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
          </div>

          <hr className="border-neutral-600" />

          {/* Precipitation */}
          <div>
            <p className="text-xs mb-1">Precipitation</p>
            <button
              onClick={() => setSelectedPrecip("mm")}
              className="flex w-full items-center justify-between"
            >
              Millimeters (mm)
              {selectedPrecip === "mm" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
            <button
              onClick={() => setSelectedPrecip("in")}
              className="flex w-full items-center justify-between"
            >
              Inches (in)
              {selectedPrecip === "in" && (
                <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />
              )}
            </button>
          </div>
        </div>
      </details>
    </nav>
  )
}
