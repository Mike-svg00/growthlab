import { Placeholder, SkeletonBar, SkeletonImage } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

const PROJECT_SLOTS = 6;

export function PortfolioSection() {
  return (
    <section className="border-b border-line/60 bg-white/30 py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="portfolio"
          eyebrow="Раздел 01"
          title="Портфолио"
          description="Здесь будут кейсы: фото готовых образов, эскизы, кратко «задача → решение». Можно теги: для бренда / для человека."
        />

        <Placeholder
          tag="Фильтр (опционально)"
          hint="Кнопки: Все · Бренды · Частные заказы · Учебные проекты — когда появятся работы."
          skeleton={
            <div className="flex flex-wrap gap-2">
              {["Все", "Бренды", "Частные", "Концепты"].map((f) => (
                <SkeletonBar key={f} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          }
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PROJECT_SLOTS }, (_, i) => (
            <Placeholder
              key={i}
              tag={`Кейс ${i + 1}`}
              hint="Название проекта, 1–2 фото, тип (#brand / #personal), ссылка «Смотреть кейс» на детальную страницу или модалку."
              skeleton={
                <div className="space-y-3">
                  <SkeletonImage />
                  <SkeletonBar className="h-4 w-3/4" />
                  <SkeletonBar className="h-3 w-1/2" />
                </div>
              }
            />
          ))}
        </div>

        <Placeholder
          tag="Кейс · внутренняя страница (шаблон)"
          hint="На будущее: отдельный экран или блок с галереей, эскизами, описанием процесса, сроками, вашей роли. Сейчас — только напоминание в структуре."
          className="lg:col-span-3"
          skeleton={
            <div className="grid gap-4 lg:grid-cols-2">
              <SkeletonImage ratio="aspect-video" />
              <div className="space-y-2">
                <SkeletonBar className="h-4 w-full" />
                <SkeletonBar className="h-4 w-full" />
                <SkeletonBar className="h-4 w-5/6" />
                <SkeletonBar className="h-4 w-2/3" />
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
