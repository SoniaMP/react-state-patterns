import React from "react";
import type { SectionId } from "../../shared/types";
import { ValidityCell } from "../../shared/RenderBadge";
import { useValidityContext } from "../context/ValidityContext";

const Cell = React.memo(function Cell({ id }: { id: SectionId }) {
  const { state } = useValidityContext();
  return <ValidityCell validity={state.validityBySection[id]} id={id} pattern="contextMemo" />;
});

export function ContextMemoColumn({ sectionIds }: { sectionIds: SectionId[] }) {
  return (
    <div className="cell-grid">
      {sectionIds.map((id) => (
        <Cell key={id} id={id} />
      ))}
    </div>
  );
}
