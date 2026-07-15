import { OpenWeatherResponse } from "@/types/weather";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const unit = searchParams.get("units");

    if (!lat || !lon || !unit) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
    }

    const apiKey = process.env.WEATHER_MAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Weather fetch failed" }, { status: res.status });
    }

    const data: OpenWeatherResponse = await res.json();

    return NextResponse.json({
      city:        data.name,
      country:     data.sys.country,
      icon:        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      temp:        Math.round(data.main.temp),
      conditionText: data.weather[0].description
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      feelsLike:   `${Math.round(data.main.feels_like)}°`,
      humidity:    `${data.main.humidity}%`,
      minMax:      `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`,
      windSpeed:   `${(data.wind.speed * 3.6).toFixed(1)} km/h`,
      visibility:  `${(data.visibility / 1000).toFixed(1)} km`,
      uvIndex:     "N/A", // UV requires a separate OWM endpoint (One Call API)
    });
  } catch (error) {
    console.error("Compare weather error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}