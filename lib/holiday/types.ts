import type { DayType } from "@/app/data/types";

export interface HolidayRecord {
  dates: string[];
  fetchedAt: number;
  expiresAt: number;
  source: string;
}

export type HolidayStatusType =
  | "idle"
  | "loading"
  | "cached"
  | "online"
  | "error";

export interface HolidayStatus {
  type: HolidayStatusType;
  message?: string;
  lastUpdated?: number;
}

export interface HolidayServiceResult {
  record: HolidayRecord | null;
  status: HolidayStatus;
}

export interface HolidaySnapshot {
  record: HolidayRecord | null;
  inferredDayType: DayType;
  usedOverride: boolean;
}
