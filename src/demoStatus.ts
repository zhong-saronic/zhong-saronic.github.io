import type { HourPoint } from "./weather";
import type { MarinePoint } from "./marine";

/** Demo feasibility rating. Order matters: worst wins. */
export type Status = "bad" | "okay" | "good";

export const STATUS_LABEL: Record<Status, string> = {
  bad: "No-Go",
  okay: "Caution",
  good: "Go",
};

/**
 * Two zone boundaries, t1 <= t2.
 * higherWorse (wind, waves, precip): good <= t1 < caution <= t2 < no-go
 * lowerWorse (visibility):           no-go < t1 <= caution < t2 <= good
 */
export interface ThresholdPair {
  t1: number;
  t2: number;
}

export type Direction = "higherWorse" | "lowerWorse";

export interface Thresholds {
  wind: ThresholdPair;
  wave: ThresholdPair;
  precip: ThresholdPair;
  visibility: ThresholdPair;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  wind: { t1: 15, t2: 20 }, // kn
  wave: { t1: 2, t2: 4 }, // ft
  precip: { t1: 0, t2: 1 }, // mm — good only when bone dry
  visibility: { t1: 2, t2: 5 }, // mi
};

/** Slider ranges and labels for the threshold settings UI */
export interface ThresholdConfig {
  key: keyof Thresholds;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  direction: Direction;
}

export const THRESHOLD_CONFIG: ThresholdConfig[] = [
  { key: "wind", label: "Wind speed", unit: "kn", min: 0, max: 40, step: 1, direction: "higherWorse" },
  { key: "wave", label: "Wave height", unit: "ft", min: 0, max: 10, step: 0.5, direction: "higherWorse" },
  { key: "precip", label: "Precipitation", unit: "mm", min: 0, max: 5, step: 0.1, direction: "higherWorse" },
  { key: "visibility", label: "Visibility", unit: "mi", min: 0, max: 15, step: 0.5, direction: "lowerWorse" },
];

export function rateValue(value: number, pair: ThresholdPair, direction: Direction): Status {
  if (direction === "higherWorse") {
    return value > pair.t2 ? "bad" : value > pair.t1 ? "okay" : "good";
  }
  return value < pair.t1 ? "bad" : value < pair.t2 ? "okay" : "good";
}

export interface ConditionCheck {
  label: string;
  value: number;
  unit: string;
  status: Status;
}

export interface StatusPoint {
  time: string;
  /** Constant bar height for the timeline chart */
  value: 1;
  status: Status;
  conditions: ConditionCheck[];
}

export function evaluateDemoStatus(
  weatherHours: HourPoint[],
  marineHours: MarinePoint[],
  thresholds: Thresholds = DEFAULT_THRESHOLDS
): StatusPoint[] {
  const n = Math.min(weatherHours.length, marineHours.length);
  const points: StatusPoint[] = [];

  for (let i = 0; i < n; i++) {
    const w = weatherHours[i];
    const m = marineHours[i];
    const conditions: ConditionCheck[] = [
      { label: "Wind", value: w.windSpeed, unit: "kn", status: rateValue(w.windSpeed, thresholds.wind, "higherWorse") },
      { label: "Waves", value: m.waveHeight, unit: "ft", status: rateValue(m.waveHeight, thresholds.wave, "higherWorse") },
      { label: "Precip", value: w.precipitation, unit: "mm", status: rateValue(w.precipitation, thresholds.precip, "higherWorse") },
      { label: "Visibility", value: w.visibility, unit: "mi", status: rateValue(w.visibility, thresholds.visibility, "lowerWorse") },
    ];

    const status: Status = conditions.some((c) => c.status === "bad")
      ? "bad"
      : conditions.some((c) => c.status === "okay")
        ? "okay"
        : "good";

    points.push({ time: w.time, value: 1, status, conditions });
  }

  return points;
}
