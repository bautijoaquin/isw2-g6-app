/**
 * Tokens de diseño de la app (ver docs/DESIGN.md, estilo "Noche de partido").
 * Fondo oscuro verdoso, tarjetas redondeadas y un acento en degradado lima → verde agua.
 * Usar siempre estos valores en vez de escribir colores o tamaños sueltos.
 */

export const colors = {
  // Marca: el principal es el punto medio del degradado, para lo que no puede llevar degradado
  primary: '#7FE580',
  primaryPressed: '#5FD38F',
  accent: '#E5322D',
  accentPressed: '#C92420',

  // Superficies
  background: '#0B110D',
  surface: '#161D18',
  surfaceRaised: '#222A24',
  /** Encabezado de las pantallas internas: el tono con el que arranca el brillo verde. */
  header: '#122D22',

  // Texto
  text: '#FFFFFF',
  textSecondary: '#9AA39C',
  textTertiary: '#5F6962',
  /** Texto sobre el color principal (verde): oscuro para que se lea. */
  textInverse: '#0B110D',

  // Bordes
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderMedium: 'rgba(255,255,255,0.14)',
  borderStrong: 'rgba(255,255,255,0.24)',

  // Semánticos
  success: '#7FE580',
  successBg: 'rgba(127,229,128,0.12)',
  warning: '#F5C518',
  warningBg: 'rgba(245,197,24,0.12)',
  error: '#FF5A52',
  errorBg: 'rgba(229,50,45,0.14)',
} as const;

/** Degradado principal (botones, pestaña activa, partido destacado), de izquierda a derecha. */
export const gradients = {
  primary: ['#C4F25B', '#3BD8A6'],
  /** Brillo verde muy suave arriba de cada pantalla. */
  glow: ['rgba(59,216,166,0.14)', 'rgba(11,17,13,0)'],
} as const;

/** Nombres con los que se cargan las fuentes en src/app/_layout.tsx. */
export const fonts = {
  display: 'Urbanist_800ExtraBold',
  body: 'Urbanist_500Medium',
  bodyMedium: 'Urbanist_600SemiBold',
  bodySemiBold: 'Urbanist_700Bold',
  bodyBold: 'Urbanist_800ExtraBold',
  mono: 'SpaceMono_400Regular',
} as const;

/** Escala de espaciado: base de 8px. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Bordes finos: en fondo oscuro separan sin cortar. */
export const borders = {
  thin: 1,
  regular: 1,
  accent: 2,
  heavy: 2,
} as const;

/** Redondeos: tarjetas grandes, campos medianos y píldoras para botones y chips. */
export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

/** Escala tipográfica adaptada a pantalla de celular. */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 },
  headline: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  subhead: { fontFamily: fonts.bodyBold, fontSize: 20, lineHeight: 26 },
  bodyLarge: { fontFamily: fonts.body, fontSize: 18, lineHeight: 27 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18 },
  overline: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  mono: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 22 },
} as const;
