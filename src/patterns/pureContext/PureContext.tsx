import React from "react";
import type { SectionId, Validity } from "../../shared/types";

type Ctx = {
  validityBySection: Record<SectionId, Validity>;
  toggleOne: (id: SectionId) => void;
  setAll: (validity: Validity) => void;
};

const PureCtx = React.createContext<Ctx | null>(null);

export function PureContextProvider({
  sectionIds,
  children,
}: {
  sectionIds: SectionId[];
  children: React.ReactNode;
}) {
  const [validityBySection, setValidityBySection] = React.useState(() => {
    const map: Record<SectionId, Validity> = {};
    for (const id of sectionIds) map[id] = "invalid";
    return map;
  });

  React.useEffect(() => {
    const map: Record<SectionId, Validity> = {};
    for (const id of sectionIds) map[id] = "invalid";
    setValidityBySection(map);
  }, [sectionIds]);

  const toggleOne = React.useCallback((id: SectionId) => {
    setValidityBySection((prev) => ({
      ...prev,
      [id]: prev[id] === "valid" ? "invalid" : "valid",
    }));
  }, []);

  const setAll = React.useCallback((validity: Validity) => {
    setValidityBySection((prev) => {
      const next: Record<SectionId, Validity> = {};
      for (const id of Object.keys(prev)) next[id] = validity;
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ validityBySection, toggleOne, setAll }),
    [validityBySection, toggleOne, setAll],
  );

  return <PureCtx.Provider value={value}>{children}</PureCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePureContext() {
  const ctx = React.useContext(PureCtx);
  if (!ctx)
    throw new Error("usePureContext must be used within PureContextProvider");
  return ctx;
}
