export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono-label flex items-center">
      <span className="mr-3 inline-block h-px w-8 bg-accent" />
      <span>{children}</span>
    </div>
  );
}
