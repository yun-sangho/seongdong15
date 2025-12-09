import { HOLIDAY_DB_TTL_MS, HOLIDAY_FEED_URL } from "./constants";
import { parseIcsToDates } from "./ics-parser";
import type { HolidayRecord } from "./types";

export async function fetchHolidayRecord(): Promise<HolidayRecord> {
  const response = await fetch(HOLIDAY_FEED_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch holidays: ${response.status}`);
  }

  const raw = await response.text();
  const dates = parseIcsToDates(raw);
  const fetchedAt = Date.now();

  return {
    dates,
    fetchedAt,
    expiresAt: fetchedAt + HOLIDAY_DB_TTL_MS,
    source: HOLIDAY_FEED_URL,
  };
}
