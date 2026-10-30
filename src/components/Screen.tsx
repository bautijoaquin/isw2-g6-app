import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, gradients, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = {
  /** Etiqueta chica en mayúsculas arriba del título (sección). */
  overline?: string;
  title?: string;
  /** Algo a la derecha del título, por ejemplo un botón "Nuevo". */
  action?: ReactNode;
  children: ReactNode;
  /** false para pantallas que ya tienen su propia lista con scroll (FlatList). */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

/** Contenedor estándar de cada pantalla: área segura, brillo verde arriba, encabezado y scroll. */
export function Screen({ overline, title, action, children, scroll = true, refreshing, onRefresh }: Props) {
  const header = title ? (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {overline ? (
          <AppText variant="overline" color={colors.textSecondary}>
            {overline}
          </AppText>
        ) : null}
        <AppText variant="headline" accessibilityRole="header">
          {title}
        </AppText>
      </View>
      {action}
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <LinearGradient colors={gradients.glow} style={styles.glow} pointerEvents="none" />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            ) : undefined
          }>
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  fill: {
    flex: 1,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
});
