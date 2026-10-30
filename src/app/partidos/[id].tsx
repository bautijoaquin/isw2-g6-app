import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { ComponentProps, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import { eliminarPartido, getPartido } from '@/api/partidos';
import type { Evento, PartidoDetalle, TipoEvento } from '@/api/types';
import { SoloRol } from '@/auth/SoloRol';
import {
  AccionesPartido,
  AppText,
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Escudo,
  Loading,
  Screen,
  StatusChip,
  estadoPartido,
} from '@/components';
import { useApi } from '@/hooks/useApi';
import { colors, fonts, spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';
import { diaCorto, hora } from '@/utils/formato';
import { volver } from '@/utils/navegacion';

type Icono = ComponentProps<typeof MaterialCommunityIcons>['name'];

const iconoEvento: Record<TipoEvento, { icono: Icono; color: string; texto: string }> = {
  GOL: { icono: 'soccer', color: colors.text, texto: 'Gol' },
  AMARILLA: { icono: 'card', color: colors.warning, texto: 'Amarilla' },
  ROJA: { icono: 'card', color: colors.error, texto: 'Roja' },
};

// RF-10: detalle público de un partido con el resultado calculado (RN-06) y sus eventos.
// RF-07: el delegado o el admin cambian el estado desde acá.
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
      <SoloRol roles={['ADMIN', 'DELEGADO']}>
        <AccionesPartido partido={partido} onCambio={recargar} />
        {/* RF-08: los goles y tarjetas se cargan solo con el partido en juego */}
        {partido.estado === 'EN_JUEGO' ? (
          <Button
            title="Cargar goles y tarjetas"
            size="large"
            onPress={() => router.push({ pathname: '/en-vivo/[id]', params: { id: String(partido.id) } })}
            style={styles.cargar}
          />
        ) : null}
      </SoloRol>
      {partido.estado === 'PROGRAMADO' ? (
        <SoloRol roles={['ADMIN']}>
          <OpcionesAdmin partido={partido} />
        </SoloRol>
      ) : null}

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

/** RF-06 y RN-07: solo un partido PROGRAMADO se modifica o se elimina. */
function OpcionesAdmin({ partido }: { partido: PartidoDetalle }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function eliminar() {
    const titulo = `¿Eliminar ${partido.local.nombre} vs ${partido.visitante.nombre}?`;
    if (!(await confirmar(titulo, 'El partido se borra del fixture.', 'Eliminar'))) return;
    setEliminando(true);
    setError(null);
    try {
      await eliminarPartido(partido.id);
      volver('/');
    } catch (e) {
      setError(mensajeDeError(e));
      setEliminando(false);
    }
  }

  return (
    <View style={styles.opciones}>
      {error ? <ErrorMessage message={error} /> : null}
      <Button
        title="Modificar"
        variant="secondary"
        onPress={() => router.push({ pathname: '/partidos/programar', params: { id: String(partido.id) } })}
      />
      <Button title="Eliminar" variant="ghost" onPress={eliminar} loading={eliminando} />
    </View>
  );
}

function Marcador({ partido }: { partido: PartidoDetalle }) {
  const estado = estadoPartido[partido.estado];
  const conResultado = partido.estado !== 'PROGRAMADO';
  return (
    <Card variant="elevated" style={styles.tarjeta}>
      <StatusChip label={estado.label} status={estado.status} />
      <View style={styles.marcador}>
        <View style={styles.equipo}>
          <Escudo nombre={partido.local.nombre} size={60} />
          <AppText variant="body" style={styles.nombre} numberOfLines={2}>
            {partido.local.nombre}
          </AppText>
        </View>
        <AppText variant="display" style={styles.goles}>
          {conResultado ? `${partido.golesLocal} : ${partido.golesVisitante}` : 'vs'}
        </AppText>
        <View style={styles.equipo}>
          <Escudo nombre={partido.visitante.nombre} size={60} />
          <AppText variant="body" style={styles.nombre} numberOfLines={2}>
            {partido.visitante.nombre}
          </AppText>
        </View>
      </View>
      <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centrado}>
        {diaCorto(partido.fechaHoraInicio)} · {hora(partido.fechaHoraInicio)} · {partido.cancha.nombre}
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centrado}>
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
  tarjeta: {
    alignItems: 'center',
  },
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
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
  goles: {
    minWidth: 100,
    textAlign: 'center',
  },
  centrado: {
    textAlign: 'center',
  },
  cargar: {
    marginTop: spacing.sm,
  },
  opciones: {
    gap: spacing.sm,
    marginTop: spacing.sm,
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
