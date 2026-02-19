import type { SectionId } from "../../shared/types";
import { ValidityCell } from "../../shared/RenderBadge";
import { useValidityContext } from "./ValidityContext";

function Cell({ id }: { id: SectionId }) {
  const { state } = useValidityContext();
  return <ValidityCell validity={state.validityBySection[id]} id={id} pattern="context" />;
}

export function ContextColumn({ sectionIds }: { sectionIds: SectionId[] }) {
  return (
    <div className="cell-grid">
      {sectionIds.map((id) => (
        <Cell key={id} id={id} />
      ))}
    </div>
  );
}
