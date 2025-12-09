import type {
  DayType,
  GetNextDepartureOptions,
  HourlySchedule,
  NextDeparture,
  StopId,
} from "./types";
import { getNextDepartures, getSchedule } from "./schedules";

export interface ScheduleRepository {
  getSchedule(stopId: StopId, dayType: DayType): HourlySchedule[];
  getNextDepartures(
    stopId: StopId,
    dayType: DayType,
    fromDate: Date,
    options?: GetNextDepartureOptions
  ): NextDeparture[];
}

class StaticScheduleRepository implements ScheduleRepository {
  getSchedule(stopId: StopId, dayType: DayType): HourlySchedule[] {
    return getSchedule(stopId, dayType);
  }

  getNextDepartures(
    stopId: StopId,
    dayType: DayType,
    fromDate: Date,
    options?: GetNextDepartureOptions
  ): NextDeparture[] {
    return getNextDepartures(stopId, dayType, fromDate, options);
  }
}

export const scheduleRepository: ScheduleRepository =
  new StaticScheduleRepository();
