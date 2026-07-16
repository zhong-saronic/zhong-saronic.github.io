import type { Direction, ThresholdPair } from "../demoStatus";

interface Props {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  direction: Direction;
  value: ThresholdPair;
  onChange: (pair: ThresholdPair) => void;
}

const round = (v: number) => Math.round(v * 100) / 100;

function zoneSummary(direction: Direction, { t1, t2 }: ThresholdPair, unit: string): string {
  if (direction === "higherWorse") {
    return t1 === t2
      ? `Go ≤ ${t1} · No-Go > ${t2} ${unit}`
      : `Go ≤ ${t1} · Caution ${t1}–${t2} · No-Go > ${t2} ${unit}`;
  }
  return t1 === t2
    ? `No-Go < ${t1} · Go ≥ ${t2} ${unit}`
    : `No-Go < ${t1} · Caution ${t1}–${t2} · Go ≥ ${t2} ${unit}`;
}

function ThresholdSlider({ label, unit, min, max, step, direction, value, onChange }: Props) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const [p1, p2] = [pct(value.t1), pct(value.t2)];

  // Paint the track with the actual zones so the handles visibly divide
  // green / yellow / red (reversed for visibility, where lower is worse)
  const [cLow, cHigh] =
    direction === "higherWorse"
      ? ["var(--status-good)", "var(--status-bad)"]
      : ["var(--status-bad)", "var(--status-good)"];
  const gradient =
    `linear-gradient(to right, ${cLow} 0% ${p1}%, ` +
    `var(--status-okay) ${p1}% ${p2}%, ${cHigh} ${p2}% 100%)`;

  const setT1 = (raw: number) => onChange({ ...value, t1: round(Math.min(raw, value.t2)) });
  const setT2 = (raw: number) => onChange({ ...value, t2: round(Math.max(raw, value.t1)) });

  return (
    <div className="threshold-row">
      <div className="threshold-head">
        <span className="threshold-label">
          {label} <span className="card-unit">{unit}</span>
        </span>
        <span className="threshold-zones">{zoneSummary(direction, value, unit)}</span>
      </div>
      <div className="dual-slider">
        <div className="zone-track" style={{ background: gradient }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.t1}
          onChange={(e) => setT1(Number(e.target.value))}
          aria-label={`${label}: first zone boundary (${unit})`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.t2}
          onChange={(e) => setT2(Number(e.target.value))}
          aria-label={`${label}: second zone boundary (${unit})`}
        />
      </div>
    </div>
  );
}

export default ThresholdSlider;
