import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import type { HourPoint } from "../weather";
import type { MarinePoint } from "../marine";
import { formatHour, midnightTicks } from "../time";
import {
  DEFAULT_THRESHOLDS,
  evaluateDemoStatus,
  STATUS_COLOR,
  STATUS_LABEL,
  THRESHOLD_CONFIG,
} from "../demoStatus";
import type { Status, StatusPoint, Thresholds } from "../demoStatus";
import { xAxisProps } from "./ForecastChart";
import ThresholdSlider from "./ThresholdSlider";

const STORAGE_KEY = "demoThresholds.v2";

function loadThresholds(): Thresholds {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THRESHOLDS;
    const parsed = JSON.parse(raw) as Partial<Thresholds>;
    const result = { ...DEFAULT_THRESHOLDS };
    for (const { key } of THRESHOLD_CONFIG) {
      const pair = parsed[key];
      if (
        pair &&
        typeof pair.lower === "number" &&
        typeof pair.upper === "number" &&
        pair.lower <= pair.upper
      ) {
        result[key] = pair;
      }
    }
    return result;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

function saveThresholds(t: Thresholds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  } catch {
    // Private browsing or full storage — settings just won't persist
  }
}

interface Props {
  weatherHours: HourPoint[];
  marineHours: MarinePoint[];
}

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: StatusPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        <span className="status-dot" style={{ background: STATUS_COLOR[point.status] }} />
        {STATUS_LABEL[point.status]}
      </div>
      {point.conditions.map((c) => (
        <div key={c.label} className="chart-tooltip-row">
          <span className="status-dot" style={{ background: STATUS_COLOR[c.status] }} />
          <span className="chart-tooltip-name">
            {c.label} {c.value} {c.unit} · {STATUS_LABEL[c.status]}
          </span>
        </div>
      ))}
      <div className="chart-tooltip-label">{formatHour(point.time)}</div>
    </div>
  );
}

function GoNoGoBar({ weatherHours, marineHours }: Props) {
  const [thresholds, setThresholds] = useState<Thresholds>(loadThresholds);
  const [showSettings, setShowSettings] = useState(false);

  const updateThresholds = (next: Thresholds) => {
    setThresholds(next);
    saveThresholds(next);
  };

  const points = evaluateDemoStatus(weatherHours, marineHours, thresholds);

  return (
    <section className="card">
      <div className="card-head">
        <h2>Demo Go / No-Go</h2>
        <button className="ghost-btn" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? "Done" : "⚙ Thresholds"}
        </button>
      </div>
      <div className="chart-legend">
        {(["good", "okay", "bad"] as Status[]).map((s) => (
          <span key={s} className="legend-item">
            <span className="legend-swatch" style={{ background: STATUS_COLOR[s] }} />
            {STATUS_LABEL[s]}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={72}>
        <BarChart
          data={points}
          syncId="forecast"
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barCategoryGap={0}
        >
          <XAxis {...xAxisProps(midnightTicks(points))} />
          {/* Hidden ticks but reserved width, so the plot area lines up with the charts below */}
          <YAxis width={40} domain={[0, 1]} tick={false} tickLine={false} axisLine={false} />
          <Tooltip
            content={<StatusTooltip />}
            cursor={{ fill: "var(--grid)", fillOpacity: 0.6 }}
            isAnimationActive={false}
          />
          <Bar dataKey="value" isAnimationActive={false}>
            {points.map((p) => (
              <Cell key={p.time} fill={STATUS_COLOR[p.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {showSettings && (
        <div className="threshold-panel">
          {THRESHOLD_CONFIG.map((cfg) => (
            <ThresholdSlider
              key={cfg.key}
              config={cfg}
              value={thresholds[cfg.key]}
              onChange={(pair) => updateThresholds({ ...thresholds, [cfg.key]: pair })}
            />
          ))}
          <button className="ghost-btn" onClick={() => updateThresholds(DEFAULT_THRESHOLDS)}>
            Reset to defaults
          </button>
        </div>
      )}
    </section>
  );
}

export default GoNoGoBar;
