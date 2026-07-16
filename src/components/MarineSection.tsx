import AsyncSection from "./AsyncSection";
import ForecastChart from "./ForecastChart";
import type { MarinePoint } from "../marine";
import type { AsyncState } from "../useAsyncData";

function MarineSection({ state }: { state: AsyncState<MarinePoint[]> }) {
  return (
    <AsyncSection state={state} noun="marine forecast">
      {(hours) => (
        <ForecastChart
          title="Wave height"
          unit="ft"
          data={hours}
          series={[
            { dataKey: "waveHeight", label: "Wave", color: "var(--c-wave)" },
            { dataKey: "windWaveHeight", label: "Wind wave", color: "var(--c-wind-wave)" },
            { dataKey: "swellWaveHeight", label: "Swell", color: "var(--c-swell)" },
          ]}
          kind="line"
          height={240}
        />
      )}
    </AsyncSection>
  );
}

export default MarineSection;
