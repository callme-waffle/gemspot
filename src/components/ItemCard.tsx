import Link from 'next/link';
import { css } from 'styled-system/css';
import type { ExampleItem } from '@/domain/example';
import { examplePath } from '@/shared/routes';

const card = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '5',
  rounded: 'lg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'slate.200',
  bg: 'white',
  textDecoration: 'none',
  color: 'slate.900',
  transition: 'colors',
  _hover: {
    borderColor: 'violet.600',
  },
  _dark: {
    borderColor: 'slate.800',
    bg: 'slate.900',
    color: 'slate.100',
    _hover: {
      borderColor: 'violet.400',
    },
  },
});

const title = css({
  textStyle: 'xl',
  fontWeight: 'semibold',
  letterSpacing: 'tight',
});
const summary = css({
  textStyle: 'sm',
  color: 'slate.600',
  _dark: { color: 'slate.400' },
});

const score = css({
  alignSelf: 'flex-start',
  px: '2',
  py: '0.5',
  rounded: 'full',
  bg: 'violet.100',
  color: 'violet.600',
  textStyle: 'sm',
  fontFamily: 'mono',
  _dark: { bg: 'violet.950', color: 'violet.400' },
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
