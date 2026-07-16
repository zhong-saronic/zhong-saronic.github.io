const METERS_PER_MILE = 1609.34;

// timezone=auto so timestamps arrive in local (America/Chicago) time —
// this is a "check each morning" dashboard, GMT would be misleading.
const API_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=30.37&longitude=-89.09" +
  "&hourly=wind_speed_10m,precipitation,visibility" +
  "&wind_speed_unit=kn&timezone=auto";

interface OpenMeteoResponse {
  timezone_abbreviation: string;
  hourly_units: {
    wind_speed_10m: string;
    precipitation: string;
    visibility: string;
  };
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

export interface Forecast {
  timezoneAbbreviation: string;
  hours: HourPoint[];
}

export async function fetchForecast(): Promise<Forecast> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Open-Meteo returned ${res.status} ${res.statusText}`);
  }
  const data: OpenMeteoResponse = await res.json();

  const { time, wind_speed_10m, precipitation, visibility } = data.hourly;

  const hours: HourPoint[] = time.map((t, i) => ({
    time: t,
    windSpeed: wind_speed_10m[i],
    precipitation: precipitation[i],
    visibility: Math.round((visibility[i] / METERS_PER_MILE) * 10) / 10,
  }));

  return { timezoneAbbreviation: data.timezone_abbreviation, hours };
}

/** "2026-07-16T15:00" → "Thu 16" */
export function formatDay(isoLocal: string): string {
  const d = new Date(isoLocal);
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

/** "2026-07-16T15:00" → "Thu, Jul 16, 3 PM" */
export function formatHour(isoLocal: string): string {
  const d = new Date(isoLocal);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
  });
}
