import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { getTorneos } from '@/api/catalogo';
import { getEquiposDelTorneo } from '@/api/equipos';
import { useAuth } from '@/auth/AuthContext';
import { SoloRol } from '@/auth/SoloRol';
import { Button, EmptyState, ErrorMessage, ListItem, Loading, Screen, StatusChip } from '@/components';
import { useApi } from '@/hooks/useApi';

// RF-03 y RF-05: equipos del torneo en curso. Es público; el admin además ve los dados de baja.
export default function EquiposScreen() {
  const { tieneRol } = useAuth();
  const esAdmin = tieneRol('ADMIN');

  const torneos = useApi(getTorneos);
  const torneo = torneos.data?.find((t) => t.activo) ?? torneos.data?.[0];

  const equipos = useApi(
    () => (torneo ? getEquiposDelTorneo(torneo.id, esAdmin) : Promise.resolve([])),
    [torneo?.id, esAdmin],
  );

  // Al volver de crear o editar un equipo, se recarga la lista.
  const recargarEquipos = equipos.recargar;
  useFocusEffect(useCallback(() => recargarEquipos(), [recargarEquipos]));

  const error = torneos.error ?? equipos.error;
  const cargando = torneos.cargando || equipos.cargando;
  const recargar = () => (torneos.error ? torneos.recargar() : equipos.recargar());

  return (
    <Screen
      overline={torneo ? `${torneo.nombre} · ${torneo.anio}` : 'Clubes'}
      title="Equipos"
      refreshing={cargando}
      onRefresh={recargar}
      action={
        torneo ? (
          <SoloRol roles={['ADMIN']}>
            <Button
              title="Nuevo"
              size="small"
              onPress={() => router.push({ pathname: '/equipos/editar', params: { torneoId: String(torneo.id) } })}
            />
          </SoloRol>
        ) : null
      }>
      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !equipos.data ? <Loading /> : null}

      {equipos.data && equipos.data.length === 0 ? (
        <EmptyState title="Todavía no hay equipos" description="Cuando se inscriban, van a aparecer acá." />
      ) : null}

      {(equipos.data ?? []).map((e) => (
        <ListItem
          key={e.id}
          icon="shield-outline"
          title={e.nombre}
          subtitle={e.barrio ?? undefined}
          right={e.activo ? null : <StatusChip label="De baja" status="error" />}
          onPress={() => router.push({ pathname: '/equipos/[id]', params: { id: String(e.id) } })}
        />
      ))}
    </Screen>
  );
}
