'use client'

import isLoadingProps from "@/types/isLoading"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Conditions({ loading, weatherData }: isLoadingProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // 1. Safely parse and format metrics to avoid undefined runtime errors
  const visibilityInKm = weatherData?.visibility 
    ? (weatherData.visibility / 1000).toFixed(1) 
    : "--";

  const baseConditions = [
    { condition: "Feels Like", data: `${weatherData?.feelsLike ?? "--"}°` },
    { condition: "Humidity", data: `${weatherData?.humidity ?? "--"}%` },
    { condition: "Wind", data: `${weatherData?.windSpeed ?? "--"} km/h` },
    { condition: "Precipitation", data: `${weatherData?.precipitation ?? "--"}` },
    { condition: "Visibility", data: `${visibilityInKm} km` },
    { condition: "Pressure", data: `${weatherData?.pressure ?? "--"} hPa`},
    { condition: "Dew Point", data: `${weatherData?.dewPoint ?? "--"}°` },
    { condition: "Dew Point", data: `${weatherData?.dewPoint ?? "--"}°` },
  ];

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(baseConditions.length / ITEMS_PER_PAGE);

  const displayedConditions = baseConditions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-4">
      {/* Grid Layout Container */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedConditions.map((wc, i) => (
          <div
            key={i}
            className={`flex flex-col justify-between rounded-xl p-4 border border-border bg-surface transition-all duration-300 ${
              loading ? "animate-pulse" : "shadow-sm"
            }`}
          >
            {/* Label */}
            <h6 className="text-sm font-medium text-muted-foreground tracking-wide">
              {wc.condition}
            </h6>

            {/* Data / Skeleton */}
            {loading ? (
              <div className="h-7 w-20 mt-2 rounded bg-foreground/10 animate-pulse" />
            ) : (
              <span className="text-2xl mt-1 tracking-tight font-extrabold text-foreground font-sans">
                {wc.data}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {baseConditions.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-3 mt-2 select-none">
          {/* Previous Button */}
          <button
            title="previous page"
            type="button"
            onClick={handlePrev}
            className="p-1.5 border border-border rounded-full hover:bg-foreground/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>

          {/* Dynamic Page Indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentPage === index 
                    ? "w-5 bg-primary" 
                    : "w-2 bg-border hover:bg-foreground/20"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            title="next page"
            type="button"
            onClick={handleNext}
            className="p-1.5 border border-border rounded-full hover:bg-foreground/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      )}
    </div>
  )
}