import ForecastChart from "./ForecastChart";
import { fetchMarineForecast } from "../marine";
import { useAsyncData } from "../useAsyncData";

function MarineTab() {
  const { data: forecast, error, retry } = useAsyncData(fetchMarineForecast);

  if (error) {
    return (
      <div className="notice" role="alert">
        <p>Couldn’t load the marine forecast: {error}</p>
        <button onClick={retry}>Try again</button>
      </div>
    );
  }

  if (!forecast) {
    return <p className="notice-muted">Loading marine forecast…</p>;
  }

  return (
    <>
      <ForecastChart
        title="Wave height"
        unit="ft"
        data={forecast.hours}
        dataKey="waveHeight"
        color="var(--c-wave)"
        kind="line"
      />
      <ForecastChart
        title="Wind wave height"
        unit="ft"
        data={forecast.hours}
        dataKey="windWaveHeight"
        color="var(--c-wind-wave)"
        kind="line"
      />
      <ForecastChart
        title="Swell wave height"
        unit="ft"
        data={forecast.hours}
        dataKey="swellWaveHeight"
        color="var(--c-swell)"
        kind="line"
      />
    </>
  );
}

export default MarineTab;
