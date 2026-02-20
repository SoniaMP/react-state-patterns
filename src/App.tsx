import React, { useSyncExternalStore } from "react";
import type { SectionId, Validity } from "./shared/types";
import { makeSectionIds } from "./shared/types";
import {
  logAction,
  subscribe as logSubscribe,
  getSnapshot as logSnapshot,
  clearLog,
} from "./shared/logStore";
import {
  ValidityProvider,
  useValidityContext,
} from "./patterns/context/ValidityContext";
import {
  ExternalStoreProvider,
  useExternalStore,
  ExternalStoreColumn,
} from "./patterns/externalStore/ExternalStoreDemo";
import { useValidityStore } from "./patterns/zustand/useValidityStore";
import { ContextColumn } from "./patterns/context/ContextDemo";
import {
  PureContextProvider,
  usePureContext,
} from "./patterns/pureContext/PureContext";
import { PureContextColumn } from "./patterns/pureContext/PureContextDemo";
import { ZustandColumn } from "./patterns/zustand/ZustandDemo";
import "./App.css";

function SharedControls({ sectionIds }: { sectionIds: SectionId[] }) {
  const { dispatch } = useValidityContext();
  const pureCtx = usePureContext();
  const extStore = useExternalStore();
  const zustandToggle = useValidityStore((s) => s.toggleOne);
  const zustandSetAll = useValidityStore((s) => s.setAll);

  const handleToggle = (id: SectionId) => {
    logAction(`Toggle ${id}`);
    dispatch({ type: "toggleOne", id });
    pureCtx.toggleOne(id);
    extStore.toggleOne(id);
    zustandToggle(id);
  };

  const handleSetAll = (validity: Validity) => {
    logAction(`Set all ${validity}`);
    dispatch({ type: "setAll", validity });
    pureCtx.setAll(validity);
    extStore.setAll(validity);
    zustandSetAll(validity);
  };

  return (
    <div className="controls">
      <div className="bulk-controls">
        <button className="btn btn-valid" onClick={() => handleSetAll("valid")}>
          All VALID
        </button>
        <button
          className="btn btn-invalid"
          onClick={() => handleSetAll("invalid")}
        >
          All INVALID
        </button>
      </div>
      <div className="toggle-grid">
        {sectionIds.map((id) => (
          <button
            key={id}
            className="btn-toggle"
            onClick={() => handleToggle(id)}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}

function LogCount({ label, count }: { label: string; count: number }) {
  const cls = count > 1 ? "log-count high" : "log-count low";
  return (
    <span className={cls}>
      {label}: {count}
    </span>
  );
}

function LogPanel() {
  const entries = useSyncExternalStore(logSubscribe, logSnapshot, logSnapshot);

  return (
    <div className="log-panel">
      <div className="log-header">
        <h3>Re-render log</h3>
        {entries.length > 0 && (
          <button className="btn-clear" onClick={clearLog}>
            Clear
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="log-empty">
          Click a button to see re-renders
        </p>
      ) : (
        <div className="log-entries">
          {entries.map((entry) => (
            <div key={entry.id} className="log-entry">
              <span className="log-time">{entry.time}</span>
              <span className="log-action">{entry.action}</span>
              <LogCount label="Ctx+Reducer" count={entry.counts.context} />
              <LogCount label="Ctx+State" count={entry.counts.pureContext} />
              <LogCount label="ExtStore" count={entry.counts.external} />
              <LogCount label="Zustand" count={entry.counts.zustand} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [count, setCount] = React.useState(30);
  const sectionIds = React.useMemo(() => makeSectionIds(count), [count]);

  return (
    <ValidityProvider sectionIds={sectionIds}>
      <PureContextProvider sectionIds={sectionIds}>
      <ExternalStoreProvider sectionIds={sectionIds}>
        <div className="app">
          <div className="header">
            <h2>Validity Patterns</h2>
            <label className="count-label">
              Sections:
              <input
                type="number"
                min={1}
                max={300}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
          </div>

          <SharedControls sectionIds={sectionIds} />

          <div className="columns">
            <div className="column">
              <h3>Context + Reducer</h3>
              <p className="column-hint">
                Re-renders ALL cells on any change
              </p>
              <ContextColumn sectionIds={sectionIds} />
            </div>
            <div className="column">
              <h3>Context + useState</h3>
              <p className="column-hint">
                Re-renders ALL cells on any change
              </p>
              <PureContextColumn sectionIds={sectionIds} />
            </div>
            <div className="column">
              <h3>useSyncExternalStore</h3>
              <p className="column-hint">
                Only re-renders the affected cell
              </p>
              <ExternalStoreColumn sectionIds={sectionIds} />
            </div>
            <div className="column">
              <h3>Zustand</h3>
              <p className="column-hint">
                Only re-renders the affected cell
              </p>
              <ZustandColumn sectionIds={sectionIds} />
            </div>
          </div>

          <LogPanel />
        </div>
      </ExternalStoreProvider>
      </PureContextProvider>
    </ValidityProvider>
  );
}
