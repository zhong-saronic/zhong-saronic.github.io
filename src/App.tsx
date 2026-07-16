import GoNoGoBar from "./components/GoNoGoBar";
import MarineSection from "./components/MarineSection";
import WeatherSection from "./components/WeatherSection";
import { fetchForecast } from "./weather";
import { fetchMarineForecast } from "./marine";
import { useAsyncData } from "./useAsyncData";

function App() {
  const weather = useAsyncData(fetchForecast);
  const marine = useAsyncData(fetchMarineForecast);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Gulfport Marine Weather</h1>
        <p className="page-sub">7-day hourly forecast · 30.37°N, 89.09°W · local time</p>
      </header>

      {weather.data && marine.data && (
        <GoNoGoBar weatherHours={weather.data.hours} marineHours={marine.data.hours} />
      )}

      <WeatherSection state={weather} />
      <MarineSection state={marine} />

      <footer className="page-footer">
        Data from{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        . Refresh the page for the latest forecast.
      </footer>
    </main>
  );
}

export default App;
