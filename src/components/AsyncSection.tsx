import type { ReactNode } from "react";
import type { AsyncState } from "../useAsyncData";

interface Props<T> {
  state: AsyncState<T>;
  /** What's loading, for the messages — e.g. "forecast", "marine forecast" */
  noun: string;
  children: (data: T) => ReactNode;
}

/** Renders loading/error states for a data source, children once loaded */
function AsyncSection<T>({ state, noun, children }: Props<T>) {
  if (state.error) {
    return (
      <div className="notice" role="alert">
        <p>
          Couldn’t load the {noun}: {state.error}
        </p>
        <button onClick={state.retry}>Try again</button>
      </div>
    );
  }

  if (state.loading || !state.data) {
    return <p className="notice-muted">Loading {noun}…</p>;
  }

  return <>{children(state.data)}</>;
}

export default AsyncSection;
