import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/shared/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // 첫 페인트 전 인라인 스크립트가 해 두는 일을 여기서 대신한다.
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    localStorage.clear();
  });

  it('접근 가능한 이름이 지금 상태가 아니라 누르면 될 결과를 가리킨다', () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: '다크 테마로 전환' }),
    ).toBeInTheDocument();
  });

  it('클릭하면 html의 data-theme을 뒤집는다', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    // Panda의 `dark` 조건이 보는 것이 이 속성이다 — state가 아니라 여기가 진실.
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('선택을 localStorage에 남긴다 — 인라인 스크립트가 다음 방문에 읽는 키', () => {
    render(<ThemeToggle />);
    screen.getByRole('button').click();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('두 번 누르면 원래 테마로 돌아온다', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
      'light',
    );
  });
});
