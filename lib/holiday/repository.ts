import { HOLIDAY_DB_KEY } from "./constants";
import type { HolidayRecord } from "./types";
import { withObjectStore } from "@/lib/storage/indexed-db";

async function readRawRecord(): Promise<HolidayRecord | null> {
  const result = await withObjectStore<HolidayRecord | undefined>(
    "holidays",
    "readonly",
    (store) => store.get(HOLIDAY_DB_KEY)
  );

  return result ?? null;
}

async function deleteRawRecord(): Promise<void> {
  await withObjectStore("holidays", "readwrite", (store) =>
    store.delete(HOLIDAY_DB_KEY)
  );
}

export async function getCachedHolidayRecord(): Promise<HolidayRecord | null> {
  const record = await readRawRecord();
  if (!record) {
    return null;
  }

  if (record.expiresAt <= Date.now()) {
    await deleteRawRecord();
    return null;
  }

  return record;
}

export async function saveHolidayRecord(record: HolidayRecord): Promise<void> {
  await withObjectStore("holidays", "readwrite", (store) =>
    store.put(record, HOLIDAY_DB_KEY)
  );
}

export async function clearHolidayRecord(): Promise<void> {
  await deleteRawRecord();
}
