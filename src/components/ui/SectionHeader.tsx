type SectionHeaderProps = {
  eyebrow?: string;
  id?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, id, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-[2.125rem]">
        {title}
      </h2>
      {description && <p className="mt-3 text-base leading-7 text-muted">{description}</p>}
    </div>
  );
}
