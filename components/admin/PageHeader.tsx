export default function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-zinc-500">{description}</p>}
      </div>
      {children}
    </header>
  );
}
