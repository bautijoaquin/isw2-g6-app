import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { borders, colors, fonts, gradients, radius } from '@/theme';

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
      {selected ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
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
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  filter: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: borders.regular,
    borderColor: colors.borderSubtle,
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterSelected: {
    borderColor: 'transparent',
  },
  filterText: {
    letterSpacing: 0.2,
  },
});
