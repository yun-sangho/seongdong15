const KST_TIME_ZONE = "Asia/Seoul" as const;
const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: KST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const DEFAULT_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function formatKstDate(date: Date): string {
  return DATE_FORMATTER.format(date);
}

export function formatTimeInKst(
  date: Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_TIME_FORMAT
): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    ...DEFAULT_TIME_FORMAT,
    ...options,
  });
  return formatter.format(date);
}

export function createKstDate(
  baseDate: Date,
  hour: number,
  minute: number,
  extraDays = 0
): Date {
  const shifted = addDays(baseDate, extraDays);
  const datePart = formatKstDate(shifted);
  const hh = pad(hour);
  const mm = pad(minute);
  return new Date(`${datePart}T${hh}:${mm}:00+09:00`);
}

export const KST_TIMEZONE = KST_TIME_ZONE;
