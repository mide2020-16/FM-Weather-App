"use client";

import { FavoriteProps } from "@/types/componentTypes";
import { Star } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

export default function Favorite({ favData }: FavoriteProps) {
  const { setCoords } = useLocation();

  return (
    <div className="w-full lg:col-span-2 h-fit bg-surface p-4 rounded-xl border border-border">
      <p className="font-semibold mb-3">Favorites</p>
      {favData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No favorites yet</p>
      ) : (
        <ul className="space-y-2">
          {favData.map((fav) => (
            <li key={fav.id}>
              <button
                title={`Load weather for ${fav.city}`}
                type="button"
                onClick={() => setCoords({ lat: fav.lat, lon: fav.lon })}
                className="w-full flex justify-between items-center text-xs text-foreground p-2 px-4 rounded-xl hover:bg-muted cursor-pointer"
              >
                {fav.city}
                {fav.country ? `, ${fav.country}` : ""}
                <Star className="w-5 h-5 transition-transform active:scale-95 fill-yellow-400 text-yellow-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}