import { Placeholder, SkeletonBar } from "../components/Placeholder";
import { SectionTitle } from "../components/SectionTitle";

export function ContactSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-site space-y-10 px-4 sm:px-6">
        <SectionTitle
          id="contact"
          eyebrow="Раздел 06"
          title="Контакт"
          description="Главная точка входа: Telegram / WhatsApp / email. Форма заявки — по желанию."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Placeholder
            tag="Форма заявки"
            hint="Поля: имя, тип (бренд / частное лицо), описание задачи, бюджет (опционально), срок. Кнопка «Отправить»."
            skeleton={
              <div className="space-y-3">
                <SkeletonBar className="h-11 w-full rounded-lg" />
                <SkeletonBar className="h-11 w-full rounded-lg" />
                <SkeletonBar className="h-28 w-full rounded-lg" />
                <SkeletonBar className="h-11 w-full rounded-full" />
              </div>
            }
          />

          <div className="space-y-6">
            <Placeholder
              tag="Мессенджеры и соцсети"
              hint="Ссылки: Telegram, Instagram, Pinterest, Behance — что использует дизайнер."
              skeleton={
                <div className="flex flex-wrap gap-3">
                  {["Telegram", "Instagram", "Email"].map((s) => (
                    <SkeletonBar key={s} className="h-10 w-28 rounded-full" />
                  ))}
                </div>
              }
            />
            <Placeholder
              tag="Город и формат работы"
              hint="Город, очные встречи да/нет, работа по СНГ / онлайн worldwide."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
