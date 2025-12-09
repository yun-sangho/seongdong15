import type { StopMeta } from "./types";

export const STOPS: StopMeta[] = [
  {
    id: "dae-woo",
    name: "대우아파트",
    description: "봉천동 방면 승차장",
  },
  {
    id: "doosan-115",
    name: "두산아파트 115동",
    description: "관악산 방면 승차장",
  },
];

export const STOP_LOOKUP = STOPS.reduce<Record<string, StopMeta>>(
  (acc, stop) => {
    acc[stop.id] = stop;
    return acc;
  },
  {}
);
