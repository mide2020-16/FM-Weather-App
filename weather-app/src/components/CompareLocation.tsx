"use client";

import { useState } from "react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import isLoadingProps from "@/types/isLoading";

interface LocationWeatherData {
  city: string;
  country: string;
  icon: string;
  temp: number;
  conditionText: string;
  feelsLike: string;
  humidity: string;
  uvIndex: string;
  minMax: string;
  windSpeed: string;
  visibility: string;
}

interface CityCoords {
  lat: number;
  lon: number;
}

const SkeletonMetric = () => (
  <div className="flex flex-col gap-1.5 mt-1 items-center justify-center">
    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
    <div className="h-6 w-20 bg-muted/80 rounded animate-pulse mt-0.5" />
  </div>
);

const SkeletonCard = () => (
  <div className="bg-surface border border-border/80 p-4 rounded-2xl flex flex-col h-full shadow-sm">
    <div className="mb-4">
      <div className="h-7 w-48 bg-muted rounded animate-pulse" />
      <div className="h-5 w-32 bg-muted/60 rounded animate-pulse mt-2" />
    </div>
    <div className="bg-foreground/[0.02] border border-border/40 rounded-xl p-5 flex flex-col items-center justify-center">
      <div className="flex items-center gap-5 justify-center py-3 w-full">
        <div className="w-[64px] h-[64px] bg-muted rounded-full animate-pulse shrink-0" />
        <div className="h-16 w-24 bg-muted/80 rounded-xl animate-pulse" />
      </div>
      <hr className="w-full border-border/20 my-4" />
      <div className="grid grid-cols-2 w-full text-center">
        <SkeletonMetric /><SkeletonMetric />
      </div>
    </div>
    <div className="flex flex-col gap-6 mt-6">
      <div className="grid grid-cols-2 w-full text-center">
        <SkeletonMetric /><SkeletonMetric />
      </div>
      <div className="grid grid-cols-2 w-full text-center">
        <SkeletonMetric /><SkeletonMetric />
      </div>
    </div>
  </div>
);

interface WeatherCardDisplayProps {
  data: LocationWeatherData;
  formattedDate: string;
}

const WeatherCardDisplay = ({ data, formattedDate }: WeatherCardDisplayProps) => (
  <div className="bg-surface border border-border/80 p-4 rounded-2xl flex flex-col h-full shadow-sm">
    <div className="mb-4">
      <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        {data.city}, {data.country}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground/60 mt-0.5 font-medium">{formattedDate}</p>
    </div>

    <div className="bg-foreground/[0.02] border border-border/40 rounded-xl p-5 flex flex-col items-center justify-center">
      <div className="flex items-center gap-5 justify-center py-3">
        <Image
          alt={data.conditionText}
          src={data.icon}
          width={64}
          height={64}
          className="object-contain"
          unoptimized
        />
        <span className="text-6xl sm:text-7xl font-medium text-foreground tracking-wide italic">
          {data.temp}°
        </span>
      </div>

      <hr className="w-full border-border/20 my-4" />

      <div className="grid grid-cols-2 w-full text-center">
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">Feels Like</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.feelsLike}</span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">Min/Max</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.minMax}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-6 mt-6">
      <div className="grid grid-cols-2 w-full text-center">
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">Humidity</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.humidity}</span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">Wind Speed</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.windSpeed}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full text-center">
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">UV Index</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.uvIndex}</span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-semibold text-gray-400">Visibility</span>
          <span className="text-xl tracking-wider font-bold text-foreground">{data.visibility}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function CompareLocation({ loading }: isLoadingProps) {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const [location1Data, setLocation1Data] = useState<LocationWeatherData | null>(null);
  const [location2Data, setLocation2Data] = useState<LocationWeatherData | null>(null);
  const [loadingLoc1, setLoadingLoc1] = useState(false);
  const [loadingLoc2, setLoadingLoc2] = useState(false);

  const fetchWeather = async (
    coords: CityCoords,
    setter: (data: LocationWeatherData | null) => void,
    setFetching: (v: boolean) => void
  ) => {
    setFetching(true);
    try {
      const res = await fetch(
        `/api/compare-weather?lat=${coords.lat}&lon=${coords.lon}`
      );
      const data = await res.json();
      if (!data.error) setter(data as LocationWeatherData);
      else setter(null);
    } catch {
      setter(null);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div id="compare" className="w-full max-w-6xl my-10 px-2">

      <div className="flex flex-col text-center gap-1.5 mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Compare Weather
        </h1>
        <p className="text-sm font-medium text-muted-foreground/80">
          See how weather conditions differ across two cities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-stretch relative">

        {/* Location 1 */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium tracking-wider text-muted-foreground/70 pl-1">
              Location 1
            </h2>
            <SearchBar
              onCitySelect={(city) =>
                fetchWeather(
                  { lat: city.lat, lon: city.lon },
                  setLocation1Data,
                  setLoadingLoc1
                )
              }
            />
          </div>

          {loading || loadingLoc1 ? (
            <SkeletonCard />
          ) : location1Data ? (
            <WeatherCardDisplay data={location1Data} formattedDate={formattedDate} />
          ) : (
            <div className="border border-dashed border-border/60 p-12 rounded-2xl text-center text-sm text-muted-foreground/60 bg-muted/5">
              Search and select a city to view metrics
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="lg:col-span-1 flex lg:flex-col justify-center items-center w-full lg:h-full py-2 lg:py-0 select-none">
          <hr className="w-full border-border/60 lg:hidden block" />
          <span className="text-primary font-black text-lg tracking-widest px-4 uppercase shrink-0">VS</span>
          <hr className="w-full border-border/60 lg:hidden block" />
        </div>

        {/* Location 2 */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium tracking-wider text-muted-foreground/70 pl-1">
              Location 2
            </h2>
            <SearchBar
              onCitySelect={(city) =>
                fetchWeather(
                  { lat: city.lat, lon: city.lon },
                  setLocation2Data,
                  setLoadingLoc2
                )
              }
            />
          </div>

          {loading || loadingLoc2 ? (
            <SkeletonCard />
          ) : location2Data ? (
            <WeatherCardDisplay data={location2Data} formattedDate={formattedDate} />
          ) : (
            <div className="border border-dashed border-border/60 p-12 rounded-2xl text-center text-sm text-muted-foreground/60 bg-muted/5">
              Search and select a city to view metrics
            </div>
          )}
        </div>

      </div>
    </div>
  );
}