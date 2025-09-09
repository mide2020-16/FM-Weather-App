"use client"
import isLoadingProps from "@/types/isLoading"
import Image from "next/image"
import { useState } from "react"

export default function HourlyForecast({ loading }: isLoadingProps) {
  const hourData = [
    { icon: "icon-rain.webp", time: "3PM", deg: "20" },
    { icon: "icon-fog.webp", time: "4PM", deg: "21" },
    { icon: "icon-snow.webp", time: "5PM", deg: "19" },
    { icon: "icon-sunny.webp", time: "6PM", deg: "18" },
    { icon: "icon-overcast.webp", time: "7PM", deg: "17" },
    { icon: "icon-sunny.webp", time: "6PM", deg: "18" },
    { icon: "icon-overcast.webp", time: "7PM", deg: "17" },
  ]

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

  const [selectedDay, setSelectedDay] = useState("Tuesday")

  return (
    <div className="bg-neutral-800 rounded-lg p-6 w-full lg:w-80">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Hourly Forecast</h2>
        <details className="relative w-fit">
          <summary className="flex items-center gap-2 text-neutral-50 font-medium font-sans cursor-pointer list-none open:[&_img]:rotate-180">
            {selectedDay}
            <Image
              src="/icon-dropdown.svg"
              width={10}
              height={10}
              alt="Dropdown"
              className="transition-transform duration-200"
            />
          </summary>

          <div className="absolute right-0 mt-2 w-40 rounded-md bg-neutral-800 border border-neutral-700 shadow-lg z-10">
            <div className="px-4 py-3 font-sans text-sm text-neutral-200 space-y-3">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="w-full text-left hover:text-amber-400"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Forecast List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-neutral-700">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-neutral-700 animate-pulse"
              />
            ))
          : hourData.map((hd, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-neutral-700 rounded-lg p-3 text-sm"
              >
                {/* Left: icon + time */}
                <div className="flex items-center gap-2">
                  <Image
                    src={`/${hd.icon}`}
                    width={28}
                    height={28}
                    alt="Weather icon"
                  />
                  <h6 className="font-medium">{hd.time}</h6>
                </div>
                {/* Right: temperature */}
                <span className="font-semibold">{hd.deg}°</span>
              </div>
            ))}
      </div>
    </div>
  )
}
