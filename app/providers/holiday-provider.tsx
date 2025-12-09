"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DayType } from "@/app/data/types";
import type { HolidayRecord, HolidayStatus } from "@/lib/holiday";
import { holidayService } from "@/lib/holiday";

interface HolidayContextValue {
  status: HolidayStatus;
  record: HolidayRecord | null;
  autoDayType: DayType;
  dayType: DayType;
  overrideDayType: DayType | null;
  setOverrideDayType: (value: DayType | null) => void;
  refresh: () => Promise<void>;
  lastUpdated?: number;
  fallbackMessage?: string;
}

const HolidayContext = createContext<HolidayContextValue | undefined>(
  undefined
);

export function HolidayProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [record, setRecord] = useState<HolidayRecord | null>(null);
  const [status, setStatus] = useState<HolidayStatus>({ type: "loading" });
  const [overrideDayType, setOverrideDayType] = useState<DayType | null>(null);
  const recordRef = useRef<HolidayRecord | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const applyRecord = useCallback((next: HolidayRecord | null) => {
    recordRef.current = next;
    setRecord(next);
  }, []);

  const refresh = useCallback(async () => {
    setStatus((prev) => ({ ...prev, type: "loading" }));
    const result = await holidayService.refresh();

    if (result.record) {
      applyRecord(result.record);
      setStatus(result.status);
      return;
    }

    const fallbackRecord = recordRef.current;
    if (fallbackRecord) {
      setStatus({
        type: "cached",
        lastUpdated: fallbackRecord.fetchedAt,
        message: result.status.message,
      });
      return;
    }

    setStatus(result.status);
  }, [applyRecord]);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      setStatus({ type: "loading" });
      const cached = await holidayService.loadFromCache();
      if (!mounted) {
        return;
      }
      applyRecord(cached.record);
      setStatus(cached.status);
      await refresh();
    };

    bootstrap();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [applyRecord, refresh]);

  const autoDayType = useMemo(() => {
    return holidayService.isHoliday(now, record);
  }, [now, record]);

  const dayType = overrideDayType ?? autoDayType;

  const fallbackMessage = useMemo(() => {
    if (status.type === "error") {
      return status.message ?? "공휴일 정보를 불러오지 못했습니다.";
    }
    if (status.type === "cached" && status.message) {
      return status.message;
    }
    if (!record && status.type !== "loading") {
      return "저장된 공휴일 정보가 없어 자동 판별을 건너뜁니다.";
    }
    return undefined;
  }, [record, status]);

  const value: HolidayContextValue = {
    status,
    record,
    autoDayType,
    dayType,
    overrideDayType,
    setOverrideDayType,
    refresh,
    lastUpdated: record?.fetchedAt ?? status.lastUpdated,
    fallbackMessage,
  };

  return (
    <HolidayContext.Provider value={value}>{children}</HolidayContext.Provider>
  );
}

export function useHolidayContext(): HolidayContextValue {
  const context = useContext(HolidayContext);
  if (!context) {
    throw new Error("useHolidayContext must be used within HolidayProvider");
  }
  return context;
}
