import {
  definePreset,
  defineSemanticTokens,
  defineTokens,
} from '@pandacss/dev';

/**
 * gemspot 디자인 토큰 프리셋.
 *
 * 두 층으로 나뉜다:
 *
 * 1. **원시 팔레트**(`tokens.colors`) — 색 값 그 자체. `slate.700` 같은 이름은
 *    "어떤 색인가"만 말하고 "어디에 쓰는가"는 말하지 않는다. **컴포넌트에서
 *    직접 쓰지 않는다** — 라이트/다크 한쪽에서만 맞는 값이 되기 때문이다.
 * 2. **시맨틱 토큰**(`semanticTokens.colors`) — `bg.canvas`, `fg.muted`처럼
 *    역할로 이름 붙인 층. `_dark` 값을 함께 들고 있어서, 컴포넌트는 테마를
 *    모른 채 역할만 고르면 된다.
 *
 * 컴포넌트가 여는 문은 2번뿐이다. 이 규칙은 컨벤션이 아니라 lint로 강제된다 —
 * eslint.config.mts의 `no-restricted-syntax`(NO_ESCAPED_HEX)가 `'[#hex]'`
 * 대괄호 이스케이프를 막고, panda.config.ts의 `strictTokens`가 토큰 밖 값을 막는다.
 *
 * 팔레트를 갈아끼우려면 1번만 고치면 된다 — 2번이 역할 이름을 고정해 두므로
 * 컴포넌트는 한 줄도 바뀌지 않는다.
 */

const tokens = defineTokens({
  colors: {
    // 중립 스케일. 지면·글자·보더가 전부 여기서 나온다. 0/1000은 순수
    // 흰검이고, 라이트의 캔버스는 순수 흰색 대신 50을 쓴다(글자 대비가
    // 과해지지 않게).
    slate: {
      0: { value: '#ffffff' },
      50: { value: '#f8fafc' },
      100: { value: '#f1f5f9' },
      200: { value: '#e2e8f0' },
      300: { value: '#cbd5e1' },
      400: { value: '#94a3b8' },
      500: { value: '#64748b' },
      600: { value: '#475569' },
      700: { value: '#334155' },
      800: { value: '#1e293b' },
      900: { value: '#0f172a' },
      950: { value: '#020617' },
      1000: { value: '#000000' },
    },
    // 액센트. 이름 그대로 gem — 보라 계열 한 축이다. 라이트에서는 600,
    // 다크에서는 400을 쓴다(어두운 지면 위에서 600은 4.5:1을 못 넘긴다).
    gem: {
      50: { value: '#f5f3ff' },
      100: { value: '#ede9fe' },
      200: { value: '#ddd6fe' },
      300: { value: '#c4b5fd' },
      400: { value: '#a78bfa' },
      500: { value: '#8b5cf6' },
      600: { value: '#7c3aed' },
      700: { value: '#6d28d9' },
      800: { value: '#5b21b6' },
      900: { value: '#4c1d95' },
      950: { value: '#2e1065' },
    },
    // 상태색 두 축. 셋 이상으로 늘리기 전에 "이 상태가 정말 색으로만
    // 구분돼야 하는가"를 먼저 물을 것 — 색각 이상 사용자에게는 아이콘·
    // 텍스트가 함께 있어야 전달된다.
    jade: {
      100: { value: '#d1fae5' },
      400: { value: '#34d399' },
      600: { value: '#059669' },
      900: { value: '#064e3b' },
    },
    ruby: {
      100: { value: '#fee2e2' },
      400: { value: '#f87171' },
      600: { value: '#dc2626' },
      900: { value: '#7f1d1d' },
    },
  },

  fonts: {
    // 시스템 폰트 스택. 웹폰트를 얹으면 여기 맨 앞에 CSS 변수를 꽂는다
    // (next/font가 만드는 `--font-*`) — 스택 자체는 폴백으로 그대로 산다.
    sans: {
      value:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    },
    mono: {
      value:
        'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },
  },

  radii: {
    xs: { value: '4px' },
    sm: { value: '6px' },
    md: { value: '10px' },
    lg: { value: '16px' },
    pill: { value: '9999px' },
  },

  sizes: {
    // 본문 최대 너비. 한 줄이 길어지면 다음 줄 첫 글자를 찾는 눈의 왕복이
    // 길어져 읽는 속도가 떨어진다 — 한글 기준 40~50자 언저리.
    content: { value: '56rem' },
  },

  // `strictTokens: true`에서는 `borderWidth: '1px'`이 막힌다. 이름을 주지 않으면
  // 컴포넌트마다 `'[1px]'` 이스케이프가 붙는데, 그러면 정작 **의도적인** 이탈을
  // 표시하려고 만든 이스케이프가 잡음이 되어 눈에 안 띈다.
  borderWidths: {
    hairline: { value: '1px' },
    thick: { value: '2px' },
  },
});

const semanticTokens = defineSemanticTokens({
  colors: {
    // ── 지면 ────────────────────────────────────────────────────────────────
    bg: {
      // 페이지 바닥.
      canvas: {
        value: { base: '{colors.slate.50}', _dark: '{colors.slate.950}' },
      },
      // 카드·패널처럼 캔버스 위에 한 겹 올라온 면.
      surface: {
        value: { base: '{colors.slate.0}', _dark: '{colors.slate.900}' },
      },
      // surface 위에 또 한 겹(드롭다운, 툴팁). 라이트에서는 흰색이 더 올라갈
      // 곳이 없어 그림자로 층을 만들고, 다크에서만 실제로 밝아진다.
      raised: {
        value: { base: '{colors.slate.0}', _dark: '{colors.slate.800}' },
      },
      // 반전면 — 지면과 명도가 뒤집힌 블록(코드, 강조 배너).
      inverted: {
        value: { base: '{colors.slate.900}', _dark: '{colors.slate.100}' },
      },
      // 미묘한 강조(hover, 줄무늬 표). 알파를 쓰지 않는 이유: 겹쳐 칠할 때
      // 누적돼 예상 밖의 명도가 나온다.
      subtle: {
        value: { base: '{colors.slate.100}', _dark: '{colors.slate.800}' },
      },
    },

    // ── 글자 ────────────────────────────────────────────────────────────────
    fg: {
      // 본문. 순수 검정을 피한다 — 흰 지면 위에서 눈이 아프다.
      base: {
        value: { base: '{colors.slate.900}', _dark: '{colors.slate.100}' },
      },
      // 보조 설명. 캔버스 대비 최소 4.5:1을 유지하는 가장 옅은 값이다.
      muted: {
        value: { base: '{colors.slate.600}', _dark: '{colors.slate.400}' },
      },
      // 라벨·캡션처럼 3:1(대형 텍스트 기준)만 필요한 자리. 본문에는 쓰지 말 것.
      subtle: {
        value: { base: '{colors.slate.500}', _dark: '{colors.slate.500}' },
      },
      // bg.inverted 위에 얹는 글자.
      inverted: {
        value: { base: '{colors.slate.50}', _dark: '{colors.slate.900}' },
      },
      // accent.emphasis(채워진 버튼) 위에 얹는 글자. 양쪽 테마 모두 흰색이다 —
      // 액센트가 항상 어두운 쪽이라 반전되지 않는다.
      onAccent: {
        value: { base: '{colors.slate.0}', _dark: '{colors.slate.0}' },
      },
    },

    // ── 선 ──────────────────────────────────────────────────────────────────
    border: {
      subtle: {
        value: { base: '{colors.slate.200}', _dark: '{colors.slate.800}' },
      },
      base: {
        value: { base: '{colors.slate.300}', _dark: '{colors.slate.700}' },
      },
      strong: {
        value: { base: '{colors.slate.400}', _dark: '{colors.slate.600}' },
      },
    },

    // ── 액센트 ──────────────────────────────────────────────────────────────
    accent: {
      // 옅은 배경(뱃지, 선택된 행).
      subtle: {
        value: { base: '{colors.gem.100}', _dark: '{colors.gem.950}' },
      },
      // 링크·아이콘처럼 글자로 쓰는 액센트. 각 테마의 캔버스 위에서 4.5:1을
      // 넘는 쪽을 골랐다 — 라이트 600 / 다크 400.
      base: { value: { base: '{colors.gem.600}', _dark: '{colors.gem.400}' } },
      // 채워진 버튼 배경. 그 위 글자는 fg.onAccent.
      emphasis: {
        value: { base: '{colors.gem.600}', _dark: '{colors.gem.500}' },
      },
      // 포커스 링. 액센트와 같은 축이되 지면과 대비가 큰 쪽으로 한 칸 민다.
      ring: { value: { base: '{colors.gem.500}', _dark: '{colors.gem.400}' } },
    },

    // ── 상태 ────────────────────────────────────────────────────────────────
    positive: {
      base: {
        value: { base: '{colors.jade.600}', _dark: '{colors.jade.400}' },
      },
      subtle: {
        value: { base: '{colors.jade.100}', _dark: '{colors.jade.900}' },
      },
    },
    negative: {
      base: {
        value: { base: '{colors.ruby.600}', _dark: '{colors.ruby.400}' },
      },
      subtle: {
        value: { base: '{colors.ruby.100}', _dark: '{colors.ruby.900}' },
      },
    },

    // 드래그 선택 배경. 글자색은 건드리지 않는다 — 강제하면 링크·구문 강조가
    // 선택 중에만 제 색을 잃는다.
    selection: {
      bg: { value: { base: '{colors.gem.200}', _dark: '{colors.gem.800}' } },
    },
  },
});

export const gemspotPreset = definePreset({
  name: 'gemspot',
  // 테마 토글은 html[data-theme]로 한다. semanticTokens의 `_dark` 값이 이
  // 조건에서 적용된다 — base = 라이트, [data-theme=dark] = 다크.
  //
  // `prefers-color-scheme` 미디어쿼리를 조건으로 쓰지 않는 이유: 시스템 설정과
  // 사용자의 명시 선택을 한 축에서 표현할 수 없다. 시스템 설정 반영은
  // src/app/theme-script.ts가 첫 페인트 전에 data-theme으로 환산해 넣는다.
  conditions: {
    extend: {
      dark: '[data-theme=dark] &',
    },
  },
  theme: {
    extend: {
      tokens,
      semanticTokens,
      textStyles: {
        display: {
          value: {
            fontSize: '2.5rem',
            lineHeight: '1.15',
            fontWeight: '700',
            letterSpacing: '-0.02em',
          },
        },
        heading: {
          value: {
            fontSize: '1.375rem',
            lineHeight: '1.35',
            fontWeight: '600',
            letterSpacing: '-0.01em',
          },
        },
        body: {
          value: { fontSize: '1rem', lineHeight: '1.7', fontWeight: '400' },
        },
        caption: {
          value: {
            fontSize: '0.8125rem',
            lineHeight: '1.5',
            fontWeight: '400',
          },
        },
      },
    },
  },
});
