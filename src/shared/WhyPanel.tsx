export function WhyPanel({ children }: { children: React.ReactNode }) {
  return (
    <details className="why-panel">
      <summary className="why-summary">Why?</summary>
      <div className="why-content">{children}</div>
    </details>
  );
}
