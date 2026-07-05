import { NextResponse } from "next/server";

interface OpenWeatherGeocodeItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface FormattedCityData {
  name: string;
  lat: number;
  lon: number;
  countryCode: string;
  state: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json(
        { error: "City parameter is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.WEATHER_MAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server API key is missing" },
        { status: 500 }
      );
    }

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=10&appid=${apiKey}`;
    
    const res = await fetch(geocodeUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch coordinates from geocoding service" },
        { status: res.status }
      );
    }

    // Cast data safely to the raw shape OpenWeather provides
    const data: OpenWeatherGeocodeItem[] = await res.json();

    const formattedCities: FormattedCityData[] = data.map((item) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      countryCode: item.country ? item.country.toLowerCase() : "",
      state: item.state || "",
    }));

    return NextResponse.json(formattedCities, { status: 200 });
  } catch (error) {
    console.error("Geocoding internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}