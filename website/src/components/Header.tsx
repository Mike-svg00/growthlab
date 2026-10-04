import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "../config";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#hero" className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          [ Имя · Fashion ]
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основное меню">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-sm text-ink-muted transition hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-ink/15 bg-ink px-4 py-2 font-sans text-sm font-medium text-canvas transition hover:bg-ink/90 sm:inline-block"
        >
          Обсудить проект
        </a>

        <button
          type="button"
          className="inline-flex rounded-lg border border-line p-2 lg:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-canvas px-4 py-4 lg:hidden" aria-label="Мобильное меню">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block font-sans text-base text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="mt-2 block rounded-full bg-ink py-3 text-center font-sans text-sm font-medium text-canvas"
                onClick={() => setOpen(false)}
              >
                Обсудить проект
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
