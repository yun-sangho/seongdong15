import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { StopId } from "@/app/data/types";
import { useDepartures } from "@/app/hooks/useDepartures";
import { getStopMeta } from "@/app/data/stops";

export const FullScheduleModal = ({ stopId }: { stopId: StopId }) => {
  const meta = getStopMeta(stopId);

  const { schedule, dayType } = useDepartures(stopId);
  const hasSchedule = schedule.some((entry) => entry.minutes.length > 0);

  if (!meta) return null;

  return (
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
                          (minute) => minute.toString().padStart(2, "0") + "분"
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
  );
};
