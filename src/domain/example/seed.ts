import type { ExampleItem } from './types';

/**
 * 번들에 함께 실리는 시드 데이터.
 *
 * 백엔드가 아직 없어도(=`GEMSPOT_API_BASE_URL` 미설정) 앱이 뜨게 하려는 것이다.
 * 원격 호출이 **실패**했을 때의 폴백으로도 쓰이지만, 그때는 `source: 'seed'`가
 * 화면까지 올라가 배지로 드러난다 — 조용히 대체하면 백엔드가 죽은 것을
 * 아무도 모른다.
 *
 * 실제 데이터가 붙으면 이 파일과 repository의 폴백 분기를 함께 지울 것.
 */
export const SEED_ITEMS: readonly ExampleItem[] = [
  {
    slug: 'layer-boundaries',
    title: '레이어 경계',
    summary:
      'shared → platform → domain → app. 방향은 eslint-plugin-boundaries가 강제한다.',
    score: 92,
    updatedAt: '2026-09-08T00:00:00.000Z',
  },
  {
    slug: 'design-tokens',
    title: '디자인 토큰',
    summary:
      '색은 시맨틱 토큰에서만 온다. strictTokens와 NO_ESCAPED_HEX가 함께 막는다.',
    score: 92,
    updatedAt: '2026-09-07T00:00:00.000Z',
  },
  {
    slug: 'typed-http',
    title: '타입 있는 HTTP',
    summary: '실패의 모양을 어댑터가 정하고, 처리 여부는 도메인이 정한다.',
    score: 78,
    updatedAt: '2026-09-06T00:00:00.000Z',
  },
];
