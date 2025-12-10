"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STOPS } from "@/app/data/stops";
import type { StopId } from "@/app/data/types";
import { formatDepartureTime } from "@/app/data/schedules";
import { useDepartures } from "@/app/hooks/useDepartures";
import { cn } from "@/lib/utils";

interface StopScheduleCardProps {
  stopId: StopId;
}

function getStopMeta(stopId: StopId) {
  return STOPS.find((stop) => stop.id === stopId);
}

function formatDiffMinutes(target: Date, now: Date): number {
  const diffMs = target.getTime() - now.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
  return diffMinutes;
}

export function StopScheduleCard({ stopId }: StopScheduleCardProps) {
  const meta = getStopMeta(stopId);
  const { departures, schedule, dayType, now } = useDepartures(stopId);
  const hasSchedule = schedule.some((entry) => entry.minutes.length > 0);

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
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="grid grid-cols-1 gap-3">
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
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" variant="outline" className="w-full">
            전체 시간표 보기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{meta.name} 출발</DialogTitle>
            <DialogDescription className="text-sm">
              {meta.description} · {dayType === "holiday" ? "휴일" : "평일"}
            </DialogDescription>
          </DialogHeader>
          {hasSchedule ? (
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {schedule.map((entry) => (
                <div
                  key={`${entry.hour}`}
                  className="rounded-2xl border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-md font-semibold text-zinc-500 dark:text-zinc-400">
                    {entry.hour}시
                  </p>
                  <p className="mt-1 text-base font-medium text-zinc-900 dark:text-white">
                    {entry.minutes.length > 0
                      ? entry.minutes
                          .map(
                            (minute) =>
                              minute.toString().padStart(2, "0") + "분"
                          )
                          .join(" · ")
                      : "운행 없음"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-base text-zinc-500 dark:text-zinc-400">
              오늘은 운행 일정이 없습니다.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
