'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { Theme } from '@/shared/theme';
import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  parseTheme,
  toggleTheme,
} from '@/shared/theme';

/**
 * 테마 토글.
 *
 * **DOM이 단일 진실이다.** 첫 페인트 전 인라인 스크립트(app/theme-script.ts)가
 * 이미 `<html data-theme>`을 정해 두었고, Panda의 `dark` 조건도 그 속성을 본다.
 * React state를 따로 진실로 삼으면 둘이 어긋난다.
 *
 * 그래서 `useState` + `useEffect`가 아니라 `useSyncExternalStore`다. 전자는
 * 마운트 후 effect에서 setState를 불러 렌더를 한 번 더 태우고(React가
 * `set-state-in-effect`로 경고한다), 동시성 렌더에서 찢어진 화면을 만들 수
 * 있다. 이 훅이 보는 대상 — DOM 속성 — 이 애초에 React 밖의 저장소이므로,
 * 그것을 구독하는 전용 훅을 쓰는 게 맞는 모양이다.
 */

function readTheme(): Theme {
  return (
    parseTheme(document.documentElement.getAttribute(THEME_ATTRIBUTE)) ??
    'light'
  );
}

/**
 * 같은 페이지 안의 구독자들. `storage` 이벤트는 **다른** 탭에서만 오므로,
 * 이 탭의 토글은 여기로 직접 알려야 한다.
 */
const subscribers = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  subscribers.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const next = parseTheme(event.newValue);
    if (next === null) return;
    // 다른 탭이 바꾼 선택을 이 탭의 DOM에도 반영한다 — 그래야 아래
    // getSnapshot이 새 값을 돌려준다.
    document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    onStoreChange();
  };

  window.addEventListener('storage', onStorage);

  return () => {
    subscribers.delete(onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * 서버에는 DOM이 없다. 라이트를 돌려주는 것은 layout.tsx가 `data-theme="light"`로
 * 렌더하는 것과 같은 선택이다 — 둘이 어긋나면 하이드레이션이 깨진다.
 */
function getServerSnapshot(): Theme {
  return 'light';
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const toggle = useCallback(() => {
    // 클로저에 잡힌 값이 아니라 DOM에서 읽는다 — 다른 탭이 이미 바꿨을 수 있다.
    const next = toggleTheme(readTheme());

    document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 프라이빗 모드·저장소 차단 설정에서 던진다. 다음 방문에 기억되지
      // 않을 뿐이므로, 이번 토글까지 막을 이유는 없다.
    }
    for (const onStoreChange of subscribers) onStoreChange();
  }, []);

  return { theme, toggle };
}
