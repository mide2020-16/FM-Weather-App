"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { mapToWeatherCondition } from "@/lib/mapCondition";
import { type WeatherCondition } from "@/components/WeatherBackground";
import WeatherBackground from "@/components/WeatherBackground";
import CompareLocation from "@/components/CompareLocation";
import Conditons from "@/components/Condition";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import SearchBar from "@/components/SearchBar";
import WeatherCard, { WeatherData } from "@/components/WeatherCard";
import WeatherHeading from "@/components/WeatherHeading";

export default function Home() {
  const { coords } = useLocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgCondition, setBgCondition] = useState<WeatherCondition>(null);

  useEffect(() => {
    if (!coords) return;

    setLoading(true);

    fetch(`/api/weather-heading?lat=${coords.lat}&lon=${coords.lon}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setWeatherData({
            city:        data.city,
            country:     data.country,
            condition:   data.condition,
            description: data.description,
            temp:        data.temp,
            feelsLike:   data.feelsLike,
            humidity:    data.humidity,
            windSpeed:   data.windSpeed,
            icon:        data.icon,
            advisory:    data.advisory,
          });

          // Map real condition + icon code to background animation
          // Extract icon code from the full URL e.g. "01n" from ".../01n@2x.png"
          const iconCode = data.icon?.match(/\/(\w+)@/)?.[1] ?? "";
          setBgCondition(mapToWeatherCondition(data.condition, iconCode));
        }
      })
      .catch(() => {
        setWeatherData(null);
        setBgCondition(null);
      })
      .finally(() => setLoading(false));
  }, [coords]);

  return (
    <>
      {/* Full-page weather background — driven by real condition */}
      <WeatherBackground condition={bgCondition} />

      {/* All page content sits above the background */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 mt-10 text-foreground">

        <WeatherHeading />
        <SearchBar />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl my-6">

          {/* Favorites */}
          <div className="lg:col-span-2 h-fit bg-surface p-4 rounded-xl border border-border">
            <p className="font-semibold mb-2">Favorites</p>
          </div>

          {/* Main */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <WeatherCard loading={loading} weatherData={weatherData} />
            <Conditons loading={loading} />
            <DailyForecast loading={loading} />
          </div>

          {/* Hourly */}
          <div className="lg:col-span-3 h-full">
            <HourlyForecast loading={loading} />
          </div>
        </div>

        <hr className="w-full border-border/60 my-4" />

        <CompareLocation loading={loading} />
      </div>
    </>
  );
}