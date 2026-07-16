import MarineSection from "./components/MarineSection";
import WeatherSection from "./components/WeatherSection";

function App() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Gulfport Marine Weather</h1>
        <p className="page-sub">7-day hourly forecast · 30.37°N, 89.09°W · local time</p>
      </header>

      <WeatherSection />
      <MarineSection />

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
