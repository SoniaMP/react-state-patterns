import { create } from "zustand";
import type { SectionId, Validity } from "../../shared/types";

type ValidityState = {
  validityBySection: Record<SectionId, Validity>;
  init: (sectionIds: SectionId[]) => void;
  toggleOne: (id: SectionId) => void;
  setAll: (validity: Validity) => void;
};

export const useValidityStore = create<ValidityState>((set) => ({
  validityBySection: {},
  init: (sectionIds) =>
    set(() => ({
      validityBySection: Object.fromEntries(
        sectionIds.map((id) => [id, "invalid"]),
      ) as Record<SectionId, Validity>,
    })),
  toggleOne: (id) =>
    set((state) => {
      const current = state.validityBySection[id];
      const next: Validity = current === "valid" ? "invalid" : "valid";
      return {
        validityBySection: { ...state.validityBySection, [id]: next },
      };
    }),
  setAll: (validity) =>
    set((state) => {
      const next: Record<SectionId, Validity> = {};
      for (const id of Object.keys(state.validityBySection))
        next[id] = validity;
      return { validityBySection: next };
    }),
}));
