import type { DayType } from "@/app/data/types";
import { formatKstDate } from "@/lib/time/kst";
import { getCachedHolidayRecord, saveHolidayRecord } from "./repository";
import { fetchHolidayRecord } from "./fetcher";
import type {
  HolidayRecord,
  HolidayServiceResult,
  HolidayStatus,
} from "./types";

function buildStatus(partial: Partial<HolidayStatus>): HolidayStatus {
  return {
    type: partial.type ?? "idle",
    message: partial.message,
    lastUpdated: partial.lastUpdated,
  };
}

export class HolidayService {
  async loadFromCache(): Promise<HolidayServiceResult> {
    const record = await getCachedHolidayRecord();
    if (!record) {
      return {
        record: null,
        status: buildStatus({ type: "idle" }),
      };
    }

    return {
      record,
      status: buildStatus({ type: "cached", lastUpdated: record.fetchedAt }),
    };
  }

  async refresh(): Promise<HolidayServiceResult> {
    try {
      const record = await fetchHolidayRecord();
      await saveHolidayRecord(record);
      return {
        record,
        status: buildStatus({ type: "online", lastUpdated: record.fetchedAt }),
      };
    } catch (error) {
      return {
        record: null,
        status: buildStatus({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }

  isHoliday(date: Date, record: HolidayRecord | null): DayType {
    // Check if it's weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return "holiday";
    }

    if (!record) {
      return "weekday";
    }

    const iso = formatKstDate(date);
    return record.dates.includes(iso) ? "holiday" : "weekday";
  }
}

export const holidayService = new HolidayService();
