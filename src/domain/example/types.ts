/**
 * 예시 도메인의 어휘.
 *
 * 이 타입들은 **도메인이 쓰는 모양**이지 서버 응답의 모양이 아니다. 둘을 같은
 * 타입으로 쓰면 API가 필드 이름을 바꿀 때 화면까지 함께 고쳐야 한다.
 * 바깥 모양 → 이 모양으로 옮기는 일은 repository.ts가 한다.
 */

export interface ExampleItem {
  /** URL 세그먼트. shared의 isValidSlug를 통과한 값만 여기 들어온다. */
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  /** 정렬 가중치. 0~100. */
  readonly score: number;
  /** ISO 8601 UTC. 문자열로 두는 이유는 아래 rankItems 주석 참고. */
  readonly updatedAt: string;
}

export interface ExampleSummary {
  readonly total: number;
  readonly averageScore: number;
  /** 목록이 비면 null. 빈 배열에서 "1등"은 없다. */
  readonly top: ExampleItem | null;
}

/**
 * 목록이 어디서 왔는지. 화면이 "시드 데이터입니다" 배지를 띄울 수 있게
 * 도메인이 명시적으로 알려 준다 — 조용히 폴백하면 백엔드가 죽은 걸
 * 아무도 모른다.
 */
export type ExampleSource = 'remote' | 'seed';

export interface ExampleBoard {
  readonly items: readonly ExampleItem[];
  readonly summary: ExampleSummary;
  readonly source: ExampleSource;
}
