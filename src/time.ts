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

/** X-axis tick positions: one per day, at local midnight */
export function midnightTicks(points: { time: string }[]): string[] {
  return points.filter((p) => p.time.endsWith("T00:00")).map((p) => p.time);
}
