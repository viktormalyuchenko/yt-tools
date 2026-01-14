import { translations } from "../i18n/translations";
import "../globals.css";

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
          url: "/og-image.png", // Положи картинку 1200x630 в папку /public
          width: 1200,
          height: 630,
        },
      ],
      locale: lng,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lng } = await params;

  return (
    <html lang={lng} suppressHydrationWarning>
      <body className="antialiased" style={{ fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
