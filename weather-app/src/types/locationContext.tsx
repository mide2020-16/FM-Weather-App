export interface Coordinates {
  lat: number;
  lon: number;
}

export default interface LocationContextType {
  coords: Coordinates | null;
  setCoords: (coords: Coordinates | null) => void;
  status: "loading" | "prompt" | "granted" | "denied";
  setStatus: (status: "loading" | "prompt" | "granted" | "denied") => void;
}
