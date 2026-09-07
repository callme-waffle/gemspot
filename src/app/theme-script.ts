import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/shared/theme';

/**
 * 첫 페인트 **전에** 도는 인라인 스크립트.
 *
 * 서버는 사용자의 테마를 모르므로 HTML은 라이트로 나간다. 이 스크립트가 없으면
 * 다크 사용자는 흰 화면을 한 프레임 보고(FOUC) 하이드레이션 후에야 어두워진다.
 * `<head>`의 동기 스크립트라 파서가 여기서 멈추고 실행한 뒤 본문을 그린다 —
 * 그래서 번쩍임이 없다.
 *
 * 외부 파일로 빼면 첫 페인트 전에 요청이 하나 더 붙고, `next/script`의
 * beforeInteractive는 React 트리를 거치느라 실행 시점이 밀린다. 몇백 바이트를
 * HTML에 싣는 쪽이 싸다.
 *
 * 값을 문자열로 조립하지만 사용자 입력은 한 톨도 섞이지 않는다 — 전부
 * shared/theme.ts의 빌드 타임 상수이고, `JSON.stringify`로 인용까지 붙인다.
 */

const ATTR = JSON.stringify(THEME_ATTRIBUTE);
const KEY = JSON.stringify(THEME_STORAGE_KEY);

// 미니파이어를 신뢰하지 않고 한 줄로 적는다 — 이 문자열은 번들러를 거치지 않고
// HTML에 그대로 실린다.
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${KEY});var t=(s==='light'||s==='dark')?s:((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');document.documentElement.setAttribute(${ATTR},t);}catch(e){document.documentElement.setAttribute(${ATTR},'light');}})();`;
