export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-base tracking-[0.22em] text-foreground">
          ROO <span className="text-muted-foreground">ATHLETICS</span>
        </span>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <a
            href="https://instagram.com/roo.athletics"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Instagram
          </a>
          <a
            href="mailto:hello@rooathletics.com"
            className="transition-colors hover:text-foreground"
          >
            hello@rooathletics.com
          </a>
          <span>© {new Date().getFullYear()} Roo Athletics</span>
        </nav>
      </div>
    </footer>
  );
}
