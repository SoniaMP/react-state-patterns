import React from "react";
import type { Validity } from "./types";
import { logRender, type PatternKey } from "./logStore";

export function ValidityCell({
  validity,
  id,
  pattern,
}: {
  validity: Validity | undefined;
  id: string;
  pattern: PatternKey;
}) {
  const cellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    logRender(pattern, id);
    const el = cellRef.current;
    if (!el) return;
    el.classList.remove("cell-flash");
    void el.offsetWidth;
    el.classList.add("cell-flash");
  });

  const isValid = validity === "valid";

  return (
    <div
      ref={cellRef}
      className={`cell ${isValid ? "cell-valid" : "cell-invalid"}`}
    >
      {id}
    </div>
  );
}
