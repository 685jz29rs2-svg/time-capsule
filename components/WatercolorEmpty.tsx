import Image from "next/image";
import type { Messages } from "@/lib/i18n";

export function WatercolorEmpty({ t }: { t: Messages }) {
  return (
    <div className="overflow-hidden rounded-2xl px-3 py-4 ring-1 ring-foreground/8 sm:px-5 sm:py-5"
      style={{ background: "linear-gradient(115deg, #f7f1e4 0%, #e8efe4 42%, #f4ead4 100%)" }}
    >
      <div className="flex justify-center">
        <div className="flex max-w-full items-center justify-center gap-3 sm:max-w-lg sm:gap-5">
          <Image
            src="/watercolor-pine.png"
            alt=""
            width={280}
            height={373}
            priority
            className="h-[7.5rem] w-auto shrink-0 object-contain sm:h-36"
          />
          <p className="min-w-0 text-left font-hand text-[1.05rem] leading-[1.7] text-[#3d4a3a] sm:text-[1.2rem] sm:leading-[1.75]">
            {t.empty.line1}
            <br />
            {t.empty.line2}
            <br />
            {t.empty.line3}
          </p>
        </div>
      </div>
    </div>
  );
}
