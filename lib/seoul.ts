export const SEOUL_TZ = "Asia/Seoul";
export const MIN_UNLOCK_MS = 10 * 60 * 1000;

export type UnlockParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

function partsMap(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const out: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return out;
}

export function seoulWallTimeToUtcMs(parts: UnlockParts): number | null {
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const values = [year, month, day, hour, minute];
  if (values.some((n) => !Number.isInteger(n))) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23) return null;
  if (minute < 0 || minute > 59) return null;
  if (year < 2020 || year > 2100) return null;

  const target = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
  let utc = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let i = 0; i < 3; i += 1) {
    const seen = partsMap(new Date(utc));
    const seenStamp = `${seen.year}-${seen.month}-${seen.day}T${seen.hour}:${seen.minute}:${seen.second}`;
    const seenMs = Date.UTC(
      Number(seen.year),
      Number(seen.month) - 1,
      Number(seen.day),
      Number(seen.hour),
      Number(seen.minute),
      Number(seen.second),
    );
    const targetMs = Date.UTC(year, month - 1, day, hour, minute, 0);
    utc += targetMs - seenMs;
    if (seenStamp.startsWith(target)) {
      const verify = partsMap(new Date(utc));
      if (
        Number(verify.year) === year &&
        Number(verify.month) === month &&
        Number(verify.day) === day &&
        Number(verify.hour) === hour &&
        Number(verify.minute) === minute
      ) {
        return utc;
      }
    }
  }
  return null;
}

export function formatSeoul(isoOrMs: string | number, locale: "ko" | "en"): string {
  const date = typeof isoOrMs === "number" ? new Date(isoOrMs) : new Date(isoOrMs);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale === "en" ? "en-US" : "ko-KR", {
    timeZone: SEOUL_TZ,
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function digitsOnly(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}
