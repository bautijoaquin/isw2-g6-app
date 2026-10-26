import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { getPartido } from '@/api/resultados';
import type { Evento, PartidoDetalle } from '@/api/types';
import { AppText, Card, EmptyState, ErrorMessage, Loading, Screen, StatusChip } from '@/components';
import { estadoPartido } from '@/components/PartidoCard';
import { useApi } from '@/hooks/useApi';
import { borders, colors, spacing } from '@/theme';
import { formatearFechaHora } from '@/utils/fechas';

/** Cada cuánto se actualiza un partido EN_JUEGO, para ver los goles sin tirar para abajo. */
const REFRESCO_EN_JUEGO_MS = 30_000;

// RF-10: detalle de un partido con su resultado y sus eventos. Es público.
// El resultado lo calcula el backend con los goles (RN-06): un partido sin goles viene 0 a 0.
export default function PartidoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: partido, cargando, error, recargar } = useApi(() => getPartido(Number(id)), [id]);

  const enJuego = partido?.estado === 'EN_JUEGO';
  useEffect(() => {
    if (!enJuego) return;
    const intervalo = setInterval(recargar, REFRESCO_EN_JUEGO_MS);
    return () => clearInterval(intervalo);
  }, [enJuego, recargar]);

  if (!partido) {
    return (
      <Screen overline="Partido" title="Detalle">
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }

  return (
    <Screen overline={`Fecha ${partido.numeroFecha}`} title="Partido" refreshing={cargando} onRefresh={recargar}>
      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      <Marcador partido={partido} />

      <View style={styles.seccion}>
        <AppText variant="subhead">Eventos</AppText>
        {partido.eventos.length === 0 ? (
          <EmptyState
            title="Sin eventos"
            description={
              partido.estado === 'PROGRAMADO' ? 'El partido todavía no empezó.' : 'No hubo goles ni tarjetas.'
            }
          />
        ) : (
          partido.eventos.map((e) => (
            <FilaEvento key={e.id} evento={e} esLocal={e.equipoId === partido.local.id} />
          ))
        )}
      </View>
    </Screen>
  );
}

function Marcador({ partido }: { partido: PartidoDetalle }) {
  // Mismos textos y colores que la tarjeta del fixture
  const estado = estadoPartido[partido.estado];
  return (
    <Card style={styles.marcador}>
      <StatusChip label={estado.label} status={estado.status} />

      {/* Un renglón por equipo, como un tablero: así entran los nombres largos */}
      <View>
        <FilaMarcador equipo={partido.local.nombre} goles={partido.golesLocal} />
        <FilaMarcador equipo={partido.visitante.nombre} goles={partido.golesVisitante} />
      </View>

      <View style={styles.datos}>
        <AppText variant="caption" color={colors.textSecondary}>
          {formatearFechaHora(partido.fechaHoraInicio)} · {partido.cancha.nombre}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Árbitro: {partido.arbitro.nombre}
        </AppText>
      </View>
    </Card>
  );
}

function FilaMarcador({ equipo, goles }: { equipo: string; goles: number }) {
  return (
    <View style={styles.filaMarcador}>
      <AppText variant="subhead" style={styles.equipo}>
        {equipo}
      </AppText>
      <AppText variant="display">{goles}</AppText>
    </View>
  );
}

/** Los eventos del local van a la izquierda y los del visitante a la derecha. */
function FilaEvento({ evento, esLocal }: { evento: Evento; esLocal: boolean }) {
  return (
    <View style={[styles.evento, !esLocal && styles.eventoVisitante]}>
      <AppText variant="mono" style={styles.minuto}>
        {evento.minuto}&apos;
      </AppText>
      <IconoEvento tipo={evento.tipo} />
      <AppText variant="bodySmall" style={[styles.jugador, !esLocal && styles.derecha]} numberOfLines={1}>
        {evento.jugador}
        {evento.numeroCamiseta ? ` #${evento.numeroCamiseta}` : ''}
      </AppText>
    </View>
  );
}

function IconoEvento({ tipo }: { tipo: Evento['tipo'] }) {
  if (tipo === 'GOL') {
    return <MaterialCommunityIcons name="soccer" size={18} color={colors.text} accessibilityLabel="Gol" />;
  }
  const color = tipo === 'ROJA' ? colors.error : colors.warning;
  return (
    <View
      accessibilityLabel={tipo === 'ROJA' ? 'Tarjeta roja' : 'Tarjeta amarilla'}
      style={[styles.tarjeta, { backgroundColor: color }]}
    />
  );
}

const styles = StyleSheet.create({
  marcador: {
    borderColor: colors.borderStrong,
    gap: spacing.md,
  },
  filaMarcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  equipo: {
    flex: 1,
  },
  derecha: {
    textAlign: 'right',
  },
  datos: {
    gap: spacing.xs,
  },
  seccion: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  evento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.borderSubtle,
  },
  eventoVisitante: {
    flexDirection: 'row-reverse',
  },
  minuto: {
    width: 36,
  },
  jugador: {
    flex: 1,
  },
  tarjeta: {
    width: 12,
    height: 16,
  },
});
