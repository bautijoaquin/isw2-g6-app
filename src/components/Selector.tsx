import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { FilterChip } from './Chip';

type Opcion = { id: number; nombre: string };

/** Elegir una opción de una lista corta (equipos, canchas, árbitros) con chips. */
export function Selector({
  label,
  opciones,
  value,
  onChange,
  error,
}: {
  label: string;
  opciones: Opcion[];
  value: number | null;
  onChange: (id: number) => void;
  error?: string;
}) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.opciones}>
        {opciones.map((o) => (
          <FilterChip key={o.id} label={o.nombre} selected={o.id === value} onPress={() => onChange(o.id)} />
        ))}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.helper}>
          {error}
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  helper: {
    marginTop: spacing.xs,
  },
});
