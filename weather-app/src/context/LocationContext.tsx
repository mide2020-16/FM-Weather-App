"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationContextType {
  coords: Coordinates | null;
  setCoords: (coords: Coordinates | null) => void;
  status: "loading" | "prompt" | "granted" | "denied";
  setStatus: (status: "loading" | "prompt" | "granted" | "denied") => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<"loading" | "prompt" | "granted" | "denied">("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    // Fast check to see if permission was already granted previously
    navigator.permissions?.query({ name: "geolocation" as PermissionName })
      .then((permission) => {
        if (permission.state === "granted") {
          fallbackToBrowserGPS();
        } else if (permission.state === "denied") {
          setStatus("denied");
        } else {
          setStatus("prompt");
        }

        // Keep watch if user changes settings manually mid-session
        permission.onchange = () => {
          if (permission.state === "granted") fallbackToBrowserGPS();
          else setStatus(permission.state);
        };
      })
      .catch(() => setStatus("prompt"));
  }, []);

  const fallbackToBrowserGPS = () => {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <LocationContext.Provider value={{ coords, setCoords, status, setStatus }}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to consume state globally instantly
export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used inside LocationProvider");
  return context;
}