/** Брендинг сайта */
export const designer = {
  firstName: "Полина",
  lastName: "Подлесникова",
  /** Инициалы в шапке и favicon-стиле */
  initials: "P.P.",
  role: "Fashion designer",
  fullName: "Полина Подлесникова",
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
