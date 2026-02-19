import type { SectionId, Validity } from "../../shared/types";

type Listener = () => void;

export function createValidityStore(sectionIds: SectionId[]) {
  let validityBySection: Record<SectionId, Validity> = Object.fromEntries(
    sectionIds.map((id) => [id, "invalid"]),
  ) as Record<SectionId, Validity>;

  const listeners = new Set<Listener>();

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const emit = () => {
    for (const l of listeners) l();
  };

  const getValidity = (id: SectionId) => validityBySection[id];

  const getSnapshot = () => validityBySection;

  const setOne = (id: SectionId, validity: Validity) => {
    if (validityBySection[id] === validity) return;
    validityBySection = { ...validityBySection, [id]: validity };
    emit();
  };

  const toggleOne = (id: SectionId) => {
    const next: Validity =
      validityBySection[id] === "valid" ? "invalid" : "valid";
    validityBySection = { ...validityBySection, [id]: next };
    emit();
  };

  const setAll = (validity: Validity) => {
    const next: Record<SectionId, Validity> = {};
    for (const id of Object.keys(validityBySection)) next[id] = validity;
    validityBySection = next;
    emit();
  };

  return {
    subscribe,
    getValidity,
    getSnapshot,
    setOne,
    toggleOne,
    setAll,
  };
}

export type ValidityStore = ReturnType<typeof createValidityStore>;
