import { fetchItems } from './repository';
import { rankItems, summarize } from './service';
import type { ExampleBoard, ExampleItem } from './types';

/**
 * 도메인의 유스케이스 — 어댑터(repository)와 규칙(service)을 잇는 한 줄기.
 *
 * 조립을 별도 파일로 떼어 두면 service.ts가 순수한 채로 남는다. 이 파일만
 * 비동기이고, 나머지는 입력→출력이다.
 */
export async function loadExampleBoard(): Promise<ExampleBoard> {
  const { items, source } = await fetchItems();

  return {
    items: rankItems(items),
    summary: summarize(items),
    source,
  };
}

/**
 * 상세 하나. 없으면 `null`이고, 그것을 404로 볼지는 화면이 정한다 —
 * 도메인은 HTTP 상태 코드를 모른다.
 *
 * 목록을 통째로 받아 걸러 내는 것은 지금 데이터가 세 건이라 그렇다. 목록이
 * 커지면 repository에 단건 조회를 추가하고 이 함수가 그쪽을 부르게 바꾼다 —
 * 그때도 배럴의 시그니처는 그대로다.
 */
export async function loadExampleItem(
  slug: string,
): Promise<ExampleItem | null> {
  const { items } = await fetchItems();
  return items.find(item => item.slug === slug) ?? null;
}
