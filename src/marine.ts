const FEET_PER_METER = 3.28084;

// Same spot as the weather forecast; timezone=auto keeps hours local.
const MARINE_API_URL =
  "https://marine-api.open-meteo.com/v1/marine" +
  "?latitude=30.37&longitude=-89.09" +
  "&hourly=wave_height,wind_wave_height,swell_wave_height" +
  "&timezone=auto";

interface MarineApiResponse {
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    wave_height: number[];
    wind_wave_height: number[];
    swell_wave_height: number[];
  };
}

export interface MarinePoint {
  /** Local ISO time, e.g. "2026-07-15T09:00" */
  time: string;
  /** Significant wave height, feet */
  waveHeight: number;
  /** Wind wave height, feet */
  windWaveHeight: number;
  /** Swell wave height, feet */
  swellWaveHeight: number;
}

export interface MarineForecast {
  timezoneAbbreviation: string;
  hours: MarinePoint[];
}

const toFeet = (meters: number) => Math.round(meters * FEET_PER_METER * 10) / 10;

export async function fetchMarineForecast(): Promise<MarineForecast> {
  const res = await fetch(MARINE_API_URL);
  if (!res.ok) {
    throw new Error(`Open-Meteo marine returned ${res.status} ${res.statusText}`);
  }
  const data: MarineApiResponse = await res.json();

  const { time, wave_height, wind_wave_height, swell_wave_height } = data.hourly;

  const hours: MarinePoint[] = time.map((t, i) => ({
    time: t,
    waveHeight: toFeet(wave_height[i]),
    windWaveHeight: toFeet(wind_wave_height[i]),
    swellWaveHeight: toFeet(swell_wave_height[i]),
  }));

  return { timezoneAbbreviation: data.timezone_abbreviation, hours };
}
