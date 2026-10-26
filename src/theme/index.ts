/**
 * Tokens de diseño de la app (ver docs/DESIGN.md, estilo "VoiceBox").
 * Blanco y negro con un único acento rojo, sin bordes redondeados ni sombras.
 * Usar siempre estos valores en vez de escribir colores o tamaños sueltos.
 */

export const colors = {
  // Marca
  primary: '#0A0A0A',
  accent: '#EF4444',
  accentPressed: '#DC2626',

  // Superficies
  background: '#FAFAFA',
  surface: '#F5F5F5',
  surfaceRaised: '#E5E5E5',

  // Texto
  text: '#0A0A0A',
  textSecondary: '#525252',
  textTertiary: '#A3A3A3',
  textInverse: '#FAFAFA',

  // Bordes
  borderSubtle: '#E5E5E5',
  borderMedium: '#D4D4D4',
  borderStrong: '#0A0A0A',

  // Semánticos
  success: '#16A34A',
  successBg: '#F0FDF4',
  warning: '#CA8A04',
  warningBg: '#FEFCE8',
  error: '#EF4444',
  errorBg: '#FEF2F2',
} as const;

/** Nombres con los que se cargan las fuentes en src/app/_layout.tsx. */
export const fonts = {
  display: 'ArchivoBlack_400Regular',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemiBold: 'WorkSans_600SemiBold',
  bodyBold: 'WorkSans_700Bold',
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

/** Bordes: 2px en todo lo interactivo, 1px para separar filas de una lista. */
export const borders = {
  thin: 1,
  regular: 2,
  accent: 3,
  heavy: 4,
} as const;

/** Escala tipográfica adaptada a pantalla de celular. */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 42, letterSpacing: -1 },
  headline: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, letterSpacing: -0.5 },
  subhead: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, letterSpacing: -0.2 },
  bodyLarge: { fontFamily: fonts.body, fontSize: 18, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, letterSpacing: 0.1 },
  overline: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  mono: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 22 },
} as const;
