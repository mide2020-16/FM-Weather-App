"use client";
import { useState } from "react";
import Image from "next/image";

const cities = [
  "New York",
  "Los Angeles",
  "London",
  "Paris",
  "Tokyo",
  "Toronto",
  "Sydney",
  "Berlin",
  "Dubai",
  "Lagos",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredCities([]);
      setShowDropdown(false);
    } else {
      const matches = cities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(matches);
      setShowDropdown(true);
    }
  };

  const handleSelectCity = (city: string) => {
    setQuery(city);
    setFilteredCities([]);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-md relative">
      <form
        action=""
        className="flex w-full items-center gap-2 mb-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="bg-neutral-800 flex w-full items-center gap-2 rounded-lg px-3 py-2 relative">
          <Image
            src="/icon-search.svg"
            alt="search icon"
            width={18}
            height={18}
            className="opacity-70"
          />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search city..."
            aria-label="Search city"
            value={query}
            onChange={handleInputChange}
            className="w-full bg-transparent focus:outline-none px-2 text-sm placeholder-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-full mt-[-1.5rem] bg-neutral-800 rounded-lg overflow-hidden">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSelectCity(city)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-neutral-700 transition-colors m-1 rounded-s"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
