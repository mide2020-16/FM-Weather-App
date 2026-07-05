'use client'

import { RadioIcon, Star, X } from "lucide-react";
import Image from "next/image";
import { useState} from "react";
import AnimatedNumberVanilla from "./AnimateNumber";
import WeatherBackground, { WeatherCondition } from "./WeatherBackground";
import { DailyForecast, HourlyForecast } from "@/app/api/weather-heading/route";


export interface WeatherData {
  city: string;
  country: string;
  condition: string;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  icon: string;
  advisory: string;
  hourlyForecastByDay: Record<string, HourlyForecast[]>;
  dailyForecast: DailyForecast[];
}

interface WeatherCardProps {
  loading: boolean;
  weatherData: WeatherData | null;
  conditions: WeatherCondition | null;
}

export default function WeatherCard({ loading, weatherData, conditions }: WeatherCardProps) {
  const [favorite, setFavorite] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);


  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleFavorite = () => setFavorite(!favorite);
  const handleRadarOpen = () => setIsRadarOpen(!isRadarOpen);

  return (
    <div
      className={`rounded-2xl border border-border p-6 transition-all duration-300 w-full min-h-68 h-fit flex flex-col justify-between relative overflow-hidden ${
        loading
          ? "bg-surface/50 animate-pulse"
          : "bg-surface shadow-md bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-surface to-surface"
      }`}
    >

      {/* Lottie card background */}
      {!loading && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
          <div className="absolute inset-0 bg-surface/75 z-10" />
          <WeatherBackground condition={conditions} />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-between h-full w-full space-y-8">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-foreground/10 rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-foreground/5 rounded-lg animate-pulse" />
          </div>
          <div className="flex justify-between items-end">
            <div className="h-16 w-20 bg-foreground/10 rounded-xl animate-pulse" />
            <div className="h-12 w-12 bg-foreground/10 rounded-full animate-pulse" />
          </div>
        </div>
      ) : weatherData ? (
        <div className="relative z-20 flex flex-col justify-between h-full w-full space-y-4 p-4">

          {/* Top Action Bar */}
          <div className="flex justify-between items-center">
            <button
              title="radar button"
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-foreground/5 transition-colors cursor-pointer"
              onClick={handleRadarOpen}
            >
              <RadioIcon className="w-4 h-4 text-foreground" />
              Radar
            </button>
            <button
              title="favorite button"
              type="button"
              className="cursor-pointer p-1.5 hover:bg-foreground/5 rounded-full transition-colors"
              onClick={handleFavorite}
            >
              <Star className={`w-5 h-5 transition-transform active:scale-95 ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            </button>
          </div>

          {/* Bottom Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start w-full mt-auto">

            {/* Left: Location & Advisory */}
            <div className="md:col-span-3 space-y-3 text-left">
              <div className="space-y-0.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground line-clamp-1">
                  {weatherData.city}, {weatherData.country}
                </h2>
                <p className="text-xs sm:text-sm font-light tracking-wide text-foreground/60">{formattedDate}</p>
              </div>

              {/* Advisory Capsule */}
              <div className="flex items-center gap-2 border-border/60 border bg-foreground/2 rounded-xl p-2 pr-3 max-w-fit">
                <Image
                  src={weatherData.icon}
                  alt={weatherData.description}
                  width={24}
                  height={24}
                  className="object-contain shrink-0"
                  unoptimized
                />
                <p className="text-xs font-medium tracking-tight text-foreground/80 leading-snug">
                  {weatherData.advisory}
                </p>
              </div>
            </div>

            {/* Right: Temperature */}
            <div className="md:col-span-2 flex items-center justify-start gap-1">
              <Image
                src={weatherData.icon}
                alt={weatherData.description}
                width={80}
                height={80}
                className="object-contain drop-shadow-lg shrink-0"
                priority
                unoptimized
              />
              <div className="flex items-start italic select-none">
                <span className="text-6xl font-extrabold font-display tracking-wider text-foreground">
                  <AnimatedNumberVanilla value={weatherData.temp} />
                </span>
                <span className="text-4xl font-bold mt-1 font-display">°</span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* No data yet state */
        <div className="flex items-center justify-center h-full min-h-40 text-foreground/40 text-sm">
          Search for a city or enable location to see weather
        </div>
      )}

      {/* Radar Modal */}
      {isRadarOpen && (
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md z-30 p-4 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <RadioIcon className="w-4 h-4 text-primary animate-pulse" /> Live Radar Map
            </h3>
            <button
              title="close radar"
              type="button"
              onClick={handleRadarOpen}
              className="p-1 hover:bg-foreground/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full flex-1 bg-foreground/5 rounded-xl border border-border flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Radar view canvas map goes here</p>
          </div>
        </div>
      )}
    </div>
  );
}