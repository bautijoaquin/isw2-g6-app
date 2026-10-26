import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, type } from '@/theme';

export type TextVariant = keyof typeof type;

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
};

/** Texto con la tipografía del diseño. Por defecto es texto de cuerpo. */
export function AppText({ variant = 'body', color = colors.text, style, ...props }: Props) {
  return <Text {...props} style={[styles.base, type[variant], { color }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
