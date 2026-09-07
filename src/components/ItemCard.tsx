import Link from 'next/link';
import { css } from 'styled-system/css';
import type { ExampleItem } from '@/domain/example';
import { examplePath } from '@/shared/routes';

const card = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '5',
  rounded: 'md',
  borderWidth: 'hairline',
  borderStyle: 'solid',
  borderColor: 'border.subtle',
  bg: 'bg.surface',
  textDecoration: 'none',
  color: 'fg.base',
  transition: 'colors',
  _hover: {
    borderColor: 'accent.base',
  },
});

const title = css({ textStyle: 'heading' });
const summary = css({ textStyle: 'caption', color: 'fg.muted' });

const score = css({
  alignSelf: 'flex-start',
  px: '2',
  py: '0.5',
  rounded: 'pill',
  bg: 'accent.subtle',
  color: 'accent.base',
  textStyle: 'caption',
  fontFamily: 'mono',
});

export function ItemCard({ item }: { item: ExampleItem }) {
  return (
    // 카드 전체가 링크다. 제목만 링크로 두면 클릭 표적이 좁아지고, 카드 안에
    // 링크를 여러 개 두면 탭 이동이 카드 수의 배수로 늘어난다.
    <Link href={examplePath(item.slug)} className={card}>
      <span className={score}>{item.score}</span>
      <h3 className={title}>{item.title}</h3>
      <p className={summary}>{item.summary}</p>
    </Link>
  );
}
