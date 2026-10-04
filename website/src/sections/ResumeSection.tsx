import { Placeholder, SkeletonBar } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

export function ResumeSection() {
  return (
    <section className="border-b border-line/60 bg-canvas-dark/40 py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="resume"
          eyebrow="Раздел 03"
          title="Резюме"
          description="Образование, опыт, навыки, языки. Кнопка скачать PDF — для отправки брендам и на стажировки."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Placeholder
            tag="О себе · кратко"
            hint="2–3 абзаца: кто вы, специализация, город, чем отличаетесь. Портретное фото по желанию."
            className="lg:col-span-1"
            skeleton={
              <div className="space-y-3">
                <div className="mx-auto aspect-square w-32 rounded-full bg-canvas-dark" />
                <SkeletonBar className="h-3 w-full" />
                <SkeletonBar className="h-3 w-full" />
                <SkeletonBar className="h-3 w-4/5" />
              </div>
            }
          />

          <div className="space-y-6 lg:col-span-2">
            <Placeholder
              tag="Образование и опыт"
              hint="Хронология: вуз, курсы, стажировки, конкурсы, фриланс-проекты (даже учебные — с пометкой)."
              skeleton={
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4">
                      <SkeletonBar className="h-12 w-16 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <SkeletonBar className="h-4 w-2/3" />
                        <SkeletonBar className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            />

            <Placeholder
              tag="Навыки и инструменты"
              hint="Эскиз, конструирование, работа с производством, Adobe, CLO3D и т.д. — тегами или списком."
              skeleton={
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <SkeletonBar key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              }
            />

            <Placeholder
              tag="Скачать CV"
              hint="Файл PDF (Google Drive / прямая ссылка). Текст кнопки: «Скачать резюме»."
              skeleton={<SkeletonBar className="h-11 w-48 rounded-full" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
