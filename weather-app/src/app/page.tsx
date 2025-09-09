"use client";

import Conditons from "@/components/Condition";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeatherHeading from "@/components/WeatherHeading";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="flex flex-col items-center w-full px-4 mt-10">
      <WeatherHeading />
      <SearchBar />
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-6 flex-1">
            <WeatherCard loading={isLoading}/>
            <Conditons loading={isLoading}/> 
          </div>
          <DailyForecast loading={isLoading}/>
        </div>
        <HourlyForecast loading={isLoading}/>
      </div>
    </div>
  );
}
