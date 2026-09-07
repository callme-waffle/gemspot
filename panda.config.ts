import { defineConfig } from '@pandacss/dev';
import { gemspotPreset } from './panda/preset';

/**
 * Panda CSS 구성.
 *
 * 토큰 정의는 전부 panda/preset.ts에 있다 — 여기는 **파이프라인**만 다룬다
 * (무엇을 스캔하고, 어디로 생성하고, 어떤 값을 금지하는가).
 *
 * `outdir`(styled-system/)은 커밋하지 않는다. `pnpm install`의 prepare 훅이
 * `panda codegen`을 돌려 만들고, tsconfig의 `styled-system/*` path와
 * .gitignore가 그 전제를 함께 잡고 있다.
 */
export default defineConfig({
  presets: ['@pandacss/dev/presets', gemspotPreset],

  // reset CSS를 함께 내보낸다. 브라우저 기본 스타일은 요소마다 제각각이라,
  // 이걸 끄면 토큰으로 맞춘 간격이 요소별로 어긋난다.
  preflight: true,

  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],

  // 디자인 토큰 강제: 임의 색·값 대신 토큰만 허용한다. 임의값이 꼭 필요하면
  // 대괄호 이스케이프(`'[6px]'`)로 **명시적으로** 표기해야 한다 — "여긴
  // 의도적으로 토큰을 벗어난다"가 diff에 남는다.
  //
  // 색에는 그 탈출구조차 막아 뒀다(eslint의 NO_ESCAPED_HEX). 이스케이프로 박은
  // 색은 라이트/다크 한쪽에서만 맞는 값이 되고, 그건 lint가 아니라 화면을
  // 보고서야 발견된다.
  strictTokens: true,
  // 열거형 속성(display, position 등)도 CSS 표준 값만 받는다. 오타
  // (`postion: 'realtive'`)가 조용히 무시되는 대신 빌드에서 걸린다.
  strictPropertyValues: true,

  jsxFramework: 'react',
  minify: true,

  outdir: 'styled-system',

  globalCss: {
    extend: {
      html: {
        bg: 'bg.canvas',
        color: 'fg.base',
        // 한글 본문은 어절 단위로 끊어야 읽힌다. keep-all이 없으면 한 어절이
        // 줄 끝에서 반 토막 난다.
        wordBreak: 'keep-all',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // 네이티브 컨트롤(스크롤바·폼 위젯)을 테마에 맞춘다. data-theme과
        // 짝이라 토글 즉시 함께 바뀐다.
        colorScheme: 'light',
        '&[data-theme=dark]': {
          colorScheme: 'dark',
        },
      },
      body: {
        fontFamily: 'sans',
        textStyle: 'body',
        margin: '0',
        minHeight: '100dvh',
      },
      '::selection': {
        bg: 'selection.bg',
      },
      // 포커스 링은 전역에서 한 번만 정의한다. 컴포넌트마다 다시 그리면
      // 키보드 사용자가 화면마다 다른 규칙을 학습해야 한다.
      ':focus-visible': {
        outline: '2px solid token(colors.accent.ring)',
        outlineOffset: '2px',
        borderRadius: 'xs',
      },
    },
  },
});
