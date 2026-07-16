import ForecastChart from "./ForecastChart";
import { fetchMarineForecast } from "../marine";
import { useAsyncData } from "../useAsyncData";

function MarineSection() {
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
    <ForecastChart
      title="Wave height"
      unit="ft"
      data={forecast.hours}
      series={[
        { dataKey: "waveHeight", label: "Wave", color: "var(--c-wave)" },
        { dataKey: "windWaveHeight", label: "Wind wave", color: "var(--c-wind-wave)" },
        { dataKey: "swellWaveHeight", label: "Swell", color: "var(--c-swell)" },
      ]}
      kind="line"
      height={240}
    />
  );
}

export default MarineSection;
