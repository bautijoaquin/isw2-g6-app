import { StyleSheet, View, ViewProps } from 'react-native';

import { borders, colors, spacing } from '@/theme';

type Props = ViewProps & {
  /** "elevated" agrega la franja roja arriba: usarla para lo destacado. */
  variant?: 'default' | 'elevated';
};

export function Card({ variant = 'default', style, ...props }: Props) {
  return <View {...props} style={[styles.base, variant === 'elevated' && styles.elevated, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
    borderWidth: borders.regular,
    borderColor: colors.borderSubtle,
    borderRadius: 0,
    padding: spacing.lg,
  },
  elevated: {
    borderTopWidth: borders.heavy,
    borderTopColor: colors.accent,
  },
});
