"use client";

import { useEffect, useMemo, useState } from "react";
import { scheduleRepository } from "@/app/data/schedule-repository";
import type {
  DayType,
  HourlySchedule,
  NextDeparture,
  StopId,
} from "@/app/data/types";
import { useHoliday } from "./useHoliday";

export interface UseDeparturesResult {
  departures: NextDeparture[];
  schedule: HourlySchedule[];
  dayType: DayType;
  isOverride: boolean;
  now: Date;
}

export function useDepartures(stopId: StopId, count = 3): UseDeparturesResult {
  const { dayType, overrideDayType } = useHoliday();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 30 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const schedule = useMemo(() => {
    return scheduleRepository.getSchedule(stopId, dayType);
  }, [stopId, dayType]);

  const departures = useMemo(() => {
    return scheduleRepository.getNextDepartures(stopId, dayType, now, {
      count,
      nextDayDayType: dayType,
    });
  }, [stopId, dayType, now, count]);

  return {
    departures,
    schedule,
    dayType,
    isOverride: Boolean(overrideDayType),
    now,
  };
}
