import { Placeholder, SkeletonBar } from "../components/Placeholder";

export function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-0 border-b border-line/60">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="space-y-6">
          <Placeholder
            tag="Hero · текст"
            hint="Имя, роль (fashion designer), одна сильная фраза — с кем работаете: бренды и частные заказчики. Кнопки: «Портфолио» и «Написать»."
            skeleton={
              <div className="space-y-3">
                <SkeletonBar className="h-3 w-24" />
                <SkeletonBar className="h-10 w-full max-w-md" />
                <SkeletonBar className="h-10 w-4/5 max-w-sm" />
                <div className="flex flex-wrap gap-3 pt-2">
                  <SkeletonBar className="h-11 w-36 rounded-full" />
                  <SkeletonBar className="h-11 w-36 rounded-full" />
                </div>
              </div>
            }
          />
        </div>

        <Placeholder
          tag="Hero · визуал"
          hint="Главное фото: вы в атelier, moodboard, flat lay с эскизами или лучший lookbook-кадр. Формат вертикальный или 4:5."
          skeleton={<div className="aspect-[4/5] max-h-[520px] w-full rounded-lg bg-canvas-dark" />}
        />
      </div>
    </section>
  );
}
