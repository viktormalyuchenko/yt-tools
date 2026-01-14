import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const languages = ["en", "ru", "es"];
const defaultLanguage = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, есть ли язык в пути
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Определяем язык браузера
  const acceptLanguage = request.headers.get("accept-language");
  let locale = defaultLanguage;

  if (acceptLanguage) {
    if (acceptLanguage.includes("ru")) locale = "ru";
  }

  // Редирект на нужный язык
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|yandex_.*.html|favicon.ico).*)",
  ],
};
