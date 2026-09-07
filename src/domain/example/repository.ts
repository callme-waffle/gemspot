import { apiBaseUrl } from '@/lib/platform/env';
import { getJson } from '@/lib/platform/httpClient';
import { isValidSlug } from '@/shared/routes';
import { SEED_ITEMS } from './seed';
import type { ExampleItem, ExampleSource } from './types';

/**
 * 바깥 모양 → 도메인 모양 변환(anti-corruption layer).
 *
 * 이 파일이 서버 응답의 생김새를 아는 **유일한** 곳이다. 여기서 걸러 내지
 * 않으면 API의 스키마 변경이 화면까지 그대로 흘러간다.
 *
 * 화면(app 레이어)이 이 모듈을 직접 import하는 것은 lint가 막는다
 * (eslint.config.mts의 no-restricted-imports). 공개 문은 index.ts 배럴이다.
 */

const ITEMS_ENDPOINT = '/example/items';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 항목 하나를 검증한다. 통과하지 못하면 `null` — **던지지 않는다.**
 *
 * 한 항목이 깨졌다고 목록 전체를 버리면, 서버의 데이터 한 줄이 화면을 통째로
 * 비운다. 나쁜 것만 떨어뜨리고 나머지는 보여 주는 쪽이 사용자에게 낫다.
 */
export function parseItem(raw: unknown): ExampleItem | null {
  if (!isRecord(raw)) return null;

  const { slug, title, summary, score, updatedAt } = raw;

  // slug는 라우트로 나가는 값이라 shared의 계약을 그대로 통과해야 한다 —
  // 여기서 막지 않으면 examplePath()가 렌더 도중에 던진다.
  if (typeof slug !== 'string' || !isValidSlug(slug)) return null;
  if (typeof title !== 'string' || title.length === 0) return null;
  if (typeof summary !== 'string') return null;
  // NaN·Infinity는 typeof가 'number'다. 정렬과 평균이 조용히 오염되므로
  // 여기서 끊는다.
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  if (typeof updatedAt !== 'string' || Number.isNaN(Date.parse(updatedAt))) {
    return null;
  }

  return { slug, title, summary, score, updatedAt };
}

export interface FetchItemsResult {
  readonly items: readonly ExampleItem[];
  readonly source: ExampleSource;
}

/**
 * 목록을 가져온다. 실패는 시드로 폴백하되, `source`로 그 사실을 위로 올린다.
 *
 * 폴백 판단을 어댑터가 아니라 여기서 하는 이유: "실패했을 때 무엇이 맞는가"는
 * 도메인 지식이다. 어떤 도메인은 빈 목록이 맞고, 어떤 도메인은 캐시가 맞다.
 */
export async function fetchItems(): Promise<FetchItemsResult> {
  const baseUrl = apiBaseUrl();
  if (baseUrl === null) {
    return { items: SEED_ITEMS, source: 'seed' };
  }

  const result = await getJson<unknown>(`${baseUrl}${ITEMS_ENDPOINT}`);
  if (!result.ok || !Array.isArray(result.data)) {
    return { items: SEED_ITEMS, source: 'seed' };
  }

  const items = result.data
    .map(parseItem)
    .filter((item): item is ExampleItem => item !== null);

  // 전부 걸러졌다면 스키마가 통째로 어긋났다는 뜻이다 — 빈 화면 대신 시드로.
  return items.length > 0
    ? { items, source: 'remote' }
    : { items: SEED_ITEMS, source: 'seed' };
}
