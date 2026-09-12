import Link from 'next/link';
import { css } from 'styled-system/css';
import { HOME_PATH } from '@/shared/routes';

const shell = css({
  maxWidth: '4xl',
  mx: 'auto',
  px: '6',
  py: '24',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4',
});

const code = css({
  textStyle: '4xl',
  fontWeight: 'bold',
  letterSpacing: 'tight',
  fontFamily: 'mono',
  color: 'slate.500',
});
const message = css({
  textStyle: 'md',
  color: 'slate.600',
  _dark: { color: 'slate.400' },
});
const link = css({
  textStyle: 'sm',
  color: 'violet.600',
  textDecoration: 'none',
  _hover: { textDecoration: 'underline' },
  _dark: { color: 'violet.400' },
});

export default function NotFound() {
  return (
    <main className={shell}>
      <p className={code}>404</p>
      <p className={message}>요청한 페이지가 없습니다.</p>
      <Link href={HOME_PATH} className={link}>
        ← 홈으로
      </Link>
    </main>
  );
}
