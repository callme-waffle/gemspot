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
  maxWidth: 'content',
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

const wordmark = css({ textStyle: 'display', fontFamily: 'mono' });
const lede = css({ textStyle: 'body', color: 'fg.muted', maxWidth: 'content' });

const sectionTitle = css({
  textStyle: 'heading',
  mb: '4',
});

const layerList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  rounded: 'md',
  borderWidth: 'hairline',
  borderStyle: 'solid',
  borderColor: 'border.subtle',
  overflow: 'hidden',
});

const layerRow = css({
  display: 'grid',
  gridTemplateColumns: '[minmax(9rem, auto) 1fr]',
  gap: '4',
  px: '5',
  py: '4',
  bg: 'bg.surface',
  borderBottomWidth: 'hairline',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border.subtle',
  // 마지막 행의 밑줄은 컨테이너 테두리와 겹쳐 2px로 보인다. Panda에 `_notLast`
  // 조건은 없으므로(생성된 conditions.d.ts 참고) 전부 긋고 마지막만 지운다.
  _last: { borderBottomStyle: 'none' },
});

const layerName = css({
  fontFamily: 'mono',
  textStyle: 'caption',
  color: 'accent.base',
});
const layerNote = css({ textStyle: 'caption', color: 'fg.muted' });

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
  rounded: 'pill',
  textStyle: 'caption',
  fontFamily: 'mono',
  borderWidth: 'hairline',
  borderStyle: 'solid',
});

const seedBadge = css({
  borderColor: 'negative.base',
  color: 'negative.base',
  bg: 'negative.subtle',
});

const remoteBadge = css({
  borderColor: 'positive.base',
  color: 'positive.base',
  bg: 'positive.subtle',
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
