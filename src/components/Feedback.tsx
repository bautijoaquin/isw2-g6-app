import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { borders, colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

/** Cartel de error con el mensaje que manda el backend y, opcional, un botón para reintentar. */
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.error} accessibilityRole="alert">
      <AppText variant="bodySmall">{message}</AppText>
      {onRetry ? (
        <Button title="Reintentar" variant="secondary" size="small" onPress={onRetry} style={styles.retry} />
      ) : null}
    </View>
  );
}

/** Estado vacío: cuando todavía no hay datos o la pantalla está por hacerse. */
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.empty}>
      <AppText variant="subhead">{title}</AppText>
      {description ? (
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    borderLeftWidth: borders.heavy,
    borderLeftColor: colors.error,
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  retry: {
    alignSelf: 'flex-start',
  },
  empty: {
    borderWidth: borders.regular,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  loading: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
});
