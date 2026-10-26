import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { getPartido } from '@/api/partidos';
import type { Evento, PartidoDetalle, TipoEvento } from '@/api/types';
import { AppText, Card, EmptyState, ErrorMessage, Loading, Screen, StatusChip, estadoPartido } from '@/components';
import { useApi } from '@/hooks/useApi';
import { colors, spacing } from '@/theme';
import { diaCorto, hora } from '@/utils/formato';

type Icono = ComponentProps<typeof MaterialCommunityIcons>['name'];

const iconoEvento: Record<TipoEvento, { icono: Icono; color: string; texto: string }> = {
  GOL: { icono: 'soccer', color: colors.text, texto: 'Gol' },
  AMARILLA: { icono: 'card', color: colors.warning, texto: 'Amarilla' },
  ROJA: { icono: 'card', color: colors.error, texto: 'Roja' },
};

// RF-10: detalle público de un partido con el resultado calculado (RN-06) y sus eventos.
export default function DetallePartidoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: partido, error, cargando, recargar } = useApi(() => getPartido(Number(id)), [id]);

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

      <AppText variant="overline" color={colors.textSecondary} style={styles.seccion}>
        Goles y tarjetas
      </AppText>
      {partido.eventos.length === 0 ? (
        <EmptyState title="Sin eventos" description="Los goles y tarjetas aparecen acá a medida que se cargan." />
      ) : null}
      {partido.eventos.map((e) => (
        <FilaEvento key={e.id} evento={e} partido={partido} />
      ))}
    </Screen>
  );
}

function Marcador({ partido }: { partido: PartidoDetalle }) {
  const estado = estadoPartido[partido.estado];
  const conResultado = partido.estado !== 'PROGRAMADO';
  return (
    <Card variant="elevated">
      <StatusChip label={estado.label} status={estado.status} />
      <View style={styles.marcador}>
        <AppText variant="subhead" style={[styles.equipo, styles.local]}>
          {partido.local.nombre}
        </AppText>
        <AppText variant="headline" style={styles.goles}>
          {conResultado ? `${partido.golesLocal} - ${partido.golesVisitante}` : 'vs'}
        </AppText>
        <AppText variant="subhead" style={styles.equipo}>
          {partido.visitante.nombre}
        </AppText>
      </View>
      <AppText variant="bodySmall" color={colors.textSecondary}>
        {diaCorto(partido.fechaHoraInicio)} · {hora(partido.fechaHoraInicio)} · {partido.cancha.nombre}
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary}>
        Árbitro: {partido.arbitro.nombre}
      </AppText>
    </Card>
  );
}

function FilaEvento({ evento, partido }: { evento: Evento; partido: PartidoDetalle }) {
  const tipo = iconoEvento[evento.tipo];
  const equipo = evento.equipoId === partido.local.id ? partido.local.nombre : partido.visitante.nombre;
  const camiseta = evento.numeroCamiseta ? ` (${evento.numeroCamiseta})` : '';
  return (
    <View style={styles.evento}>
      <AppText variant="mono" style={styles.minuto}>
        {evento.minuto}&apos;
      </AppText>
      <MaterialCommunityIcons name={tipo.icono} size={20} color={tipo.color} />
      <View style={styles.flex}>
        <AppText variant="body">
          {evento.jugador}
          {camiseta}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {tipo.texto} · {equipo}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  equipo: {
    flex: 1,
  },
  local: {
    textAlign: 'right',
  },
  goles: {
    minWidth: 90,
    textAlign: 'center',
  },
  seccion: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  evento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  minuto: {
    width: 36,
  },
  flex: {
    flex: 1,
  },
});
