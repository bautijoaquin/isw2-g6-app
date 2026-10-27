import { ComponentRef, Ref, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { borders, colors, fonts, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = TextInputProps & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  error?: string;
  helper?: string;
};

/** Campo de texto con etiqueta en mayúsculas, ayuda y mensaje de error debajo. */
export function TextField({ label, error, helper, editable = true, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.borderStrong : colors.borderMedium;

  return (
    <View style={styles.wrapper}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        {...props}
        editable={editable}
        placeholderTextColor={colors.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, { borderColor }, !editable && styles.disabled, style]}
      />
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.helper}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.helper}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.background,
    borderWidth: borders.regular,
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
  },
  disabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  helper: {
    marginTop: spacing.xs,
  },
});
