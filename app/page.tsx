"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StopScheduleCard } from "@/components/stop-schedule-card";
import { STOPS } from "@/app/data/stops";
import type { DayType, StopId } from "@/app/data/types";
import { useHoliday } from "@/app/hooks/useHoliday";
import { formatKstDate, formatTimeInKst } from "@/lib/time/kst";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { FullScheduleModal } from "@/components/full-schedule-modal";
import { InstallPrompt } from "@/components/install-prompt";

export default function Home() {
  const { overrideDayType, setOverrideDayType, fallbackMessage, dayType } =
    useHoliday();
  const [selectedStop, setSelectedStop] = useState<StopId>(STOPS[0]?.id);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOverride = (value: DayType | null) => {
    setOverrideDayType(value);
  };

  const formattedCurrentTime = `${formatKstDate(currentTime)} ${formatTimeInKst(
    currentTime
  )}`;

  return (
    <div className="h-dvh bg-background px-4 py-6 text-foreground">
      <main className="mx-auto flex h-full w-full max-w-md flex-col gap-4">
        <header>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                성동 15 알리미
              </h1>
              <ModeToggle />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={overrideDayType === null ? "default" : "outline"}
                onClick={() => handleOverride(null)}
              >
                자동
              </Button>
              <Button
                variant={overrideDayType === "weekday" ? "default" : "outline"}
                onClick={() => handleOverride("weekday")}
              >
                평일
              </Button>
              <Button
                variant={overrideDayType === "holiday" ? "default" : "outline"}
                onClick={() => handleOverride("holiday")}
              >
                휴일
              </Button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {STOPS.map((stop) => (
                  <Button
                    key={stop.id}
                    variant={selectedStop === stop.id ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedStop(stop.id)}
                  >
                    {stop.name}
                  </Button>
                ))}
              </div>
            </div>

            {fallbackMessage && (
              <p className="rounded-2xl border border-amber-500/30 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-100">
                {fallbackMessage}
              </p>
            )}
          </div>
        </header>
        <div className="flex gap-2 items-center">
          <p>
            <span>현재 시간: </span>
            {formattedCurrentTime}
          </p>
          <Badge>{dayType === "holiday" ? "휴일" : "평일"}</Badge>
        </div>
        <StopScheduleCard stopId={selectedStop} />
        <FullScheduleModal stopId={selectedStop} />
        <InstallPrompt />
      </main>
    </div>
  );
}
