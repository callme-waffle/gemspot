import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom 프로젝트 전용 셋업(vitest.config.mts의 setupFiles).
 *
 * RTL은 auto cleanup을 글로벌 `afterEach`가 있을 때만 켠다. vitest는 globals를
 * 켜지 않았으므로(설정에 `globals: true`가 없다) 여기서 명시적으로 건다 —
 * 안 걸면 이전 테스트의 DOM이 남아 다음 테스트의 쿼리가 두 개를 찾는다.
 */
afterEach(() => {
  cleanup();
});
