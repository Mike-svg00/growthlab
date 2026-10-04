import type { ReactNode } from "react";

type PlaceholderProps = {
  /** Короткая метка блока для команды (видна всегда) */
  tag: string;
  /** Что сюда потом вставить */
  hint: string;
  className?: string;
  children?: ReactNode;
  /** Внутренний «скелет» контента */
  skeleton?: ReactNode;
};

export function Placeholder({ tag, hint, className = "", children, skeleton }: PlaceholderProps) {
  return (
    <div
      className={`relative rounded-xl border-2 border-dashed border-line-dashed/80 bg-white/40 p-5 sm:p-6 ${className}`}
    >
      <span className="absolute -top-2.5 left-4 rounded bg-accent-light px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
        {tag}
      </span>
      <p className="mt-1 font-sans text-sm leading-relaxed text-ink-muted">{hint}</p>
      {skeleton && <div className="mt-4">{skeleton}</div>}
      {children}
    </div>
  );
}

/** Серые полоски-заглушки под текст или изображения */
export function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-canvas-dark ${className}`} aria-hidden />;
}

export function SkeletonImage({ ratio = "aspect-[4/5]" }: { ratio?: string }) {
  return (
    <div
      className={`flex ${ratio} w-full items-center justify-center rounded-lg bg-canvas-dark text-center font-sans text-xs text-ink-faint`}
    >
      Фото / рендер
    </div>
  );
}
