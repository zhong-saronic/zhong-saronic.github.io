import type { HourPoint } from "./weather";
import type { MarinePoint } from "./marine";

/** Demo feasibility rating. Order matters: worst wins. */
export type Status = "bad" | "okay" | "good";

export const STATUS_LABEL: Record<Status, string> = {
  bad: "No-Go",
  okay: "Caution",
  good: "Go",
};

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

// Demo-day thresholds (see design notes): red if any condition is bad,
// yellow if any is merely okay, green only when all four are good.
const windStatus = (kn: number): Status =>
  kn > 20 ? "bad" : kn >= 15 ? "okay" : "good";

const waveStatus = (ft: number): Status =>
  ft > 4 ? "bad" : ft >= 2 ? "okay" : "good";

const precipStatus = (mm: number): Status =>
  mm > 1 ? "bad" : mm > 0 ? "okay" : "good";

const visibilityStatus = (mi: number): Status =>
  mi < 2 ? "bad" : mi <= 5 ? "okay" : "good";

export function evaluateDemoStatus(
  weatherHours: HourPoint[],
  marineHours: MarinePoint[]
): StatusPoint[] {
  const n = Math.min(weatherHours.length, marineHours.length);
  const points: StatusPoint[] = [];

  for (let i = 0; i < n; i++) {
    const w = weatherHours[i];
    const m = marineHours[i];
    const conditions: ConditionCheck[] = [
      { label: "Wind", value: w.windSpeed, unit: "kn", status: windStatus(w.windSpeed) },
      { label: "Waves", value: m.waveHeight, unit: "ft", status: waveStatus(m.waveHeight) },
      { label: "Precip", value: w.precipitation, unit: "mm", status: precipStatus(w.precipitation) },
      { label: "Visibility", value: w.visibility, unit: "mi", status: visibilityStatus(w.visibility) },
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
