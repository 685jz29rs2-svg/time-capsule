import type { Metadata } from "next";
import { Instrument_Serif, Nanum_Pen_Script, Noto_Serif_KR } from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import { Header } from "@/components/Header";
import { WatercolorBackdrop } from "@/components/WatercolorBackdrop";
import { isDemoMode } from "@/lib/env";
import "./globals.css";

const serif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const hand = Nanum_Pen_Script({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "약속 — Digital Time Capsule",
  description:
    "Digital time-capsule captures and seals the present moment, delivering it at a time chosen by the user.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${serif.variable} ${display.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="watercolor-page min-h-full">
        <WatercolorBackdrop />
        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-col px-5 pb-16 pt-8 sm:px-8">
          <Header />
          {isDemoMode() ? <DemoBanner /> : null}
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
