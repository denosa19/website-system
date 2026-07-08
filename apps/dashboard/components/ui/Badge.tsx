type BadgeProps = {
  children: string;
};

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
      {children}
    </span>
  );
}