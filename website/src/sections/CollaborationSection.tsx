import { Placeholder, SkeletonBar } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

const STEPS = 5;

export function CollaborationSection() {
  return (
    <section className="border-b border-line/60 py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="collaboration"
          eyebrow="Раздел 04"
          title="Сотрудничество"
          description="Как вы работаете: от первого сообщения до передачи макетов. Снимает страх у брендов и частных клиентов."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: STEPS }, (_, i) => (
            <Placeholder
              key={i}
              tag={`Шаг ${i + 1}`}
              hint="Например: заявка → бриф → эскизы → правки → финал / передача в пошив."
              skeleton={
                <div className="text-center">
                  <SkeletonBar className="mx-auto mb-3 h-10 w-10 rounded-full" />
                  <SkeletonBar className="mx-auto h-3 w-20" />
                </div>
              }
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Placeholder
            tag="Для брендов"
            hint="Сроки, формат созвона, NDA при необходимости, как передаёте файлы (Figma, PDF tech pack)."
          />
          <Placeholder
            tag="Для частных заказчиков"
            hint="Примерки, количество правок, связь с ателье (рекомендуете или клиент сам)."
          />
        </div>

        <Placeholder
          tag="FAQ (опционально)"
          hint="3–5 вопросов: сроки, предоплата, что нужно от клиента, география (онлайн / офлайн)."
          skeleton={
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <SkeletonBar key={n} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          }
        />
      </div>
    </section>
  );
}
