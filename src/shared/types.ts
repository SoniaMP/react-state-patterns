export type Validity = "valid" | "invalid";
export type SectionId = string;

export const makeSectionIds = (count: number) =>
  Array.from({ length: count }, (_, i) => String(i + 1));
