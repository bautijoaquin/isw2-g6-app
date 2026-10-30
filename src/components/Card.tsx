import { StyleSheet, View, ViewProps } from 'react-native';

import { borders, colors, radius, spacing } from '@/theme';

type Props = ViewProps & {
  /** "elevated" agrega el borde verde: usarla para lo destacado. */
  variant?: 'default' | 'elevated';
};

export function Card({ variant = 'default', style, ...props }: Props) {
  return <View {...props} style={[styles.base, variant === 'elevated' && styles.elevated, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderWidth: borders.regular,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  elevated: {
    borderColor: 'rgba(127,229,128,0.35)',
  },
});
