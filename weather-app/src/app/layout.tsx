"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { UnitsProvider } from "@/api/provider/UnitsProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { MapPin, ShieldAlert, Navigation } from "lucide-react";
import { LocationProvider } from "@/context/LocationContext";
import WeatherBackground from "@/components/WeatherBackground";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});

// Map OpenWeatherMap condition codes to animation names
// Full list: https://openweathermap.org/weather-conditions
type WeatherCondition = "sunny" | "rainy" | "cloudy" | "stormy" | "snowy" | "foggy" | "night" | null;

function mapConditionCode(code: number, isDay: boolean): WeatherCondition {
  if (code >= 200 && code < 300) return "stormy";
  if (code >= 300 && code < 400) return "rainy";
  if (code >= 500 && code < 600) return "rainy";
  if (code >= 600 && code < 700) return "snowy";
  if (code >= 700 && code < 800) return "foggy";
  if (code === 800) return isDay ? "sunny" : "night";
  if (code > 800)  return "cloudy";
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locationStatus, setLocationStatus] = useState<"prompt" | "granted" | "denied" | "loading">("loading");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>(null);

  // Fetch weather condition whenever coords change
  useEffect(() => {
    if (!coords) return;

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_MAP_API_KEY;
    if (!apiKey) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const code = data?.weather?.[0]?.id;
        const sunrise = data?.sys?.sunrise;
        const sunset = data?.sys?.sunset;
        const now = Math.floor(Date.now() / 1000);
        const isDay = now >= sunrise && now < sunset;

        if (code) setWeatherCondition(mapConditionCode(code, isDay));
      })
      .catch(() => setWeatherCondition(null));
  }, [coords]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.permissions
      ?.query({ name: "geolocation" as PermissionName })
      .then((result) => {
        if (result.state === "granted") {
          requestLocation();
        } else if (result.state === "denied") {
          setLocationStatus("denied");
        } else {
          setLocationStatus("prompt");
        }

        result.onchange = () => {
          if (result.state === "granted") requestLocation();
          else setLocationStatus(result.state as "prompt" | "denied");
        };
      })
      .catch(() => setLocationStatus("prompt"));
  }, []);

  const requestLocation = () => {
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationStatus("granted");
      },
      (error) => {
        console.error(error);
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${bricolage.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <ThemeProvider>
          <UnitsProvider>
            <LocationProvider>

              {/* 
                Weather animation sits fixed behind everything.
                When null (loading / no data) it renders nothing,
                so your theme colors show through unaffected.
              */}
              <WeatherBackground condition={weatherCondition} />

              {/* All page content sits above the animation */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <main className="w-full flex flex-col items-center justify-center flex-1">

                  {/* 1. LOADING STATE */}
                  {locationStatus === "loading" && (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Detecting your location metrics...
                      </p>
                    </div>
                  )}

                  {/* 2. INITIAL ACCESS PROMPT */}
                  {locationStatus === "prompt" && (
                    <div className="flex flex-col items-center text-center max-w-md mx-auto p-8 my-20 bg-surface/80 border border-border rounded-3xl shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                      <MapPin className="w-8 h-8 text-red-500 mb-3" />
                      <h2 className="text-2xl font-extrabold font-bricolage tracking-tight text-foreground">
                        Enable Location Access
                      </h2>
                      <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        WeatherNow needs your location to present highly synchronized
                        hyper-local forecasts, air quality, and visual climate comparisons.
                      </p>
                      <button
                        title="request for location"
                        type="button"
                        onClick={requestLocation}
                        className="mt-8 w-full py-3.5 px-6 font-semibold text-sm bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4 fill-current" />
                        Grant Location Access
                      </button>
                    </div>
                  )}

                  {/* 3. PERMISSION DENIED */}
                  {locationStatus === "denied" && (
                    <div className="flex flex-col items-center text-center max-w-md mx-auto p-8 my-20 bg-surface/80 border border-red-500/20 rounded-3xl shadow-xl backdrop-blur-md animate-in fade-in duration-200">
                      <ShieldAlert className="w-8 h-8 text-red-500 mb-3" />
                      <h2 className="text-xl font-bold font-bricolage tracking-tight text-foreground">
                        Location Access Blocked
                      </h2>
                      <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        It looks like location permissions were denied. Please update your
                        browser site settings for WeatherNow to unlock automatic hyper-local
                        reports.
                      </p>
                      <button
                        title="request for location again"
                        type="button"
                        onClick={requestLocation}
                        className="mt-6 text-xs text-muted-foreground underline hover:text-foreground"
                      >
                        Try Requesting Again
                      </button>
                    </div>
                  )}

                  {/* 4. SUCCESS — render pages */}
                  {locationStatus === "granted" && children}

                </main>
              </div>

            </LocationProvider>
          </UnitsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}