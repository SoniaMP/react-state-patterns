import React from "react";
import type { SectionId } from "../../shared/types";
import { ValidityCell } from "../../shared/RenderBadge";
import { useValidityStore } from "./useValidityStore";

function Cell({ id }: { id: SectionId }) {
  const validity = useValidityStore((s) => s.validityBySection[id]);
  return <ValidityCell validity={validity} id={id} pattern="zustand" />;
}

export function ZustandColumn({ sectionIds }: { sectionIds: SectionId[] }) {
  const init = useValidityStore((s) => s.init);

  React.useEffect(() => {
    init(sectionIds);
  }, [init, sectionIds]);

  return (
    <div className="cell-grid">
      {sectionIds.map((id) => (
        <Cell key={id} id={id} />
      ))}
    </div>
  );
}
