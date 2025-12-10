"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { getStopMeta } from "@/app/data/stops";
import type { StopId } from "@/app/data/types";
import { formatDepartureTime } from "@/app/data/schedules";
import { useDepartures } from "@/app/hooks/useDepartures";
import { cn } from "@/lib/utils";

function formatDiffMinutes(target: Date, now: Date): number {
  const diffMs = target.getTime() - now.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
  return diffMinutes;
}

export function StopScheduleCard({ stopId }: { stopId: StopId }) {
  const meta = getStopMeta(stopId);
  const { departures, now } = useDepartures(stopId);

  const todaysDepartures = useMemo(
    () =>
      departures
        .filter((departure) => !departure.isNextDay)
        .map((departure) => ({
          label: formatDepartureTime(departure.time),
          relative: formatDiffMinutes(departure.time, now),
        })),
    [departures, now]
  );

  if (!meta) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {todaysDepartures.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center justify-between rounded-2xl border border-black/5 bg-zinc-50 px-4 py-3 text-base font-medium dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex gap-4 items-center">
            <span className="text-xl font-semibold tracking-tight">
              {item.label}
            </span>
            <span
              className={cn(
                "text-sm text-zinc-500 dark:text-zinc-400",
                item.relative < 2 ? "text-amber-600 dark:text-amber-400" : ""
              )}
            >
              {item.relative < 2 ? "곧 출발" : `${item.relative}분 후`}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {index === 0 ? "다음" : `${index + 1}번째`}
          </Badge>
        </div>
      ))}
      {todaysDepartures.length === 0 && (
        <p className="text-2xl text-zinc-500 dark:text-zinc-400 text-center py-10">
          오늘 운행이 종료되었습니다.
        </p>
      )}
    </div>
  );
}
