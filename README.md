## 버스 15 도착 알림

Next.js 16 · React 19 기반의 PWA로, 대우아파트와 두산아파트 115동에서 출발하는 버스 15의 다음 도착 시간을 보여줍니다. 공휴일 정보는 `https://holidays.hyunbin.page/basic.ics` 에서 받아오며, IndexedDB에 6개월 동안 캐시됩니다.

### 주요 기능

- 모바일 친화 UI: 두 출발지의 다음 출발 시각·전체 시간표·잔여 시간 제공
- 자동 공휴일 판별: ICS → IndexedDB 저장 → 앱 시작 시 최신 상태 확인
- 세션 한정 수동 토글: 네트워크 문제 시 평일/휴일 모드 직접 선택 가능
- PWA 대응: manifest, Serwist 기반 서비스 워커, maskable 아이콘 포함

### 개발 환경

- 패키지 매니저: **pnpm** (고정, `packageManager` 참조)
- 스타일: Tailwind CSS 4 + `@theme inline` 토큰, shadcn UI 컴포넌트
- 타입/품질: TypeScript 5, ESLint 9, Prettier 3

### 스크립트

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 http://localhost:3000
pnpm build && pnpm start  # 프로덕션 빌드 및 실행
pnpm lint          # ESLint (Next.js core-web-vitals)
pnpm format        # Prettier 전체 포맷
pnpm format:check  # 포맷 검증
```

### 폴더 구조 하이라이트

- `app/page.tsx`: 모바일 홈 화면 및 수동 토글/새로고침 UI
- `app/providers/holiday-provider.tsx`: 공휴일 판별 컨텍스트 + IndexedDB 캐시 로딩
- `app/data/schedules.json`: 두 출발지 시간표(JSON) → `app/data/schedules.ts` 헬퍼가 파싱
- `lib/holiday/*`: ICS fetcher, repository, 서비스 계층, 상수 정의
- `app/sw.ts`: Serwist 서비스 워커 + Holiday ICS NetworkFirst 캐싱
- `public/icons/*.svg`: maskable 버스 아이콘 (manifest 참조)

### PWA 배포 팁

1. `pnpm build` 후 `pnpm start` 로 서비스 워커/manifest 동작 확인
2. 브라우저 DevTools > Application 탭에서 `holiday-ics` 캐시와 IndexedDB `bus15-holidays` 스토어 점검
3. Vercel 배포 시 `next.config.ts` 의 `withSerwist` 설정 그대로 유지

필요 시 `pnpm dlx shadcn@latest add <component>` 로 UI 컴포넌트를 추가하고, `components/ui/` 아래에 배치하세요.
