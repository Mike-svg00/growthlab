import { Placeholder, SkeletonBar } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

export function ServicesSection() {
  return (
    <section className="border-b border-line/60 py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="services"
          eyebrow="Раздел 02"
          title="Услуги"
          description="Два направления: сотрудничество с брендами и индивидуальный дизайн одежды. Позже — конкретные формулировки и цены «от»."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Placeholder
            tag="Услуги · бренды"
            hint="Moodboard, эскизная серия, tech pack, капсула на сезон, доработка линейки. Список + что входит + CTA «Запросить бриф»."
            skeleton={
              <ul className="mt-2 space-y-2">
                {[1, 2, 3, 4].map((n) => (
                  <SkeletonBar key={n} className="h-3 w-full" />
                ))}
                <SkeletonBar className="mt-4 h-10 w-40 rounded-full" />
              </ul>
            }
          />
          <Placeholder
            tag="Услуги · частные клиенты"
            hint="Индивидуальный образ, платье на событие, консультация по гардеробу, сопровождение до ателье. Список + CTA «Описать задачу»."
            skeleton={
              <ul className="mt-2 space-y-2">
                {[1, 2, 3, 4].map((n) => (
                  <SkeletonBar key={n} className="h-3 w-full" />
                ))}
                <SkeletonBar className="mt-4 h-10 w-44 rounded-full" />
              </ul>
            }
          />
        </div>
      </div>
    </section>
  );
}
