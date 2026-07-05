// Temperature: Base is Celsius
export const formatTemp = (celsius: number, unit: "celsius" | "fahrenheit") => {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

// Wind: Base is m/s (from OpenWeather) or km/h depending on how your backend parsed it. 
// Assuming your backend parsed it to km/h or you want to format from m/s:
export const formatWind = (speedKmh: number, unit: "kmh" | "mph") => {
  if (unit === "mph") {
    return Math.round(speedKmh * 0.621371); // km/h to mph
  }
  return Math.round(speedKmh);
};

// Precipitation: Base is mm
export const formatPrecipitation = (mm: number, unit: "mm" | "in") => {
  if (unit === "in") {
    return (mm / 25.4).toFixed(2); // mm to inches, rounded to 2 decimals
  }
  return mm.toFixed(1);
};
