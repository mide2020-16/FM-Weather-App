"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import isLoadingProps from "@/types/isLoading"

type HourlyData = {
  time: string
  icon: string
  temp?: number | null
}

export default function HourlyForecast({ loading, weatherData }: isLoadingProps) {
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const [selectedDay, setSelectedDay] = useState(todayName)
  const [isVisible, setIsVisible] = useState(true)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const activeDayData: HourlyData[] = weatherData?.hourlyForecastByDay?.[selectedDay] ?? []

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [selectedDay])

  const handleDaySelect = (day: string) => {
    if (day === selectedDay) return
    
    setSelectedDay(day)
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open")
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 w-full lg:w-85 flex flex-col h-145 shadow-sm">
      
      {/* Header Context Bar */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <h2 className="font-bold text-base text-foreground tracking-tight">Hourly Forecast</h2>
        
        <details ref={detailsRef} className="relative w-fit group">
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-primary cursor-pointer list-none select-none hover:opacity-80 transition-opacity">
            {selectedDay === todayName ? "Today" : selectedDay}
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 text-primary" />
          </summary>

          <div className="absolute right-0 mt-2 w-44 rounded-xl bg-surface border border-border shadow-xl z-20 overflow-hidden py-1">
            <div className="flex flex-col max-h-60 overflow-y-auto">
              {days.map((day) => {
                const isToday = day === todayName
                const isSelected = day === selectedDay
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors font-medium
                      ${isSelected 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/80 hover:bg-foreground/3 hover:text-foreground"
                      }`}
                  >
                    {isToday ? "Today" : day}
                  </button>
                )
              })}
            </div>
          </div>
        </details>
      </div>

      {/* 24-Hour Vertical Viewport Container */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar border border-border/40 rounded-xl bg-foreground/1">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-3 items-center px-4 py-3.5 animate-pulse border-b border-border/20 last:border-0"
            >
              <div className="h-4 w-14 bg-foreground/10 rounded" />
              <div className="h-7 w-7 bg-foreground/10 rounded-full mx-auto" />
              <div className="h-4 w-8 bg-foreground/10 rounded ml-auto" />
            </div>
          ))
        ) : activeDayData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
            No forecast data available for this day.
          </div>
        ) : (
          <div 
            className={`flex flex-col transition-opacity duration-300 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeDayData.map((hd, i) => (
              <div
                key={`${selectedDay}-${hd.time}-${i}`}
                className="grid grid-cols-3 items-center px-4 py-3.5 text-sm border-b border-border/30 last:border-0 hover:bg-foreground/2 transition-colors"
              >
                {/* 1. Time Marker */}
                <span className="font-semibold text-muted-foreground/90 text-left tracking-tight">
                  {hd.time}
                </span>

                {/* 2. Condition Icon */}
                <div className="flex justify-center">
                  <Image
                    src={`${hd.icon}`}
                    width={28}
                    height={28}
                    alt="Hourly conditions"
                    className="object-contain drop-shadow-sm filter brightness-105"
                    priority={i < 6}
                  />
                </div>

                {/* 3. Temperature Metric */}
                <span className="font-bold text-foreground text-right tracking-tight">
                  {Math.round(hd.temp || 0)}°
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
