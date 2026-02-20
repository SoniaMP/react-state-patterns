import type { SectionId } from "../../shared/types";
import { ValidityCell } from "../../shared/RenderBadge";
import { usePureContext } from "./PureContext";

function Cell({ id }: { id: SectionId }) {
  const { validityBySection } = usePureContext();
  return <ValidityCell validity={validityBySection[id]} id={id} pattern="pureContext" />;
}

export function PureContextColumn({ sectionIds }: { sectionIds: SectionId[] }) {
  return (
    <div className="cell-grid">
      {sectionIds.map((id) => (
        <Cell key={id} id={id} />
      ))}
    </div>
  );
}
