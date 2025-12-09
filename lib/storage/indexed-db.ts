import { HOLIDAY_DB_NAME, HOLIDAY_DB_VERSION } from "../holiday/constants";

export type StoreMode = "readonly" | "readwrite";

export async function openHolidayDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") {
    return null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(HOLIDAY_DB_NAME, HOLIDAY_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("holidays")) {
        db.createObjectStore("holidays");
      }
      if (!db.objectStoreNames.contains("metadata")) {
        db.createObjectStore("metadata");
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function withObjectStore<T>(
  storeName: "holidays" | "metadata",
  mode: StoreMode,
  handler: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T | undefined> {
  const db = await openHolidayDatabase();
  if (!db) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = handler(store);

    request.onsuccess = () => {
      resolve(request.result as T);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}
