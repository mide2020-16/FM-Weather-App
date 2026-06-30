import { NextResponse } from "next/server";

interface OpenWeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
}

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
    }

    const apiKey = process.env.WEATHER_MAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Weather fetch failed" }, { status: res.status });
    }

    const data: OpenWeatherResponse = await res.json();

    const condition    = data.weather[0].main;
    const description  = data.weather[0].description;
    const temp         = data.main.temp;
    const feelsLike    = data.main.feels_like;
    const humidity     = data.main.humidity;
    const windSpeed    = data.wind.speed;
    const city         = data.name;
    const country      = data.sys.country;
    const icon         = data.weather[0].icon;
    const heading      = generateHeading(condition, temp);
    const advisory     = getAdvisory(condition, temp);

    return NextResponse.json({
      heading,
      advisory,
      condition,
      description,
      temp: Math.round(temp),
      feelsLike: Math.round(feelsLike),
      humidity,
      windSpeed,
      city,
      country,
      icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    });
  } catch (error) {
    console.error("Weather heading API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}