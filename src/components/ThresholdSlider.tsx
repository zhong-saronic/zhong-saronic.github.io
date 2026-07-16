import { STATUS_COLOR } from "../demoStatus";
import type { Direction, ThresholdConfig, ThresholdPair } from "../demoStatus";

interface Props {
  config: ThresholdConfig;
  value: ThresholdPair;
  onChange: (pair: ThresholdPair) => void;
}

const round = (v: number) => Math.round(v * 100) / 100;

function zoneSummary(direction: Direction, { lower, upper }: ThresholdPair, unit: string): string {
  if (direction === "higherWorse") {
    return lower === upper
      ? `Go ≤ ${lower} · No-Go > ${upper} ${unit}`
      : `Go ≤ ${lower} · Caution ${lower}–${upper} · No-Go > ${upper} ${unit}`;
  }
  return lower === upper
    ? `No-Go < ${lower} · Go ≥ ${upper} ${unit}`
    : `No-Go < ${lower} · Caution ${lower}–${upper} · Go ≥ ${upper} ${unit}`;
}

function ThresholdSlider({ config, value, onChange }: Props) {
  const { label, unit, min, max, step, direction } = config;

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const [p1, p2] = [pct(value.lower), pct(value.upper)];

  // Paint the track with the actual zones so the handles visibly divide
  // green / yellow / red (reversed for visibility, where lower is worse)
  const [cLow, cHigh] =
    direction === "higherWorse"
      ? [STATUS_COLOR.good, STATUS_COLOR.bad]
      : [STATUS_COLOR.bad, STATUS_COLOR.good];
  const gradient =
    `linear-gradient(to right, ${cLow} 0% ${p1}%, ` +
    `${STATUS_COLOR.okay} ${p1}% ${p2}%, ${cHigh} ${p2}% 100%)`;

  const setLower = (raw: number) =>
    onChange({ ...value, lower: round(Math.min(raw, value.upper)) });
  const setUpper = (raw: number) =>
    onChange({ ...value, upper: round(Math.max(raw, value.lower)) });

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
          value={value.lower}
          onChange={(e) => setLower(Number(e.target.value))}
          aria-label={`${label}: first zone boundary (${unit})`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.upper}
          onChange={(e) => setUpper(Number(e.target.value))}
          aria-label={`${label}: second zone boundary (${unit})`}
        />
      </div>
    </div>
  );
}

export default ThresholdSlider;
