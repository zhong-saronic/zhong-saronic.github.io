const METERS_PER_MILE = 1609.34;

// timezone=auto so timestamps arrive in local (America/Chicago) time —
// this is a "check each morning" dashboard, GMT would be misleading.
const API_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=30.37&longitude=-89.09" +
  "&hourly=wind_speed_10m,precipitation,visibility" +
  "&wind_speed_unit=kn&timezone=auto";

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    precipitation: number[];
    visibility: number[];
  };
}

export interface HourPoint {
  /** Local ISO time, e.g. "2026-07-15T09:00" */
  time: string;
  /** Wind speed at 10 m, knots */
  windSpeed: number;
  /** Precipitation, mm */
  precipitation: number;
  /** Visibility, statute miles */
  visibility: number;
}

export async function fetchForecast(): Promise<HourPoint[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Open-Meteo returned ${res.status} ${res.statusText}`);
  }
  const data: OpenMeteoResponse = await res.json();

  const { time, wind_speed_10m, precipitation, visibility } = data.hourly;

  return time.map((t, i) => ({
    time: t,
    windSpeed: wind_speed_10m[i],
    precipitation: precipitation[i],
    visibility: Math.round((visibility[i] / METERS_PER_MILE) * 10) / 10,
  }));
}
