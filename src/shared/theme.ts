/**
 * 테마 계약.
 *
 * 이 값들을 아는 곳이 셋이다 — 첫 페인트 전에 도는 인라인 스크립트
 * (src/app/theme-script.ts), 토글 훅(src/hooks/useTheme.ts), 그리고 Panda의
 * `dark` 조건(panda/preset.ts). 셋이 어긋나면 새로고침 때 화면이 한 번
 * 번쩍이는데(FOUC), 그건 lint도 타입 검사도 잡지 못한다. 그래서 상수를 여기
 * 한 곳에 두고 셋이 전부 여기서 읽어 간다.
 *
 * shared 규칙대로 아무것도 import하지 않고, 모듈 최상위에 문을 두지 않는다.
 */

export const THEMES = ['light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

/** `<html data-theme="…">`. Panda의 `dark` 조건이 이 속성을 본다. */
export const THEME_ATTRIBUTE = 'data-theme';

/** localStorage 키. 인라인 스크립트와 훅이 같은 키를 읽어야 한다. */
export const THEME_STORAGE_KEY = 'gemspot.theme';

/**
 * 바깥에서 들어온 값(localStorage, 쿼리스트링, 쿠키)을 Theme으로 좁힌다.
 *
 * 실패를 `null`로 돌려주고 기본값을 정하지 않는 이유: "저장된 값이 없다"와
 * "저장된 값이 깨졌다"를 구분하지 않아도 되는 대신, **기본값을 무엇으로 볼지는
 * 호출부가 정해야 하기 때문이다.** 인라인 스크립트는 시스템 설정
 * (`prefers-color-scheme`)으로 떨어지고, 서버 렌더는 라이트로 떨어진다 —
 * 여기서 하나를 못 박으면 둘 중 하나가 틀린다.
 */
export function parseTheme(value: unknown): Theme | null {
  return typeof value === 'string' &&
    (THEMES as readonly string[]).includes(value)
    ? (value as Theme)
    : null;
}

/** 토글. 테마가 셋 이상으로 늘어나면 이 함수가 먼저 깨진다 — 의도된 것이다. */
export function toggleTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
