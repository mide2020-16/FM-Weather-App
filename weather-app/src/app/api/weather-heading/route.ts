import { HourlyForecast, OpenWeather25Response, OpenWeatherForecastResponse } from "@/types/weather";
import { NextResponse } from "next/server";

function generateHeading(condition: string, temp: number): string {
  const c = condition.toLowerCase();
  const t = Math.round(temp);

  if (c.includes("thunder")) return `⛈️ Thunderstorms ahead — stay safe out there`;
  if (c.includes("drizzle")) return `🌦️ Light drizzle vibes — a jacket won't hurt`;
  if (c.includes("rain"))    return `🌧️ Rainy day alert — grab that umbrella`;
  if (c.includes("snow"))    return `❄️ Snow is falling — bundle up tight`;
  if (c.includes("mist") || c.includes("fog")) return `🌫️ Foggy out there — drive carefully`;
  if (c.includes("clear") && t > 30) return `☀️ Blazing hot and clear — stay hydrated`;
  if (c.includes("clear") && t > 20) return `😎 Clear skies and warm — perfect weather`;
  if (c.includes("clear")) return `🌤️ Clear skies today — enjoy the fresh air`;
  if (c.includes("cloud")) return `⛅ Cloudy but calm — not bad at all`;
  return `🌡️ ${t}° out there — check the details below`;
}

function getAdvisory(condition: string, temp: number): string {
  const c = condition.toLowerCase();
  const t = Math.round(temp);

  if (c.includes("thunder")) return "Thunderstorm warning — avoid open areas and unplug devices.";
  if (c.includes("drizzle") || c.includes("rain")) return "Rain expected — carry an umbrella and wear waterproof shoes.";
  if (c.includes("snow")) return "Snowy conditions — wear warm layers and watch for icy roads.";
  if (c.includes("mist") || c.includes("fog")) return "Low visibility — drive slowly and use fog lights.";
  if (t > 35) return "Extreme heat — stay indoors, drink water, and avoid direct sunlight.";
  if (t > 28) return "It is hot today — stay hydrated and seek shade when outdoors.";
  if (t < 5)  return "Very cold outside — wear heavy layers and keep extremities covered.";
  if (t < 15) return "Cool weather today — a light jacket is a good idea.";
  if (c.includes("clear")) return "Clear and pleasant — great day to spend time outside.";
  return "Mild conditions — a comfortable day overall.";
}

function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const unit = searchParams.get("units");
    console.log(unit)

    if (!lat || !lon || !unit) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
    }

    const apiKey = process.env.WEATHER_MAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    // 1. Parallel fetching setup to avoid waterfalls
    const [res, fres] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    ]);

    if (!res.ok) {
      return NextResponse.json({ error: "Current weather fetch failed" }, { status: res.status });
    }
    if (!fres.ok) {
      return NextResponse.json({ error: "Forecast weather fetch failed" }, { status: fres.status });
    }

    const data: OpenWeather25Response = await res.json();
    const fdata: OpenWeatherForecastResponse = await fres.json();

    // 2. Initialize the structured day container matching frontend needs
    const hourlyForecastByDay: Record<string, HourlyForecast[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    const dailyAccumulator: Record<string, {
      temps: number[];
      dayName: string;
      dateLabel: string;
      middayItem: OpenWeatherForecastResponse["list"][number];
    }> = {};

    fdata.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
      const dateKey = date.toISOString().split("T")[0];
      const hours = date.getHours();

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      if (hourlyForecastByDay[dayName]) {
        hourlyForecastByDay[dayName].push({
          time: formattedTime,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        });
      }

      if (!dailyAccumulator[dateKey]) {
        dailyAccumulator[dateKey] = {
          temps: [],
          dayName,
          dateLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          middayItem: item
        };
      }

      dailyAccumulator[dateKey].temps.push(item.main.temp);

      if (hours >= 12 && hours <= 15) {
        dailyAccumulator[dateKey].middayItem = item;
      }
    });

    const dailyForecast = Object.keys(dailyAccumulator)
      .sort() // Ensure sequential execution ordering
      .map((dateKey) => {
        const entry = dailyAccumulator[dateKey];
        const minTemp = Math.round(Math.min(...entry.temps));
        const maxTemp = Math.round(Math.max(...entry.temps));
        const representativeWeather = entry.middayItem.weather[0];

        return {
          day: entry.dayName,
          date: entry.dateLabel,
          tempMin: minTemp,
          tempMax: maxTemp,
          condition: representativeWeather.main,
          description: generateDailyDescription(representativeWeather.main, maxTemp),
          icon: `https://openweathermap.org/img/wn/${representativeWeather.icon}@2x.png`
        };
      });

    // 4. Extract current context stats
    const condition   = data.weather[0].main;
    const description = data.weather[0].description;
    const temp        = data.main.temp;
    const feelsLike   = data.main.feels_like;
    const humidity    = data.main.humidity;
    const pressure    = data.main.pressure;    
    const visibility  = data.visibility;        
    const windSpeed   = data.wind.speed;
    const dewPoint    = calculateDewPoint(temp, humidity);
    const city        = data.name;
    const country     = data.sys.country;
    const icon        = data.weather[0].icon;
    const heading     = generateHeading(condition, temp);
    const advisory    = getAdvisory(condition, temp);

    return NextResponse.json({
      heading,
      advisory,
      condition,
      description,
      temp: Math.round(temp),
      feelsLike: Math.round(feelsLike),
      humidity,
      pressure,
      visibility,
      windSpeed,
      dewPoint,
      city,
      country,
      hourlyForecastByDay,
      dailyForecast,
      icon: `https://openweathermap.org/img/wn/${icon}.png`,
    });
  } catch (error) {
    console.error("Weather heading API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateDailyDescription(main: string, maxTemp: number): string {
  const m = main.toLowerCase();
  const t = Math.round(maxTemp);

  if (m.includes("thunder")) return "Scattered thunderstorms possible — expect brief heavy showers.";
  if (m.includes("drizzle")) return "Light drizzle likely — surfaces may be a bit damp.";
  if (m.includes("rain")) return "Periods of rain expected — plan for wet conditions.";
  if (m.includes("snow")) return "Snow showers possible — colder temperatures and slippery spots.";
  if (m.includes("mist") || m.includes("fog")) return "Mist or fog likely — limited visibility in places.";
  if (m.includes("clear") && t > 30) return "Hot and sunny — high UV, stay hydrated and use sunscreen.";
  if (m.includes("clear") && t > 20) return "Sunny and warm — great for outdoor activities.";
  if (m.includes("clear")) return "Mostly clear skies — pleasant conditions expected.";
  if (m.includes("cloud")) return "Cloudy with mild temperatures — a calm day overall.";

  if (t > 30) return "Very warm day — expect heat and plan accordingly.";
  if (t < 5) return "Cold day ahead — bundle up and protect exposed skin.";

  return "Mixed conditions — check hourly details for timing and intensity.";
}
