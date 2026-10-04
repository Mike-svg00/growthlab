import { designer, navItems } from "../config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-canvas">
      <div className="mx-auto flex max-w-site flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-wide">{designer.initials}</p>
          <p className="mt-1 font-sans text-sm text-canvas/90">{designer.fullName}</p>
          <p className="mt-2 max-w-xs font-sans text-sm text-canvas/70">
            Портфолио fashion-дизайнера. Контент заполняем по разделам.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-canvas/80">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-canvas">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 py-4 text-center font-sans text-xs text-canvas/50">
        © {new Date().getFullYear()} {designer.fullName}
      </div>
    </footer>
  );
}
