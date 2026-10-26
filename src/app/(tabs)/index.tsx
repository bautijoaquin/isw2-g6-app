import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getTorneos } from '@/api/catalogo';
import { getPartidos } from '@/api/partidos';
import type { Partido } from '@/api/types';
import { SoloRol } from '@/auth/SoloRol';
import { Button, EmptyState, ErrorMessage, FilterChip, Loading, PartidoCard, Screen } from '@/components';
import { useApi } from '@/hooks/useApi';
import { spacing } from '@/theme';

// RF-10: fixture del torneo en curso, por fecha. Es público, no hace falta ingresar.
export default function PartidosScreen() {
  const torneos = useApi(getTorneos);
  const torneo = torneos.data?.find((t) => t.activo) ?? torneos.data?.[0];

  const partidos = useApi(() => (torneo ? getPartidos(torneo.id) : Promise.resolve([])), [torneo?.id]);
  const [elegida, setElegida] = useState<number | null>(null);

  // Al volver del detalle (por ejemplo, después de finalizar un partido) se actualiza el fixture.
  const recargarPartidos = partidos.recargar;
  useFocusEffect(useCallback(() => recargarPartidos(), [recargarPartidos]));

  const fechas = [...new Set((partidos.data ?? []).map((p) => p.numeroFecha))];
  const fecha = elegida ?? fechaParaMostrar(partidos.data ?? []);
  const deLaFecha = (partidos.data ?? []).filter((p) => p.numeroFecha === fecha);

  const error = torneos.error ?? partidos.error;
  const cargando = torneos.cargando || partidos.cargando;
  const recargar = () => (torneos.error ? torneos.recargar() : partidos.recargar());

  return (
    <Screen
      overline={torneo ? `${torneo.nombre} · ${torneo.anio}` : 'Liga Amateur Santafesina'}
      title="Partidos"
      refreshing={cargando}
      onRefresh={recargar}
      action={
        <SoloRol roles={['ADMIN']}>
          <Button title="Programar" size="small" onPress={() => router.push('/partidos/programar')} />
        </SoloRol>
      }>
      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !partidos.data ? <Loading /> : null}

      {fechas.length > 0 ? (
        <View style={styles.fechas}>
          {fechas.map((n) => (
            <FilterChip key={n} label={`Fecha ${n}`} selected={n === fecha} onPress={() => setElegida(n)} />
          ))}
        </View>
      ) : null}

      {partidos.data && partidos.data.length === 0 ? (
        <EmptyState title="Todavía no hay partidos" description="Cuando se programen, van a aparecer acá." />
      ) : null}

      {deLaFecha.map((p) => (
        <PartidoCard
          key={p.id}
          partido={p}
          onPress={() => router.push({ pathname: '/partidos/[id]', params: { id: String(p.id) } })}
        />
      ))}
    </Screen>
  );
}

/** La primera fecha con partidos sin terminar; si ya se jugó todo, la última. */
function fechaParaMostrar(partidos: Partido[]): number | null {
  const pendiente = partidos.find((p) => p.estado === 'PROGRAMADO' || p.estado === 'EN_JUEGO');
  return pendiente?.numeroFecha ?? partidos.at(-1)?.numeroFecha ?? null;
}

const styles = StyleSheet.create({
  fechas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
