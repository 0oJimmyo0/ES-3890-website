type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-line py-10 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
    </header>
  );
}

