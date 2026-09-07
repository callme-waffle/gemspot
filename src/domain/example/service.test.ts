import { describe, expect, it } from 'vitest';
import { rankItems, summarize } from './service';
import type { ExampleItem } from './types';

function item(overrides: Partial<ExampleItem> & Pick<ExampleItem, 'slug'>) {
  return {
    title: overrides.slug,
    summary: '',
    score: 50,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } satisfies ExampleItem;
}

describe('rankItems', () => {
  it('점수 내림차순으로 정렬한다', () => {
    const ranked = rankItems([
      item({ slug: 'low', score: 10 }),
      item({ slug: 'high', score: 90 }),
      item({ slug: 'mid', score: 50 }),
    ]);

    expect(ranked.map(i => i.slug)).toEqual(['high', 'mid', 'low']);
  });

  it('동점이면 최근 수정 순으로 내린다', () => {
    const ranked = rankItems([
      item({ slug: 'old', score: 50, updatedAt: '2026-01-01T00:00:00.000Z' }),
      item({ slug: 'new', score: 50, updatedAt: '2026-06-01T00:00:00.000Z' }),
    ]);

    expect(ranked.map(i => i.slug)).toEqual(['new', 'old']);
  });

  it('점수·시각이 모두 같으면 slug 사전순으로 결정적이 된다', () => {
    // 입력 순서를 뒤집어도 같은 결과여야 한다 — 안정 정렬이 보존하는 것은
    // 입력 순서(=서버 응답 순서)라, 그것만으로는 결정적이지 않다.
    const a = item({ slug: 'alpha' });
    const b = item({ slug: 'beta' });

    expect(rankItems([b, a]).map(i => i.slug)).toEqual(['alpha', 'beta']);
    expect(rankItems([a, b]).map(i => i.slug)).toEqual(['alpha', 'beta']);
  });

  it('입력 배열을 제자리에서 바꾸지 않는다', () => {
    const input = [
      item({ slug: 'b', score: 10 }),
      item({ slug: 'a', score: 90 }),
    ];
    const before = input.map(i => i.slug);

    rankItems(input);

    expect(input.map(i => i.slug)).toEqual(before);
  });
});

describe('summarize', () => {
  it('빈 목록에서 top은 null이고 평균은 0이다', () => {
    expect(summarize([])).toEqual({ total: 0, averageScore: 0, top: null });
  });

  it('평균을 소수 첫째 자리로 접는다', () => {
    const summary = summarize([
      item({ slug: 'a', score: 10 }),
      item({ slug: 'b', score: 11 }),
      item({ slug: 'c', score: 11 }),
    ]);

    // 32 / 3 = 10.666… → 10.7
    expect(summary.averageScore).toBe(10.7);
    expect(summary.total).toBe(3);
  });

  it('정렬되지 않은 입력에서도 top을 바르게 고른다', () => {
    const summary = summarize([
      item({ slug: 'low', score: 1 }),
      item({ slug: 'high', score: 99 }),
    ]);

    expect(summary.top?.slug).toBe('high');
  });
});
