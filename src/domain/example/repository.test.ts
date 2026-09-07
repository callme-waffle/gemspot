import { describe, expect, it } from 'vitest';
import { parseItem } from './repository';

/** 유효한 wire 페이로드 한 벌. 테스트마다 필요한 필드만 덮어쓴다. */
const VALID = {
  slug: 'layer-boundaries',
  title: '레이어 경계',
  summary: '방향은 lint가 강제한다.',
  score: 92,
  updatedAt: '2026-09-08T00:00:00.000Z',
};

describe('parseItem', () => {
  it('유효한 페이로드를 도메인 모양으로 통과시킨다', () => {
    expect(parseItem(VALID)).toEqual(VALID);
  });

  it('객체가 아닌 값을 거른다', () => {
    for (const raw of [null, undefined, 'x', 42, [VALID]]) {
      expect(parseItem(raw)).toBeNull();
    }
  });

  it('라우트로 나갈 수 없는 slug를 거른다', () => {
    // 여기서 막지 않으면 examplePath()가 렌더 도중에 던진다.
    expect(parseItem({ ...VALID, slug: 'a/b' })).toBeNull();
    expect(parseItem({ ...VALID, slug: '..' })).toBeNull();
    expect(parseItem({ ...VALID, slug: '' })).toBeNull();
  });

  it('빈 제목을 거른다', () => {
    expect(parseItem({ ...VALID, title: '' })).toBeNull();
  });

  it('유한하지 않은 점수를 거른다 — typeof는 number라 그냥 통과한다', () => {
    expect(parseItem({ ...VALID, score: Number.NaN })).toBeNull();
    expect(parseItem({ ...VALID, score: Number.POSITIVE_INFINITY })).toBeNull();
    expect(parseItem({ ...VALID, score: '92' })).toBeNull();
  });

  it('파싱되지 않는 updatedAt을 거른다', () => {
    expect(parseItem({ ...VALID, updatedAt: 'yesterday' })).toBeNull();
    expect(parseItem({ ...VALID, updatedAt: 1_757_289_600_000 })).toBeNull();
  });

  it('모르는 필드는 도메인 모양으로 넘기지 않는다', () => {
    const parsed = parseItem({ ...VALID, internalRank: 3 });

    expect(parsed).not.toBeNull();
    expect(parsed).not.toHaveProperty('internalRank');
  });
});
