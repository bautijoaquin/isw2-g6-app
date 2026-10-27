import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import { cambiarActivoEquipo, getEquipo, getPlantel } from '@/api/equipos';
import type { Equipo, Jugador } from '@/api/types';
import { useAuth } from '@/auth/AuthContext';
import { SoloRol } from '@/auth/SoloRol';
import { AppText, Button, EmptyState, ErrorMessage, ListItem, Loading, Screen, StatusChip } from '@/components';
import { useApi } from '@/hooks/useApi';
import { borders, colors, spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';

// RF-04: plantel del equipo (público). El admin puede editar el equipo, darlo de baja y sumar jugadores.
export default function EquipoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const equipoId = Number(id);
  const { tieneRol } = useAuth();
  const esAdmin = tieneRol('ADMIN');

  const datos = useApi(
    () => Promise.all([getEquipo(equipoId), getPlantel(equipoId, esAdmin)]),
    [equipoId, esAdmin],
  );

  // Al volver de editar el equipo o un jugador, se actualiza.
  const recargar = datos.recargar;
  useFocusEffect(useCallback(() => recargar(), [recargar]));

  if (!datos.data) {
    return (
      <Screen overline="Equipos" title="Equipo">
        {datos.error ? <ErrorMessage message={datos.error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }

  const [equipo, plantel] = datos.data;
  return (
    <DetalleEquipo
      equipo={equipo}
      plantel={plantel}
      cargando={datos.cargando}
      error={datos.error}
      onCambio={recargar}
    />
  );
}

type Props = {
  equipo: Equipo;
  plantel: Jugador[];
  cargando: boolean;
  error: string | null;
  onCambio: () => void;
};

function DetalleEquipo({ equipo, plantel, cargando, error, onCambio }: Props) {
  const { tieneRol } = useAuth();
  const esAdmin = tieneRol('ADMIN');
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  async function alternarActivo() {
    const activar = !equipo.activo;
    if (!activar) {
      const ok = await confirmar(
        `¿Dar de baja a ${equipo.nombre}?`,
        'No se va a poder programar en partidos nuevos. Se conservan sus partidos y estadísticas.',
        'Dar de baja',
      );
      if (!ok) return;
    }
    setCambiandoEstado(true);
    setErrorAccion(null);
    try {
      await cambiarActivoEquipo(equipo.id, activar);
      onCambio();
    } catch (e) {
      setErrorAccion(mensajeDeError(e));
    } finally {
      setCambiandoEstado(false);
    }
  }

  const ordenado = [...plantel].sort(
    (a, b) => (a.numeroCamiseta ?? 100) - (b.numeroCamiseta ?? 100) || a.apellido.localeCompare(b.apellido),
  );

  return (
    <Screen
      overline={equipo.barrio ?? 'Equipo'}
      title={equipo.nombre}
      refreshing={cargando}
      onRefresh={onCambio}
      action={
        <SoloRol roles={['ADMIN']}>
          <Button
            title="Editar"
            size="small"
            variant="secondary"
            onPress={() => router.push({ pathname: '/equipos/editar', params: { id: String(equipo.id) } })}
          />
        </SoloRol>
      }>
      {!equipo.activo ? (
        <View style={styles.estado}>
          <StatusChip label="De baja" status="error" />
        </View>
      ) : null}

      {error ? <ErrorMessage message={error} onRetry={onCambio} /> : null}
      {errorAccion ? <ErrorMessage message={errorAccion} /> : null}

      <View style={styles.encabezado}>
        <AppText variant="overline" color={colors.textSecondary} style={styles.flex}>
          Plantel · {plantel.filter((j) => j.activo).length} jugadores
        </AppText>
        <SoloRol roles={['ADMIN']}>
          <Button
            title="Agregar"
            size="small"
            onPress={() =>
              router.push({ pathname: '/jugadores/editar', params: { equipoId: String(equipo.id) } })
            }
          />
        </SoloRol>
      </View>

      {ordenado.length === 0 ? <EmptyState title="Sin jugadores" description="Todavía no hay jugadores cargados." /> : null}

      {ordenado.map((j) => (
        <ListItem
          key={j.id}
          icon="tshirt-crew-outline"
          title={`${j.numeroCamiseta != null ? `${j.numeroCamiseta}. ` : ''}${j.apellido}, ${j.nombre}`}
          subtitle={esAdmin ? `DNI ${j.dni}` : undefined}
          right={j.activo ? null : <StatusChip label="De baja" status="error" />}
          onPress={
            esAdmin
              ? () => router.push({ pathname: '/jugadores/editar', params: { id: String(j.id) } })
              : undefined
          }
        />
      ))}

      <SoloRol roles={['ADMIN']}>
        <View style={styles.baja}>
          <Button
            title={equipo.activo ? 'Dar de baja el equipo' : 'Reactivar el equipo'}
            variant={equipo.activo ? 'destructive' : 'primary'}
            onPress={alternarActivo}
            loading={cambiandoEstado}
          />
        </View>
      </SoloRol>
    </Screen>
  );
}

const styles = StyleSheet.create({
  estado: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: borders.regular,
    borderBottomColor: colors.borderStrong,
  },
  flex: {
    flex: 1,
  },
  baja: {
    marginTop: spacing.xl,
  },
});
