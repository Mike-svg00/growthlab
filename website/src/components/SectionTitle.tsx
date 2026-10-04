type SectionTitleProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({ id, eyebrow, title, description }: SectionTitleProps) {
  return (
    <header id={id} className="scroll-mt-24">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl font-sans text-base text-ink-muted">{description}</p>
    </header>
  );
}
