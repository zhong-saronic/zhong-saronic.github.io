import { useState } from "react";
import MarineTab from "./components/MarineTab";
import WeatherTab from "./components/WeatherTab";

type Tab = "weather" | "marine";

const TABS: { id: Tab; label: string }[] = [
  { id: "weather", label: "Weather" },
  { id: "marine", label: "Marine Conditions" },
];

function App() {
  const [tab, setTab] = useState<Tab>("weather");

  return (
    <main className="page">
      <header className="page-header">
        <h1>Gulfport Marine Weather</h1>
        <p className="page-sub">7-day hourly forecast · 30.37°N, 89.09°W · local time</p>
      </header>

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "tab tab-active" : "tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "weather" ? <WeatherTab /> : <MarineTab />}

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
