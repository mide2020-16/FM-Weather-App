"use client";

import { MapContainer, TileLayer } from "react-leaflet";

interface RadarMapProps {
  lat: number;
  lon: number;
}

export default function RadarMap({ lat, lon }: RadarMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_OWM_API_KEY;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      {/* Base map */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Precipitation overlay from OpenWeatherMap */}
      <TileLayer
        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
        opacity={0.6}
      />
    </MapContainer>
  );
}