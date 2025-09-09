"use client"
import Image from "next/image"
import isLoadingProps from "@/types/isLoading"

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
    <div className="w-full">
      <h2 className="mb-4 text-lg font-semibold text-left text-white">Daily Forecast</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
        {loading
          ? // 🔹 Skeleton loaders when still loading
            [1, 2, 3, 4, 5, 6, 7].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-800 rounded-xl p-3 text-center animate-pulse"
              >
                <div className="h-6 w-12 mx-auto bg-neutral-700 rounded mb-4"></div>
                <div className="h-16 w-16 mx-auto bg-neutral-700 rounded-full mb-4"></div>
                <div className="flex justify-between text-sm mt-2">
                  <div className="h-4 w-6 bg-neutral-700 rounded"></div>
                  <div className="h-4 w-6 bg-neutral-700 rounded"></div>
                </div>
              </div>
            ))
          : // 🔹 Real forecast when loaded
            forecast.map((fc, i) => (
              <div
                key={i}
                className="bg-neutral-800 rounded-xl p-3 text-center"
              >
                <p className="font-medium text-lg text-white">{fc.day}</p>
                <Image
                  src={`/${fc.icon}`}
                  width={80}
                  height={80}
                  alt={`${fc.day} forecast`}
                  className="mx-auto my-4"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-semibold text-white">{fc.high}°</span>
                  <span className="text-neutral-400">{fc.low}°</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
