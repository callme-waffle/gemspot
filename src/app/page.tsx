import { css } from 'styled-system/css';
import { ItemCard } from '@/components/ItemCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadExampleBoard } from '@/domain/example';

/**
 * 홈 — 서버 컴포넌트.
 *
 * 데이터는 도메인 배럴(`@/domain/example`) 하나로만 들어온다. 이 파일은
 * repository도, HTTP 어댑터도, 환경 변수도 모른다 — 그 셋을 여기서 못 여는
 * 것은 컨벤션이 아니라 lint다(eslint.config.mts의 boundaries 블록).
 */

const shell = css({
  maxWidth: '4xl',
  mx: 'auto',
  px: '6',
  py: '12',
  display: 'flex',
  flexDirection: 'column',
  gap: '12',
});

const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4',
  flexWrap: 'wrap',
});

const wordmark = css({
  textStyle: '4xl',
  fontWeight: 'bold',
  letterSpacing: 'tight',
  fontFamily: 'mono',
});
const lede = css({
  textStyle: 'md',
  color: 'slate.600',
  maxWidth: '4xl',
  _dark: { color: 'slate.400' },
});

const sectionTitle = css({
  textStyle: 'xl',
  fontWeight: 'semibold',
  letterSpacing: 'tight',
  mb: '4',
});

const layerList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  rounded: 'lg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'slate.200',
  overflow: 'hidden',
  _dark: { borderColor: 'slate.800' },
});

const layerRow = css({
  display: 'grid',
  gridTemplateColumns: '[minmax(9rem, auto) 1fr]',
  gap: '4',
  px: '5',
  py: '4',
  bg: 'white',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'slate.200',
  // 마지막 행의 밑줄은 컨테이너 테두리와 겹쳐 2px로 보인다. Panda에 `_notLast`
  // 조건은 없으므로(생성된 conditions.d.ts 참고) 전부 긋고 마지막만 지운다.
  _last: { borderBottomStyle: 'none' },
  _dark: { bg: 'slate.900', borderBottomColor: 'slate.800' },
});

const layerName = css({
  fontFamily: 'mono',
  textStyle: 'sm',
  color: 'violet.600',
  _dark: { color: 'violet.400' },
});
const layerNote = css({
  textStyle: 'sm',
  color: 'slate.600',
  _dark: { color: 'slate.400' },
});

const grid = css({
  display: 'grid',
  gridTemplateColumns: '[repeat(auto-fill, minmax(15rem, 1fr))]',
  gap: '4',
});

const meta = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  mb: '4',
  flexWrap: 'wrap',
});

const badge = css({
  px: '2',
  py: '0.5',
  rounded: 'full',
  textStyle: 'sm',
  fontFamily: 'mono',
  borderWidth: '1px',
  borderStyle: 'solid',
});

const seedBadge = css({
  borderColor: 'red.600',
  color: 'red.600',
  bg: 'red.100',
  _dark: { borderColor: 'red.400', color: 'red.400', bg: 'red.900' },
});

const remoteBadge = css({
  borderColor: 'emerald.600',
  color: 'emerald.600',
  bg: 'emerald.100',
  _dark: {
    borderColor: 'emerald.400',
    color: 'emerald.400',
    bg: 'emerald.900',
  },
});

/** 레이어 표의 내용. 여기 한 줄과 eslint.config.mts의 policies 한 줄이 짝이다. */
const LAYERS = [
  {
    name: 'src/shared',
    note: '순수 계약. 아무것도 import하지 않는다 — 모든 청크에 실려 가는 바닥이다.',
  },
  {
    name: 'src/lib/platform',
    note: '바깥 세계 어댑터(HTTP·환경 변수). shared만 안다.',
  },
  {
    name: 'src/domain/*',
    note: '도메인 규칙. 배럴(index.ts)로만 공개하고, 도메인끼리는 서로를 모른다.',
  },
  {
    name: 'src/app · components · hooks',
    note: '화면. domain 배럴과 shared만 연다 — platform은 직접 열 수 없다.',
  },
] as const;

export default async function HomePage() {
  const board = await loadExampleBoard();

  return (
    <main className={shell}>
      <header className={header}>
        <div>
          <h1 className={wordmark}>gemspot</h1>
        </div>
        <ThemeToggle />
      </header>

      <p className={lede}>
        레이어 경계와 디자인 토큰을 컨벤션이 아니라 lint로 강제하는 Next.js
        스캐폴드입니다. 경계를 어기면 <code>pnpm lint</code>에서 막히고, 토큰
        밖의 색을 쓰면 Panda 빌드에서 막힙니다.
      </p>

      <section>
        <h2 className={sectionTitle}>레이어</h2>
        <div className={layerList}>
          {LAYERS.map(layer => (
            <div key={layer.name} className={layerRow}>
              <span className={layerName}>{layer.name}</span>
              <span className={layerNote}>{layer.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>예시 도메인</h2>
        <div className={meta}>
          <span
            className={`${badge} ${board.source === 'seed' ? seedBadge : remoteBadge}`}
          >
            {board.source === 'seed' ? 'seed 데이터' : 'remote'}
          </span>
          <span className={layerNote}>
            {board.summary.total}건 · 평균 {board.summary.averageScore}점
          </span>
        </div>
        <div className={grid}>
          {board.items.map(item => (
            <ItemCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
