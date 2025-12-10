import type { StopMeta } from "./types";

export const STOPS: StopMeta[] = [
  {
    id: "dae-woo",
    name: "대우아파트",
    description: "금호역 방면",
  },
  {
    id: "doosan-115",
    name: "두산아파트 115동",
    description: "대우아파트 방면",
  },
];

export const STOP_LOOKUP = STOPS.reduce<Record<string, StopMeta>>(
  (acc, stop) => {
    acc[stop.id] = stop;
    return acc;
  },
  {}
);
