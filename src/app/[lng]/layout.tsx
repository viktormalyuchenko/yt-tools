import { translations } from "../i18n/translations";
import "../globals.css";
import Script from "next/script"; // Импортируем компонент для скриптов

type Props = {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const t = translations[lng] || translations.en;
  const url = `https://yt.viktoor.ru/${lng}`;

  return {
    title: t.title,
    description: t.description,
    metadataBase: new URL("https://yt.viktoor.ru"),
    verification: {
      google: "Ihz5Cd5vkNkVuh36pZjbyhECtbKBY5oZu7pMs4t5kXU",
      yandex: "792da3ac3acc8753",
    },
    alternates: {
      canonical: url,
      languages: {
        "ru-RU": "/ru",
        "en-US": "/en",
        "es-ES": "/es",
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: url,
      siteName: "YouTube History Tool",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: lng,
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lng } = await params;

  return (
    <html lang={lng} suppressHydrationWarning>
      <head>
        {/* Яндекс.Метрика — инициализация */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106248663', 'ym');

            ym(106248663, 'init', {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true,
                ecommerce:"dataLayer"
            });
          `}
        </Script>
      </head>
      <body className="antialiased" style={{ fontFamily: "sans-serif" }}>
        {/* Ноускрипт часть метрики */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106248663"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {children}
      </body>
    </html>
  );
}
