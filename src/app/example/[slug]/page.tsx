import Link from 'next/link';
import { notFound } from 'next/navigation';
import { css } from 'styled-system/css';
import { loadExampleItem } from '@/domain/example';
import { HOME_PATH } from '@/shared/routes';
import type { Metadata } from 'next';

/**
 * 상세 — 동적 라우트.
 *
 * Next 15부터 `params`는 Promise다. 타입이 그렇게 잡혀 있으므로 await를 빠뜨리면
 * `check-types`에서 걸린다.
 */

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

const shell = css({
  maxWidth: '4xl',
  mx: 'auto',
  px: '6',
  py: '12',
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
});

const backLink = css({
  textStyle: 'sm',
  color: 'violet.600',
  textDecoration: 'none',
  _hover: { textDecoration: 'underline' },
  _dark: { color: 'violet.400' },
});

const title = css({
  textStyle: '4xl',
  fontWeight: 'bold',
  letterSpacing: 'tight',
});
const summary = css({
  textStyle: 'md',
  color: 'slate.600',
  _dark: { color: 'slate.400' },
});

const factRow = css({
  display: 'flex',
  gap: '4',
  textStyle: 'sm',
  color: 'slate.500',
  fontFamily: 'mono',
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadExampleItem(slug);

  // 없는 항목의 메타데이터는 만들지 않는다 — 아래 페이지가 notFound()로 떨어지고,
  // 그때는 not-found 라우트의 메타데이터가 쓰인다.
  if (item === null) return {};

  return { title: item.title, description: item.summary };
}

export default async function ExampleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await loadExampleItem(slug);

  // 도메인은 `null`만 돌려준다 — 그것을 404로 볼지는 화면의 결정이다.
  if (item === null) notFound();

  return (
    <main className={shell}>
      <Link href={HOME_PATH} className={backLink}>
        ← 목록으로
      </Link>
      <h1 className={title}>{item.title}</h1>
      <p className={summary}>{item.summary}</p>
      <div className={factRow}>
        <span>score {item.score}</span>
        <span>
          updated{' '}
          <time dateTime={item.updatedAt}>{item.updatedAt.slice(0, 10)}</time>
        </span>
      </div>
    </main>
  );
}
