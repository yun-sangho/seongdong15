import { createKstDate, formatTimeInKst } from "@/lib/time/kst";
import scheduleJson from "./schedules.json";
import type {
  DayType,
  GetNextDepartureOptions,
  HourlySchedule,
  NextDeparture,
  ScheduleMap,
  StopId,
} from "./types";

export const SCHEDULES: ScheduleMap = scheduleJson as ScheduleMap;

const DEFAULT_NEXT_DEPARTURE_OPTIONS: Omit<
  Required<GetNextDepartureOptions>,
  "nextDayDayType"
> = {
  count: 3,
  includeNextDay: true,
};

export function getSchedule(
  stopId: StopId,
  dayType: DayType
): HourlySchedule[] {
  return SCHEDULES[stopId]?.[dayType] ?? [];
}

export function getNextDepartures(
  stopId: StopId,
  dayType: DayType,
  fromDate: Date,
  options?: GetNextDepartureOptions
): NextDeparture[] {
  const { count, includeNextDay } = {
    ...DEFAULT_NEXT_DEPARTURE_OPTIONS,
    ...options,
  } satisfies Omit<Required<GetNextDepartureOptions>, "nextDayDayType">;

  const schedule = getSchedule(stopId, dayType);
  const upcoming: NextDeparture[] = [];

  for (const entry of schedule) {
    for (const minute of entry.minutes) {
      const candidate = createKstDate(fromDate, entry.hour, minute);
      if (candidate >= fromDate) {
        upcoming.push({ time: candidate, isNextDay: false });
        if (upcoming.length >= count) {
          return upcoming;
        }
      }
    }
  }

  if (includeNextDay) {
    const nextDaySchedule = getSchedule(
      stopId,
      options?.nextDayDayType ?? dayType
    );
    for (const entry of nextDaySchedule) {
      for (const minute of entry.minutes) {
        const candidate = createKstDate(fromDate, entry.hour, minute, 1);
        upcoming.push({ time: candidate, isNextDay: true });
        if (upcoming.length >= count) {
          return upcoming;
        }
      }
    }
  }

  return upcoming;
}

export function formatDepartureTime(date: Date): string {
  return formatTimeInKst(date);
}
