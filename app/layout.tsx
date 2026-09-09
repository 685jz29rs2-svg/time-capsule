import type { Metadata } from "next";
import { Nanum_Pen_Script, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { getDictionary } from "@/lib/locale";
import "./globals.css";

const sans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const serif = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const hand = Nanum_Pen_Script({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return {
    title: t.meta.title,
    description: t.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, t } = await getDictionary();
  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="flex min-h-dvh flex-col">
          <AppHeader locale={locale} t={t} />
          {children}
        </div>
      </body>
    </html>
  );
}
