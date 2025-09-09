import { useUnits } from "@/api/provider/UnitsProvider"
import Image from "next/image"
import { useState } from "react"

export default function UnitsDropdown() {
  const [isImperial, setIsImperial] = useState(false)
  const { units, setUnits } = useUnits()

  return (
    <details className="bg-neutral-800 px-4 py-2 rounded-lg relative">
      <summary className="flex gap-2 items-center cursor-pointer">
        <Image src="/icon-units.svg" width={20} height={20} alt="Units" />
        Units
        <Image src="/icon-dropdown.svg" width={10} height={10} alt="Dropdown" />
      </summary>

      <div className="absolute right-0 mt-2 w-60 rounded-md bg-neutral-800 border border-neutral-700 shadow-lg z-10 p-3">
        <button
          onClick={() => setIsImperial(!isImperial)}
          className="font-semibold"
        >
          Switch to {isImperial ? "Metric" : "Imperial"}
        </button>

        {/* Temperature */}
        <p className="text-xs mb-1">Temperature</p>
        <button
          onClick={() => setUnits((u) => ({ ...u, temperature: "celsius" }))}
          className="flex justify-between w-full"
        >
          Celsius (°C) {units.temperature === "celsius" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>
        <button
          onClick={() => setUnits((u) => ({ ...u, temperature: "fahrenheit" }))}
          className="flex justify-between w-full"
        >
          Fahrenheit (°F) {units.temperature === "fahrenheit" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>

        <hr className="my-2 border-neutral-600" />

        {/* Wind */}
        <p className="text-xs mb-1">Wind Speed</p>
        <button
          onClick={() => setUnits((u) => ({ ...u, wind: "kmh" }))}
          className="flex justify-between w-full"
        >
          km/h {units.wind === "kmh" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>
        <button
          onClick={() => setUnits((u) => ({ ...u, wind: "mph" }))}
          className="flex justify-between w-full"
        >
          mph {units.wind === "mph" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>

        <hr className="my-2 border-neutral-600" />

        {/* Precipitation */}
        <p className="text-xs mb-1">Precipitation</p>
        <button
          onClick={() => setUnits((u) => ({ ...u, precipitation: "mm" }))}
          className="flex justify-between w-full"
        >
          Millimeters (mm) {units.precipitation === "mm" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>
        <button
          onClick={() => setUnits((u) => ({ ...u, precipitation: "in" }))}
          className="flex justify-between w-full"
        >
          Inches (in) {units.precipitation === "in" && <Image src="/icon-checkmark.svg" alt="Checkmark" width={12} height={12} />}
        </button>
      </div>
    </details>
  )
}
