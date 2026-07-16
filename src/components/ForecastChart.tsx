import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DataKey } from "recharts";
import { formatDay, formatHour } from "../weather";

export interface Series<T> {
  dataKey: DataKey<T>;
  label: string;
  /** CSS custom property for the series color, e.g. "var(--c-wind)" */
  color: string;
}

interface Props<T extends { time: string }> {
  title: string;
  unit: string;
  data: T[];
  series: Series<T>[];
  kind: "line" | "bar";
  height?: number;
}

interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
}

function ChartTooltip({
  active,
  label,
  payload,
  unit,
}: {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  unit: string;
}) {
  if (!active || !payload?.length || label == null) return null;
  return (
    <div className="chart-tooltip">
      {payload.length === 1 ? (
        <div className="chart-tooltip-value">
          {payload[0].value} <span className="chart-tooltip-unit">{unit}</span>
        </div>
      ) : (
        payload.map((entry, i) => (
          <div key={i} className="chart-tooltip-row">
            <span className="line-key" style={{ background: entry.color }} />
            <span className="chart-tooltip-value">
              {entry.value} <span className="chart-tooltip-unit">{unit}</span>
            </span>
            <span className="chart-tooltip-name">{entry.name}</span>
          </div>
        ))
      )}
      <div className="chart-tooltip-label">{formatHour(String(label))}</div>
    </div>
  );
}

function ForecastChart<T extends { time: string }>({
  title,
  unit,
  data,
  series,
  kind,
  height = 150,
}: Props<T>) {
  // One tick per day, at local midnight
  const dayTicks = data
    .filter((h) => h.time.endsWith("T00:00"))
    .map((h) => h.time);

  const axes = (
    <>
      <CartesianGrid stroke="var(--grid)" strokeWidth={1} vertical={false} />
      <XAxis
        dataKey="time"
        ticks={dayTicks}
        interval={0}
        tickFormatter={formatDay}
        tick={{ fill: "var(--muted)", fontSize: 12 }}
        tickLine={false}
        axisLine={{ stroke: "var(--axis)" }}
      />
      <YAxis
        width={40}
        tick={{ fill: "var(--muted)", fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        domain={[0, "auto"]}
      />
      <Tooltip
        content={<ChartTooltip unit={unit} />}
        cursor={
          kind === "line"
            ? { stroke: "var(--axis)", strokeWidth: 1 }
            : { fill: "var(--grid)", fillOpacity: 0.6 }
        }
        isAnimationActive={false}
      />
    </>
  );

  return (
    <section className="card">
      <h2>
        {title} <span className="card-unit">{unit}</span>
      </h2>
      {series.length > 1 && (
        <div className="chart-legend">
          {series.map((s) => (
            <span key={s.label} className="legend-item">
              <span className="line-key" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {kind === "line" ? (
          <LineChart
            data={data}
            syncId="forecast"
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            {axes}
            {series.map((s) => (
              <Line
                key={s.label}
                type="monotone"
                name={s.label}
                dataKey={s.dataKey}
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                dot={false}
                activeDot={{ r: 4, fill: s.color, stroke: "var(--surface)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart
            data={data}
            syncId="forecast"
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            barCategoryGap={0}
          >
            {axes}
            {series.map((s) => (
              <Bar
                key={s.label}
                name={s.label}
                dataKey={s.dataKey}
                fill={s.color}
                radius={[1, 1, 0, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </section>
  );
}

export default ForecastChart;
