// Label de section numéroté pour la page AI OS — filet vert + numéro rouge + texte mono
export function AiosLabel({
  num,
  children,
}: {
  num?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mono-label flex items-center">
      <span className="mr-3 inline-block h-px w-8 bg-accent" />
      {num && <span className="mr-2 text-accent-2">{num}</span>}
      <span>{children}</span>
    </div>
  );
}
