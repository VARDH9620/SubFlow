// src/design/tokens.ts
interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  border: string;
}

interface DesignTokens {
  colors: { light: ColorPalette; dark: ColorPalette };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  elevation: Record<string, string>;
  typography: {
    fontFamily: string;
    fontWeight: Record<string, number>;
    fontSize: Record<string, string>;
  };
}

export const tokens: DesignTokens = {
  colors: {
    light: {
      primary: '#3b82f6', // blue 500
      secondary: '#8b5cf6', // purple 500
      background: '#f5f7fa',
      surface: 'rgba(255,255,255,0.75)',
      accent: '#10b981', // emerald 500
      text: '#1f2937', // gray 800
      border: '#d1d5db', // gray 300
    },
    dark: {
      primary: '#4f46e5', // indigo 600
      secondary: '#ec4899', // pink 500
      background: '#0f172a', // slate 900
      surface: 'rgba(31,41,55,0.85)', // gray-800 with opacity
      accent: '#22d3ee', // cyan 400
      text: '#f9fafb', // gray 50
      border: '#374151', // gray 700
    },
  },
  spacing: {
    '0': '0px',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '56': '14rem',
    '64': '16rem',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  elevation: {
    e1: '0 1px 3px rgba(0,0,0,0.12)',
    e2: '0 4px 6px rgba(0,0,0,0.15)',
    e3: '0 10px 20px rgba(0,0,0,0.2)',
    e4: '0 15px 30px rgba(0,0,0,0.25)',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
};

/**
 * Generates a CSS string that defines all design tokens as CSS variables.
 * It injects variables into :root for light theme and [data-theme="dark"] for dark.
 */
export const generateCSSVariables = () => {
  const { light, dark } = tokens.colors;
  const vars = (palette: typeof light) =>
    Object.entries(palette)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join('\n  ');

  const spacing = Object.entries(tokens.spacing)
    .map(([k, v]) => `--spacing-${k}: ${v};`)
    .join('\n  ');

  const radius = Object.entries(tokens.radius)
    .map(([k, v]) => `--radius-${k}: ${v};`)
    .join('\n  ');

  const elevation = Object.entries(tokens.elevation)
    .map(([k, v]) => `--elevation-${k}: ${v};`)
    .join('\n  ');

  const typography = `
    --font-family: ${tokens.typography.fontFamily};
    ${Object.entries(tokens.typography.fontWeight)
      .map(([k, v]) => `--font-weight-${k}: ${v};`)
      .join('\n    ')}
    ${Object.entries(tokens.typography.fontSize)
      .map(([k, v]) => `--font-size-${k}: ${v};`)
      .join('\n    ')}
  `;

  return `
:root {
  ${vars(light)}
  ${spacing}
  ${radius}
  ${elevation}
  ${typography}
}
[data-theme='dark'] {
  ${vars(dark)}
}
`;
};
