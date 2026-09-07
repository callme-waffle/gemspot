/**
 * 예시 도메인의 공개 API.
 *
 * app 레이어가 여는 **유일한** 문이다. repository는 여기서 내보내지 않는다 —
 * 인프라(응답 파싱·폴백 판단)는 도메인 안쪽 사정이고, 화면이 그걸 알면
 * 서버 응답 변경이 화면까지 번진다. lint가 직접 import를 막아 두었지만
 * (no-restricted-imports), 애초에 배럴에 없으면 그럴 일도 없다.
 *
 * 이 파일에는 **모듈 최상위 부수효과를 두지 않는다.** 배럴 한 줄의
 * `new Service()`가 거기 매달린 모듈 전부를 모든 페이지 청크에 싣는다.
 * 그 규칙도 lint(no-restricted-syntax)가 잡는다.
 */

export { loadExampleBoard, loadExampleItem } from './board';
export { rankItems, summarize } from './service';
export type {
  ExampleBoard,
  ExampleItem,
  ExampleSource,
  ExampleSummary,
} from './types';
