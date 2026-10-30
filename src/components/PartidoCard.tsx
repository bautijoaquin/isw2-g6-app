import { Pressable, StyleSheet, View } from 'react-native';

import type { EstadoPartido, Partido } from '@/api/types';
import { borders, colors, fonts, radius, spacing } from '@/theme';
import { diaCorto, hora } from '@/utils/formato';

import { AppText } from './AppText';
import { StatusChip } from './Chip';
import { Escudo } from './Escudo';

type Status = 'success' | 'warning' | 'error' | 'neutral';

export const estadoPartido: Record<EstadoPartido, { label: string; status: Status }> = {
  PROGRAMADO: { label: 'Programado', status: 'neutral' },
  EN_JUEGO: { label: 'En vivo', status: 'error' },
  FINALIZADO: { label: 'Final', status: 'success' },
  SUSPENDIDO: { label: 'Suspendido', status: 'warning' },
};

/** Un partido del fixture: escudos a los costados, el marcador (o la hora) al centro, cancha y estado. */
export function PartidoCard({ partido, onPress }: { partido: Partido; onPress?: () => void }) {
  const estado = estadoPartido[partido.estado];
  // RF-10: el resultado se calcula con los goles; uno que todavía no empezó muestra la hora.
  const conResultado = partido.estado !== 'PROGRAMADO';
  const enVivo = partido.estado === 'EN_JUEGO';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, enVivo && styles.cardEnVivo, pressed && styles.pressed]}>
      {enVivo ? (
        <View style={styles.vivo}>
          <View style={styles.punto} />
          <AppText style={styles.vivoTexto}>En vivo</AppText>
        </View>
      ) : null}

      <View style={styles.marcador}>
        <View style={styles.equipo}>
          <Escudo nombre={partido.local.nombre} />
          <AppText variant="bodySmall" style={styles.nombre} numberOfLines={2}>
            {partido.local.nombre}
          </AppText>
        </View>

        <View style={styles.centro}>
          <AppText variant="caption" color={colors.textSecondary}>
            {diaCorto(partido.fechaHoraInicio)}
          </AppText>
          <AppText style={styles.goles}>
            {conResultado ? `${partido.golesLocal} : ${partido.golesVisitante}` : hora(partido.fechaHoraInicio)}
          </AppText>
          {enVivo ? null : <StatusChip label={estado.label} status={estado.status} />}
        </View>

        <View style={styles.equipo}>
          <Escudo nombre={partido.visitante.nombre} />
          <AppText variant="bodySmall" style={styles.nombre} numberOfLines={2}>
            {partido.visitante.nombre}
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={colors.textSecondary} style={styles.cancha} numberOfLines={1}>
        {conResultado ? `${hora(partido.fechaHoraInicio)} · ` : ''}
        {partido.cancha.nombre}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: borders.thin,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardEnVivo: {
    borderColor: 'rgba(229,50,45,0.45)',
    paddingTop: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
  vivo: {
    position: 'absolute',
    top: -1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
  },
  vivoTexto: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.text,
  },
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipo: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  nombre: {
    fontFamily: fonts.bodySemiBold,
    textAlign: 'center',
  },
  centro: {
    minWidth: 96,
    alignItems: 'center',
    gap: 4,
  },
  goles: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
  },
  cancha: {
    textAlign: 'center',
  },
});
