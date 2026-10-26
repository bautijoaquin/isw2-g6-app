import { Pressable, StyleSheet, View } from 'react-native';

import { borders, colors, fonts } from '@/theme';

import { AppText } from './AppText';

type Status = 'success' | 'warning' | 'error' | 'neutral';

const statusColors: Record<Status, { bg: string; fg: string }> = {
  success: { bg: colors.successBg, fg: colors.success },
  warning: { bg: colors.warningBg, fg: colors.warning },
  error: { bg: colors.errorBg, fg: colors.error },
  neutral: { bg: colors.surface, fg: colors.textSecondary },
};

/** Etiqueta de estado, por ejemplo ACTIVO / INACTIVO o EN JUEGO. */
export function StatusChip({ label, status = 'neutral' }: { label: string; status?: Status }) {
  const c = statusColors[status];
  return (
    <View style={[styles.status, { backgroundColor: c.bg, borderColor: c.fg }]}>
      <AppText style={[styles.statusText, { color: c.fg }]}>{label}</AppText>
    </View>
  );
}

/** Chip seleccionable para filtros (por ejemplo elegir torneo o rol). */
export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.filter, selected && styles.filterSelected]}>
      <AppText
        variant="label"
        color={selected ? colors.textInverse : colors.textSecondary}
        style={styles.filterText}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  status: {
    alignSelf: 'flex-start',
    borderWidth: borders.regular,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  filter: {
    borderWidth: borders.regular,
    borderColor: colors.borderMedium,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    letterSpacing: 0.5,
  },
});
