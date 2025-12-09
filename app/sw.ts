import { defaultCache } from "@serwist/next/worker";
import { ExpirationPlugin, NetworkFirst, Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const HOLIDAY_FEED_URL = "https://holidays.hyunbin.page/basic.ics";
const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 182;

const runtimeCaching = [
  ...defaultCache,
  {
    matcher: ({ url }: { url: URL }) => url.href === HOLIDAY_FEED_URL,
    handler: new NetworkFirst({
      cacheName: "holiday-ics",
      networkTimeoutSeconds: 8,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 2,
          maxAgeSeconds: SIX_MONTHS_SECONDS,
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
});

serwist.addEventListeners();
