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
import { formatDay, formatHour } from "../weather";

interface Props<T extends { time: string }> {
  title: string;
  unit: string;
  data: T[];
  dataKey: keyof T & string;
  /** CSS custom property for the series color, e.g. "var(--c-wind)" */
  color: string;
  kind: "line" | "bar";
}

interface TooltipPayload {
  active?: boolean;
  label?: string | number;
  payload?: { value: number }[];
}

function ChartTooltip({ active, label, payload, unit }: TooltipPayload & { unit: string }) {
  if (!active || !payload?.length || label == null) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        {payload[0].value} <span className="chart-tooltip-unit">{unit}</span>
      </div>
      <div className="chart-tooltip-label">{formatHour(String(label))}</div>
    </div>
  );
}

function ForecastChart<T extends { time: string }>({
  title,
  unit,
  data,
  dataKey,
  color,
  kind,
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
      <ResponsiveContainer width="100%" height={220}>
        {kind === "line" ? (
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            {axes}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap={0}>
            {axes}
            <Bar dataKey={dataKey} fill={color} radius={[1, 1, 0, 0]} isAnimationActive={false} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </section>
  );
}

export default ForecastChart;
