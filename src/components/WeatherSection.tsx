import AsyncSection from "./AsyncSection";
import ForecastChart from "./ForecastChart";
import type { HourPoint } from "../weather";
import type { AsyncState } from "../useAsyncData";

function WeatherSection({ state }: { state: AsyncState<HourPoint[]> }) {
  return (
    <AsyncSection state={state} noun="forecast">
      {(hours) => (
        <>
          <ForecastChart
            title="Wind speed"
            unit="kn"
            data={hours}
            series={[{ dataKey: "windSpeed", label: "Wind speed", color: "var(--c-wind)" }]}
            kind="line"
          />
          <ForecastChart
            title="Precipitation"
            unit="mm"
            data={hours}
            series={[{ dataKey: "precipitation", label: "Precipitation", color: "var(--c-precip)" }]}
            kind="bar"
          />
          <ForecastChart
            title="Visibility"
            unit="mi"
            data={hours}
            series={[{ dataKey: "visibility", label: "Visibility", color: "var(--c-vis)" }]}
            kind="line"
          />
        </>
      )}
    </AsyncSection>
  );
}

export default WeatherSection;
