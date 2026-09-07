import Link from 'next/link';
import { css } from 'styled-system/css';
import { HOME_PATH } from '@/shared/routes';

const shell = css({
  maxWidth: 'content',
  mx: 'auto',
  px: '6',
  py: '24',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4',
});

const code = css({
  textStyle: 'display',
  fontFamily: 'mono',
  color: 'fg.subtle',
});
const message = css({ textStyle: 'body', color: 'fg.muted' });
const link = css({
  textStyle: 'caption',
  color: 'accent.base',
  textDecoration: 'none',
  _hover: { textDecoration: 'underline' },
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
