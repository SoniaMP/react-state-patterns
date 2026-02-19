import React from "react";
import type { SectionId, Validity } from "../../shared/types";

type State = {
  validityBySection: Record<SectionId, Validity>;
};

type Action =
  | { type: "setOne"; id: SectionId; validity: Validity }
  | { type: "toggleOne"; id: SectionId }
  | { type: "setAll"; validity: Validity };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setOne": {
      if (state.validityBySection[action.id] === action.validity) return state;
      return {
        validityBySection: {
          ...state.validityBySection,
          [action.id]: action.validity,
        },
      };
    }
    case "toggleOne": {
      const current = state.validityBySection[action.id];
      const next: Validity = current === "valid" ? "invalid" : "valid";
      return {
        validityBySection: {
          ...state.validityBySection,
          [action.id]: next,
        },
      };
    }
    case "setAll": {
      const nextMap: Record<SectionId, Validity> = {};
      for (const id of Object.keys(state.validityBySection)) {
        nextMap[id] = action.validity;
      }
      return { validityBySection: nextMap };
    }
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const ValidityCtx = React.createContext<Ctx | null>(null);

export function ValidityProvider({
  sectionIds,
  children,
}: {
  sectionIds: SectionId[];
  children: React.ReactNode;
}) {
  const initial: State = React.useMemo(() => {
    const map: Record<SectionId, Validity> = {};
    for (const id of sectionIds) map[id] = "invalid";
    return { validityBySection: map };
  }, [sectionIds]);

  const [state, dispatch] = React.useReducer(reducer, initial);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <ValidityCtx.Provider value={value}>{children}</ValidityCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useValidityContext() {
  const ctx = React.useContext(ValidityCtx);
  if (!ctx)
    throw new Error("useValidityContext must be used within ValidityProvider");
  return ctx;
}
