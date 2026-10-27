import { Pressable, StyleSheet, View } from 'react-native';

import type { EstadoPartido, Partido } from '@/api/types';
import { colors, spacing } from '@/theme';
import { diaCorto, hora } from '@/utils/formato';

import { AppText } from './AppText';
import { StatusChip } from './Chip';

type Status = 'success' | 'warning' | 'error' | 'neutral';

export const estadoPartido: Record<EstadoPartido, { label: string; status: Status }> = {
  PROGRAMADO: { label: 'Programado', status: 'neutral' },
  EN_JUEGO: { label: 'En juego', status: 'warning' },
  FINALIZADO: { label: 'Final', status: 'success' },
  SUSPENDIDO: { label: 'Suspendido', status: 'error' },
};

/** Un partido del fixture: día, hora, cancha, estado y el marcador (o "vs" si todavía no empezó). */
export function PartidoCard({ partido, onPress }: { partido: Partido; onPress?: () => void }) {
  const estado = estadoPartido[partido.estado];
  // RF-10: el resultado se calcula con los goles; uno que todavía no empezó muestra «vs».
  const conResultado = partido.estado !== 'PROGRAMADO';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.arriba}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.info}>
          {diaCorto(partido.fechaHoraInicio)} · {hora(partido.fechaHoraInicio)} · {partido.cancha.nombre}
        </AppText>
        <StatusChip label={estado.label} status={estado.status} />
      </View>

      <View style={styles.marcador}>
        <AppText variant="body" style={[styles.equipo, styles.local]} numberOfLines={2}>
          {partido.local.nombre}
        </AppText>
        <AppText variant="subhead" style={styles.goles}>
          {conResultado ? `${partido.golesLocal} - ${partido.golesVisitante}` : 'vs'}
        </AppText>
        <AppText variant="body" style={styles.equipo} numberOfLines={2}>
          {partido.visitante.nombre}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  arriba: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  equipo: {
    flex: 1,
  },
  local: {
    textAlign: 'right',
  },
  goles: {
    minWidth: 64,
    textAlign: 'center',
  },
});
