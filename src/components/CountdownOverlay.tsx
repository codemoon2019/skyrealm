interface Props {
  label: string;
}

export function CountdownOverlay({ label }: Props) {
  if (!label) return null;
  return (
    <div className="countdown" key={label}>
      {label}
    </div>
  );
}
