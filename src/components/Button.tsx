import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';

import { borders, colors, fonts, gradients, radius } from '@/theme';

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

/** Colores de cada variante: [normal, presionado]. El primario lleva además el degradado de fondo. */
const palette: Record<Variant, { bg: [string, string]; border: [string, string]; text: [string, string] }> = {
  primary: {
    bg: ['transparent', 'transparent'],
    border: ['transparent', 'transparent'],
    text: [colors.textInverse, colors.textInverse],
  },
  secondary: {
    bg: [colors.surfaceRaised, colors.surface],
    border: [colors.borderMedium, colors.borderStrong],
    text: [colors.text, colors.text],
  },
  ghost: {
    bg: ['transparent', 'transparent'],
    border: ['transparent', 'transparent'],
    text: [colors.textSecondary, colors.primary],
  },
  destructive: {
    bg: [colors.accent, colors.accentPressed],
    border: [colors.accent, colors.accentPressed],
    text: [colors.text, colors.text],
  },
};

const sizes: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number; minHeight: number }> = {
  small: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 13, minHeight: 36 },
  medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15, minHeight: 48 },
  large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16, minHeight: 56 },
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
            minHeight: s.minHeight,
          },
          variant === 'primary' && pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ];
      }}>
      {({ pressed }) => (
        <>
          {variant === 'primary' ? (
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          {loading ? (
            <ActivityIndicator color={p.text[0]} size="small" />
          ) : (
            <AppText style={[styles.label, { fontSize: s.fontSize, color: p.text[pressed ? 1 : 0] }]}>{title}</AppText>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: borders.regular,
    borderRadius: radius.pill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.35,
  },
});
