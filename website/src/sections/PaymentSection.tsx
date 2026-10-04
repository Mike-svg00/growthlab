import { Placeholder, SkeletonBar } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

export function PaymentSection() {
  return (
    <section className="border-b border-line/60 bg-white/30 py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="payment"
          eyebrow="Раздел 05"
          title="Оплата и пакеты"
          description="Пакеты услуг или «от … сум / €», предоплата, способы оплаты. Можно оставить «по договорённости» на старте."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {["Базовый", "Стандарт", "Под ключ"].map((name) => (
            <Placeholder
              key={name}
              tag={`Пакет · ${name}`}
              hint="Название, что входит, цена или «уточняйте», кнопка «Выбрать» → контакт."
              skeleton={
                <div className="space-y-3 pt-2">
                  <SkeletonBar className="h-6 w-1/2" />
                  <SkeletonBar className="h-8 w-1/3" />
                  {[1, 2, 3, 4].map((n) => (
                    <SkeletonBar key={n} className="h-3 w-full" />
                  ))}
                  <SkeletonBar className="mt-4 h-10 w-full rounded-full" />
                </div>
              }
            />
          ))}
        </div>

        <Placeholder
          tag="Условия оплаты"
          hint="Предоплата %, когда финальный платёж, возврат при отмене, валюта (сум / USD), Payme / перевод / договор."
          skeleton={
            <div className="grid gap-3 sm:grid-cols-2">
              <SkeletonBar className="h-16 w-full rounded-lg" />
              <SkeletonBar className="h-16 w-full rounded-lg" />
            </div>
          }
        />
      </div>
    </section>
  );
}
