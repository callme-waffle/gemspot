import { describe, expect, it } from 'vitest';
import { parseTheme, toggleTheme } from './theme';

describe('parseTheme', () => {
  it('알려진 테마 문자열을 통과시킨다', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('dark')).toBe('dark');
  });

  it('저장소에서 나올 수 있는 모든 쓰레기 값을 null로 떨어뜨린다', () => {
    // localStorage는 무엇이든 담을 수 있고, 다른 탭·이전 버전·확장 프로그램이
    // 넣은 값이 그대로 들어온다. 여기서 좁히지 않으면 data-theme에 임의
    // 문자열이 실려 Panda 조건이 어느 쪽도 매치하지 않는다.
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
    expect(parseTheme('')).toBeNull();
    expect(parseTheme('Dark')).toBeNull();
    expect(parseTheme('system')).toBeNull();
    expect(parseTheme(0)).toBeNull();
    expect(parseTheme({ theme: 'dark' })).toBeNull();
  });
});

describe('toggleTheme', () => {
  it('두 테마를 서로 뒤집는다', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });

  it('두 번 토글하면 제자리로 돌아온다', () => {
    expect(toggleTheme(toggleTheme('light'))).toBe('light');
  });
});
