import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HourPoint } from "../weather";
import type { MarinePoint } from "../marine";
import { formatDay, formatHour } from "../weather";
import { evaluateDemoStatus, STATUS_LABEL } from "../demoStatus";
import type { Status, StatusPoint } from "../demoStatus";

const STATUS_COLOR: Record<Status, string> = {
  good: "var(--status-good)",
  okay: "var(--status-okay)",
  bad: "var(--status-bad)",
};

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
  const points = evaluateDemoStatus(weatherHours, marineHours);
  const dayTicks = points
    .filter((p) => p.time.endsWith("T00:00"))
    .map((p) => p.time);

  return (
    <section className="card">
      <h2>Demo Go / No-Go</h2>
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
          <XAxis
            dataKey="time"
            ticks={dayTicks}
            interval={0}
            tickFormatter={formatDay}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--axis)" }}
          />
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
    </section>
  );
}

export default GoNoGoBar;
