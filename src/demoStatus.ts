import type { HourPoint } from "./weather";
import type { MarinePoint } from "./marine";

/** Demo feasibility rating. Order matters: worst wins. */
export type Status = "bad" | "okay" | "good";

export const STATUS_LABEL: Record<Status, string> = {
  bad: "No-Go",
  okay: "Caution",
  good: "Go",
};

export const STATUS_COLOR: Record<Status, string> = {
  bad: "var(--status-bad)",
  okay: "var(--status-okay)",
  good: "var(--status-good)",
};

/**
 * Two zone boundaries, lower <= upper.
 * higherWorse (wind, waves, precip): go <= lower < caution <= upper < no-go
 * lowerWorse (visibility):           no-go < lower <= caution < upper <= go
 */
export interface ThresholdPair {
  lower: number;
  upper: number;
}

export type Direction = "higherWorse" | "lowerWorse";

export interface Thresholds {
  wind: ThresholdPair;
  wave: ThresholdPair;
  precip: ThresholdPair;
  visibility: ThresholdPair;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  wind: { lower: 15, upper: 20 }, // kn
  wave: { lower: 2, upper: 4 }, // ft
  precip: { lower: 0, upper: 1 }, // mm — good only when bone dry
  visibility: { lower: 2, upper: 5 }, // mi
};

/** Everything the UI and evaluator need to know about one condition */
export interface ThresholdConfig {
  key: keyof Thresholds;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  direction: Direction;
  getValue: (w: HourPoint, m: MarinePoint) => number;
}

export const THRESHOLD_CONFIG: ThresholdConfig[] = [
  { key: "wind", label: "Wind speed", unit: "kn", min: 0, max: 40, step: 1, direction: "higherWorse", getValue: (w) => w.windSpeed },
  { key: "wave", label: "Wave height", unit: "ft", min: 0, max: 10, step: 0.5, direction: "higherWorse", getValue: (_w, m) => m.waveHeight },
  { key: "precip", label: "Precipitation", unit: "mm", min: 0, max: 5, step: 0.1, direction: "higherWorse", getValue: (w) => w.precipitation },
  { key: "visibility", label: "Visibility", unit: "mi", min: 0, max: 15, step: 0.5, direction: "lowerWorse", getValue: (w) => w.visibility },
];

function rateValue(value: number, pair: ThresholdPair, direction: Direction): Status {
  if (direction === "higherWorse") {
    return value > pair.upper ? "bad" : value > pair.lower ? "okay" : "good";
  }
  return value < pair.lower ? "bad" : value < pair.upper ? "okay" : "good";
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
  thresholds: Thresholds
): StatusPoint[] {
  const n = Math.min(weatherHours.length, marineHours.length);
  const points: StatusPoint[] = [];

  for (let i = 0; i < n; i++) {
    const w = weatherHours[i];
    const m = marineHours[i];

    const conditions: ConditionCheck[] = THRESHOLD_CONFIG.map((cfg) => {
      const value = cfg.getValue(w, m);
      return {
        label: cfg.label,
        value,
        unit: cfg.unit,
        status: rateValue(value, thresholds[cfg.key], cfg.direction),
      };
    });

    const status: Status = conditions.some((c) => c.status === "bad")
      ? "bad"
      : conditions.some((c) => c.status === "okay")
        ? "okay"
        : "good";

    points.push({ time: w.time, value: 1, status, conditions });
  }

  return points;
}
