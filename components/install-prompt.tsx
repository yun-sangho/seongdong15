"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200/60 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200">
      스마트폰 홈화면에 추가하면 더 편리합니다.
      <Link
        href="https://it.donga.com/107319/"
        target="_blank"
        className="underline underline-offset-2"
      >
        방법 알아보기
      </Link>
    </div>
  );
}
