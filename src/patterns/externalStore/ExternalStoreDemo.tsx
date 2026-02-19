import React from "react";
import { useSyncExternalStore } from "react";
import type { SectionId } from "../../shared/types";
import { ValidityCell } from "../../shared/RenderBadge";
import { createValidityStore, type ValidityStore } from "./store";

const StoreCtx = React.createContext<ValidityStore | null>(null);

export function ExternalStoreProvider({
  sectionIds,
  children,
}: {
  sectionIds: SectionId[];
  children: React.ReactNode;
}) {
  const store = React.useMemo(
    () => createValidityStore(sectionIds),
    [sectionIds],
  );
  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExternalStore() {
  const store = React.useContext(StoreCtx);
  if (!store)
    throw new Error("useExternalStore must be within ExternalStoreProvider");
  return store;
}

function Cell({ id }: { id: SectionId }) {
  const store = useExternalStore();
  const validity = useSyncExternalStore(
    store.subscribe,
    () => store.getValidity(id),
    () => store.getValidity(id),
  );
  return <ValidityCell validity={validity} id={id} pattern="external" />;
}

export function ExternalStoreColumn({
  sectionIds,
}: {
  sectionIds: SectionId[];
}) {
  return (
    <div className="cell-grid">
      {sectionIds.map((id) => (
        <Cell key={id} id={id} />
      ))}
    </div>
  );
}
