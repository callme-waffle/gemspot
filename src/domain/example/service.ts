import type { ExampleItem, ExampleSummary } from './types';

/**
 * 도메인 규칙 — 순수 함수만.
 *
 * 네트워크도, 시간도, 난수도 읽지 않는다. 그래서 테스트가 스텁 없이 입력과
 * 출력만으로 끝난다(service.test.ts). 바깥 세계가 필요한 조립은 board.ts가 한다.
 */

/**
 * 점수 내림차순 → 동점이면 최근 수정 순 → 그래도 같으면 slug 사전순.
 *
 * 마지막 tie-breaker가 있어야 정렬이 **결정적**이 된다. Array.prototype.sort는
 * 안정 정렬이지만 그건 입력 순서를 보존한다는 뜻이고, 입력 순서 자체가 서버
 * 응답 순서라 매 요청 달라질 수 있다. slug까지 내려가면 같은 데이터가 항상
 * 같은 화면이 된다 — SSR/CSR 결과가 어긋나 하이드레이션이 깨지는 것도 막는다.
 *
 * `updatedAt`을 Date로 파싱하지 않고 문자열로 비교하는 이유: ISO 8601 UTC는
 * 사전순 = 시간순이다. 파싱하면 잘못된 값이 `NaN`이 되어 비교가 조용히
 * 무의미해지는데, 문자열 비교는 그런 침묵이 없다.
 */
export function rankItems(
  items: readonly ExampleItem[],
): readonly ExampleItem[] {
  return [...items].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1;
    return a.slug < b.slug ? -1 : 1;
  });
}

/**
 * 목록 요약. `items`가 이미 정렬돼 있다고 **가정하지 않는다** — 호출부가
 * 정렬을 잊어도 top이 틀리지 않게 여기서 다시 고른다.
 */
export function summarize(items: readonly ExampleItem[]): ExampleSummary {
  if (items.length === 0) {
    // 평균 0은 "점수가 0인 항목들"과 구분되지 않지만, total이 0이면 평균을
    // 읽을 이유가 없다. NaN을 내보내면 화면에 그대로 흘러가므로 0으로 접는다.
    return { total: 0, averageScore: 0, top: null };
  }

  const sum = items.reduce((acc, item) => acc + item.score, 0);
  const ranked = rankItems(items);

  return {
    total: items.length,
    // 소수 첫째 자리까지. 화면이 매번 toFixed를 부르면 자리수 규칙이 화면마다
    // 갈라지므로 도메인에서 한 번에 정한다.
    averageScore: Math.round((sum / items.length) * 10) / 10,
    top: ranked[0] ?? null,
  };
}
