"use client"
import Image from "next/image"
import isLoadingProps from "@/types/isLoading"
import { ChartColumnBig } from "lucide-react"

export default function DailyForecast({ loading }: isLoadingProps) {
  const forecast = [
    { day: "Tue", icon: "icon-fog.webp", high: 20, low: 14 },
    { day: "Wed", icon: "icon-rain.webp", high: 22, low: 15 },
    { day: "Thu", icon: "icon-drizzle.webp", high: 25, low: 18 },
    { day: "Fri", icon: "icon-sunny.webp", high: 28, low: 20 },
    { day: "Sat", icon: "icon-storm.webp", high: 19, low: 12 },
    { day: "Sun", icon: "icon-snow.webp", high: 10, low: 3 },
    { day: "Mon", icon: "icon-overcast.webp", high: 17, low: 9 },
  ]

  return (
    <div className="w-full flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-left text-foreground">Daily Forecast</h2>

      <div className="flex items-center gap-3 border-border/60 border bg-foreground/[0.02] rounded-xl p-3 max-w-2xl w-full">
        <ChartColumnBig className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-medium tracking-tight text-foreground/80 leading-snug">
          This week&apos;s temperature will be similar to last week. Expect 2.0in more precipitation.
        </p>
      </div>

      {/* Forces all 7 days into a single horizontal row with horizontal scroll on smaller viewports */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2">
        <div className="grid grid-flow-col auto-cols-[minmax(85px,1fr)] lg:grid-cols-7 gap-3 min-w-162 lg:min-w-0">
          {loading
            ? Array.from({ length: forecast.length }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-xl p-3 border border-border text-center animate-pulse space-y-3"
                >
                  <div className="h-4 w-8 mx-auto bg-foreground/10 rounded" />
                  <div className="h-10 w-10 mx-auto bg-foreground/10 rounded-full" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-3 w-4 bg-foreground/10 rounded" />
                    <div className="h-3 w-4 bg-foreground/10 rounded" />
                  </div>
                </div>
              ))
            : forecast.map((fc, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl p-3 text-center hover:bg-foreground/[0.01] transition-colors duration-200 flex flex-col justify-between"
                >
                  <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">{fc.day}</p>
                  <Image
                    src={`/${fc.icon}`}
                    width={40}
                    height={40}
                    alt={`${fc.day} forecast icon`}
                    className="mx-auto my-2 object-contain drop-shadow"
                    priority
                  />
                  <div className="flex justify-between text-xs pt-1 border-t border-border/40 font-medium">
                    <span className="text-foreground font-bold">{fc.high}°</span>
                    <span className="text-muted-foreground/60">{fc.low}°</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}