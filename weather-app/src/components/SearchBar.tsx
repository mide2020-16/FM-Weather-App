"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon, X, LocateFixed } from "lucide-react";
import Image from "next/image";
import { useLocation } from "@/context/LocationContext";

// 1. Exported and renamed to PascalCase for TS conventions
export interface CityData {
  name: string;
  countryCode: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface SearchBarProps {
  onCitySelect?: (city: CityData) => void;
}

export default function SearchBar({ onCitySelect }: SearchBarProps) {
  const { setCoords } = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchCities = async () => {
      const cleanSearch = debouncedQuery.trim().toLowerCase();
      if (cleanSearch.length < 2) { setCities([]); return; }

      try {
        setIsLoading(true);
        const res = await fetch(`/api/geocode?city=${encodeURIComponent(cleanSearch)}`);
        if (res.ok) {
          const data = await res.json();
          setCities(data as CityData[]);
        } else {
          setCities([]);
        }
      } catch {
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [debouncedQuery]);

  const handleSelectCity = (city: CityData) => {
    const displayName = city.state ? `${city.name}, ${city.state}` : city.name;
    setQuery(displayName);
    setSelectedCity(city);
    setIsOpen(false);

    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;
    setIsOpen(false);

    if (onCitySelect) {
      onCitySelect(selectedCity);
    } else {
      setCoords({ lat: selectedCity.lat, lon: selectedCity.lon });
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedCity(null);
    setCities([]);
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation || onCitySelect) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        setQuery("Current Location");
        setIsOpen(false);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div ref={containerRef} className="w-full max-w-md relative flex flex-col">
      <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
        <div className="bg-surface/60 border border-border flex flex-1 items-center gap-2 rounded-2xl py-3.5 px-4 focus-within:border-primary/50 transition-all duration-200 shadow-inner">
          <SearchIcon className="opacity-40 text-foreground w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Search for a city..."
            aria-label="Search for a city"
            autoComplete="off"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedCity(null); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-transparent focus:outline-none px-0.5 text-sm placeholder-foreground/40 text-foreground font-medium"
          />
          {query.length > 0 && (
            <button type="button" onClick={handleClear} className="shrink-0 p-0.5 rounded-full hover:bg-foreground/10 transition-colors cursor-pointer" aria-label="Clear search">
              <X className="w-3.5 h-3.5 text-foreground/50" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!selectedCity}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 px-5 h-full rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98] shrink-0"
        >
          Search
        </button>
      </form>

      {isOpen && (
        <ul className="absolute top-[105%] left-0 z-50 w-full bg-surface/95 border border-border rounded-2xl p-1.5 shadow-xl backdrop-blur-md max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {!onCitySelect && (
            <li
              onClick={handleCurrentLocation}
              className="px-3.5 py-2.5 text-sm text-foreground hover:bg-foreground/[0.04] cursor-pointer rounded-xl transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-4 flex items-center justify-center shrink-0">
                  <LocateFixed className={`w-4 h-4 text-primary ${isLocating ? "animate-pulse" : ""}`} />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-foreground tracking-tight">
                    {isLocating ? "Locating..." : "Current Location"}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                    Use your device location
                  </span>
                </div>
              </div>
            </li>
          )}

          {cities.length > 0 && !onCitySelect && (
            <li className="mx-2 my-1 border-t border-border/50" aria-hidden="true" />
          )}

          {cities.map((city) => (
            <li
              key={`${city.name}-${city.countryCode}-${city.lat}-${city.lon}`}
              onClick={() => handleSelectCity(city)}
              className="px-3.5 py-2.5 text-sm text-foreground hover:bg-foreground/[0.04] cursor-pointer rounded-xl transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-4 relative overflow-hidden rounded-xs bg-muted shrink-0 shadow-sm">
                  <Image
                    src={`https://flagcdn.com/w40/${city.countryCode.toLowerCase()}.png`}
                    alt={`${city.country} flag`}
                    fill
                    className="object-cover"
                    sizes="20px"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-foreground tracking-tight">{city.name}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                    {city.state || city.country}
                  </span>
                </div>
              </div>
            </li>
          ))}

          {isLoading && (
            <li className="px-3.5 py-2.5 text-xs text-muted-foreground text-center">Searching...</li>
          )}
        </ul>
      )}
    </div>
  );
}