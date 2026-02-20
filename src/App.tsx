import React, { Profiler, useSyncExternalStore } from "react";
import type { SectionId, Validity } from "./shared/types";
import { makeSectionIds } from "./shared/types";
import {
  logAction,
  logProfilerDuration,
  subscribe as logSubscribe,
  getSnapshot as logSnapshot,
  clearLog,
} from "./shared/logStore";
import type { PatternKey } from "./shared/logStore";
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
import { ContextMemoColumn } from "./patterns/contextMemo/ContextMemoDemo";
import { ZustandColumn } from "./patterns/zustand/ZustandDemo";
import { WhyPanel } from "./shared/WhyPanel";
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

  const handleRapidFire = () => {
    let i = 0;
    const fire = () => {
      if (i >= 10) return;
      const randomId = sectionIds[Math.floor(Math.random() * sectionIds.length)];
      handleToggle(randomId);
      i++;
      setTimeout(fire, 50);
    };
    fire();
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
        <button className="btn btn-stress" onClick={handleRapidFire}>
          Rapid fire (10x)
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

function LogCount({ label, count, ms }: { label: string; count: number; ms: number | null }) {
  const cls = count > 1 ? "log-count high" : "log-count low";
  return (
    <span className={cls}>
      {label}: {count}{ms !== null && <span className="log-ms"> {ms === 0 ? "<0.1" : ms.toFixed(3)}ms</span>}
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
              <LogCount label="Ctx+Reducer" count={entry.counts.context} ms={entry.durationMs.context} />
              <LogCount label="Ctx+State" count={entry.counts.pureContext} ms={entry.durationMs.pureContext} />
              <LogCount label="Ctx+Memo" count={entry.counts.contextMemo} ms={entry.durationMs.contextMemo} />
              <LogCount label="ExtStore" count={entry.counts.external} ms={entry.durationMs.external} />
              <LogCount label="Zustand" count={entry.counts.zustand} ms={entry.durationMs.zustand} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function onProfilerRender(pattern: PatternKey) {
  return (_id: string, _phase: string, actualDuration: number) => {
    logProfilerDuration(pattern, actualDuration);
  };
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

          <LogPanel />

          <div className="columns">
            <div className="column">
              <h3>Context + Reducer</h3>
              <p className="column-hint">
                Re-renders ALL cells on any change
              </p>
              <WhyPanel>
                useContext() re-renders every consumer when the provider value changes.
                The entire state object is the value, so any change invalidates all consumers.
              </WhyPanel>
              <Profiler id="context" onRender={onProfilerRender("context")}>
                <ContextColumn sectionIds={sectionIds} />
              </Profiler>
            </div>
            <div className="column">
              <h3>Context + useState</h3>
              <p className="column-hint">
                Re-renders ALL cells on any change
              </p>
              <WhyPanel>
                Same mechanism as Reducer. Whether you use useState or useReducer doesn't matter
                — the context value is a new object on every change.
              </WhyPanel>
              <Profiler id="pureContext" onRender={onProfilerRender("pureContext")}>
                <PureContextColumn sectionIds={sectionIds} />
              </Profiler>
            </div>
            <div className="column">
              <h3>Context + memo()</h3>
              <p className="column-hint">
                memo() can't prevent context re-renders
              </p>
              <WhyPanel>
                React.memo() compares props, but context changes bypass memo entirely.
                If a component reads from useContext(), it re-renders whenever that context changes.
              </WhyPanel>
              <Profiler id="contextMemo" onRender={onProfilerRender("contextMemo")}>
                <ContextMemoColumn sectionIds={sectionIds} />
              </Profiler>
            </div>
            <div className="column">
              <h3>useSyncExternalStore</h3>
              <p className="column-hint">
                Only re-renders the affected cell
              </p>
              <WhyPanel>
                Each cell subscribes with a selector that returns only its value.
                React compares the result with Object.is() — if it didn't change, no re-render.
              </WhyPanel>
              <Profiler id="external" onRender={onProfilerRender("external")}>
                <ExternalStoreColumn sectionIds={sectionIds} />
              </Profiler>
            </div>
            <div className="column">
              <h3>Zustand</h3>
              <p className="column-hint">
                Only re-renders the affected cell
              </p>
              <WhyPanel>
                Uses useSyncExternalStore internally with per-selector subscriptions.
                Same mechanism as external store but with a cleaner API.
              </WhyPanel>
              <Profiler id="zustand" onRender={onProfilerRender("zustand")}>
                <ZustandColumn sectionIds={sectionIds} />
              </Profiler>
            </div>
          </div>
        </div>
      </ExternalStoreProvider>
      </PureContextProvider>
    </ValidityProvider>
  );
}
