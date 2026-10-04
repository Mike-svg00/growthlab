/** Брендинг сайта — публичное название: инициалы */
export const designer = {
  firstName: "Полина",
  lastName: "Подлесникова",
  initials: "П.П.",
  /** Имя для подсказок и SEO (полное имя в интерфейсе не показываем) */
  fullName: "Полина Подлесникова",
  siteName: "П.П.",
} as const;

/** Навигация — якоря совпадают с id секций на странице */
export const navItems = [
  { href: "#hero", label: "Главная" },
  { href: "#portfolio", label: "Портфолио" },
  { href: "#services", label: "Услуги" },
  { href: "#resume", label: "Резюме" },
  { href: "#collaboration", label: "Сотрудничество" },
  { href: "#payment", label: "Оплата" },
  { href: "#contact", label: "Контакт" },
] as const;
