"use client"
import isLoadingProps from "@/types/isLoading"
import Image from "next/image"
import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function HourlyForecast({ loading }: isLoadingProps) {
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Initialize selected day to today's actual day name
  const [selectedDay, setSelectedDay] = useState(todayName)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  // Mocked 24-hour meteorological data track
  const hourData = [
    { icon: "icon-rain.webp", time: "12:00 AM", deg: "16" },
    { icon: "icon-rain.webp", time: "1:00 AM", deg: "16" },
    { icon: "icon-fog.webp", time: "2:00 AM", deg: "15" },
    { icon: "icon-fog.webp", time: "3:00 AM", deg: "15" },
    { icon: "icon-snow.webp", time: "4:00 AM", deg: "14" },
    { icon: "icon-snow.webp", time: "5:00 AM", deg: "14" },
    { icon: "icon-overcast.webp", time: "6:00 AM", deg: "16" },
    { icon: "icon-overcast.webp", time: "7:00 AM", deg: "17" },
    { icon: "icon-sunny.webp", time: "8:00 AM", deg: "19" },
    { icon: "icon-sunny.webp", time: "9:00 AM", deg: "21" },
    { icon: "icon-sunny.webp", time: "10:00 AM", deg: "23" },
    { icon: "icon-sunny.webp", time: "11:00 AM", deg: "25" },
    { icon: "icon-sunny.webp", time: "12:00 PM", deg: "26" },
    { icon: "icon-sunny.webp", time: "1:00 PM", deg: "27" },
    { icon: "icon-sunny.webp", time: "2:00 PM", deg: "26" },
    { icon: "icon-rain.webp", time: "3:00 PM", deg: "20" },
    { icon: "icon-fog.webp", time: "4:00 PM", deg: "21" },
    { icon: "icon-snow.webp", time: "5:00 PM", deg: "19" },
    { icon: "icon-sunny.webp", time: "6:00 PM", deg: "18" },
    { icon: "icon-overcast.webp", time: "7:00 PM", deg: "17" },
    { icon: "icon-overcast.webp", time: "8:00 PM", deg: "16" },
    { icon: "icon-overcast.webp", time: "9:00 PM", deg: "16" },
    { icon: "icon-fog.webp", time: "10:00 PM", deg: "15" },
    { icon: "icon-fog.webp", time: "11:00 PM", deg: "15" },
  ]

  // Automatically close native <details> menu popup when item is selected
  const handleDaySelect = (day: string) => {
    setSelectedDay(day)
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open")
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 w-full lg:w-85 flex flex-col h-145">
      
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
                        : "text-foreground/80 hover:bg-foreground/[0.03] hover:text-foreground"
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

      {/* 24-Hour Vertical Micro-Grid Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar border border-border/40 rounded-xl bg-foreground/[0.01]">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center px-4 py-3.5 animate-pulse border-b border-border/20 last:border-0"
              >
                <div className="h-4 w-14 bg-foreground/10 rounded" />
                <div className="h-7 w-7 bg-foreground/10 rounded-full mx-auto" />
                <div className="h-4 w-8 bg-foreground/10 rounded ml-auto" />
              </div>
            ))
          : hourData.map((hd, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center px-4 py-3.5 text-sm border-b border-border/30 last:border-0 hover:bg-foreground/[0.01] transition-colors"
              >
                {/* 1. Time Marker */}
                <span className="font-semibold text-muted-foreground/90 text-left tracking-tight">
                  {hd.time}
                </span>

                {/* 2. Condition Icon Anchor */}
                <div className="flex justify-center">
                  <Image
                    src={`/${hd.icon}`}
                    width={28}
                    height={28}
                    alt="Hourly conditions"
                    className="object-contain drop-shadow-sm filter brightness-105"
                    priority={i < 6}
                  />
                </div>

                {/* 3. Metric Readout */}
                <span className="font-bold text-foreground text-right tracking-tight">
                  {hd.deg}°
                </span>
              </div>
            ))}
      </div>
    </div>
  )
}