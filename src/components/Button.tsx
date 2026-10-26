import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';

import { borders, colors, fonts } from '@/theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'small' | 'medium' | 'large';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

/** Colores de cada variante: [normal, presionado]. */
const palette: Record<Variant, { bg: [string, string]; border: [string, string]; text: [string, string] }> = {
  primary: {
    bg: [colors.primary, colors.accent],
    border: [colors.primary, colors.accent],
    text: [colors.textInverse, colors.textInverse],
  },
  secondary: {
    bg: ['transparent', colors.primary],
    border: [colors.primary, colors.primary],
    text: [colors.text, colors.textInverse],
  },
  ghost: {
    bg: ['transparent', 'transparent'],
    border: ['transparent', 'transparent'],
    text: [colors.text, colors.accent],
  },
  destructive: {
    bg: [colors.accent, colors.accentPressed],
    border: [colors.accent, colors.accentPressed],
    text: [colors.textInverse, colors.textInverse],
  },
};

const sizes: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  small: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 12 },
  medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14 },
  large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled,
  loading,
  style,
}: Props) {
  const p = palette[variant];
  const s = sizes[size];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => {
        const i = pressed ? 1 : 0;
        return [
          styles.base,
          {
            backgroundColor: p.bg[i],
            borderColor: p.border[i],
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
          },
          disabled && styles.disabled,
          style,
        ];
      }}>
      {({ pressed }) =>
        loading ? (
          <ActivityIndicator color={p.text[0]} size="small" />
        ) : (
          <AppText style={[styles.label, { fontSize: s.fontSize, color: p.text[pressed ? 1 : 0] }]}>
            {title}
          </AppText>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: borders.regular,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  label: {
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  disabled: {
    opacity: 0.35,
  },
});
