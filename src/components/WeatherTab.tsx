import ForecastChart from "./ForecastChart";
import { fetchForecast } from "../weather";
import { useAsyncData } from "../useAsyncData";

function WeatherTab() {
  const { data: forecast, error, retry } = useAsyncData(fetchForecast);

  if (error) {
    return (
      <div className="notice" role="alert">
        <p>Couldn’t load the forecast: {error}</p>
        <button onClick={retry}>Try again</button>
      </div>
    );
  }

  if (!forecast) {
    return <p className="notice-muted">Loading forecast…</p>;
  }

  return (
    <>
      <ForecastChart
        title="Wind speed"
        unit="kn"
        data={forecast.hours}
        dataKey="windSpeed"
        color="var(--c-wind)"
        kind="line"
      />
      <ForecastChart
        title="Precipitation"
        unit="mm"
        data={forecast.hours}
        dataKey="precipitation"
        color="var(--c-precip)"
        kind="bar"
      />
      <ForecastChart
        title="Visibility"
        unit="mi"
        data={forecast.hours}
        dataKey="visibility"
        color="var(--c-vis)"
        kind="line"
      />
    </>
  );
}

export default WeatherTab;
