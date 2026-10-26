import { StyleSheet, View } from 'react-native';

import type { Rol } from '@/api/types';
import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { FilterChip } from './Chip';

/** Elegir entre Administrador y Delegado. */
export function RolSelector({
  value,
  onChange,
  disabled,
  helper,
}: {
  value: Rol;
  onChange: (rol: Rol) => void;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="label" style={styles.label}>
        Rol
      </AppText>
      <View style={[styles.opciones, disabled && styles.disabled]} pointerEvents={disabled ? 'none' : 'auto'}>
        <FilterChip label="Delegado" selected={value === 'DELEGADO'} onPress={() => onChange('DELEGADO')} />
        <FilterChip label="Administrador" selected={value === 'ADMIN'} onPress={() => onChange('ADMIN')} />
      </View>
      {helper ? (
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
  opciones: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  helper: {
    marginTop: spacing.xs,
  },
});
