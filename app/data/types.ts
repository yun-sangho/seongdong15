export type StopId = "dae-woo" | "doosan-115";

export type DayType = "weekday" | "holiday";

export interface HourlySchedule {
  hour: number;
  minutes: number[];
}

export interface StopSchedule {
  stopId: StopId;
  dayType: DayType;
  hours: HourlySchedule[];
}

export type ScheduleMap = Record<StopId, Record<DayType, HourlySchedule[]>>;

export interface StopMeta {
  id: StopId;
  name: string;
  description: string;
}

export interface NextDeparture {
  time: Date;
  isNextDay: boolean;
}

export interface GetNextDepartureOptions {
  count?: number;
  includeNextDay?: boolean;
  nextDayDayType?: DayType;
}
