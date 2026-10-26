import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { getTorneos } from '@/api/catalogo';
import { getPartidos } from '@/api/resultados';
import type { PartidoResumen, Torneo } from '@/api/types';
import { AppText, EmptyState, ErrorMessage, FilterChip, Loading, Screen, StatusChip } from '@/components';
import { useApi } from '@/hooks/useApi';
import { borders, colors, spacing } from '@/theme';
import { formatearFechaHora } from '@/utils/fechas';
import { estadosPartido } from '@/utils/partidos';

// RF-10: partidos de una fecha con su estado y resultado. Es público.
// Tocando un partido se abre su detalle con los eventos.
export default function PartidosScreen() {
  const { data: torneos, error, recargar } = useApi(getTorneos);
  const [elegido, setElegido] = useState<number | null>(null);

  // Si no se eligió ninguno, se muestra el torneo en curso.
  const torneoId = elegido ?? (torneos?.find((t) => t.activo) ?? torneos?.[0])?.id ?? null;

  if (torneoId === null) {
    return (
      <Screen overline="Liga Amateur Santafesina" title="Partidos" onRefresh={recargar}>
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
        {!torneos && !error ? <Loading /> : null}
        {torneos?.length === 0 ? <EmptyState title="Todavía no hay torneos" /> : null}
      </Screen>
    );
  }

  return <PartidosDelTorneo torneos={torneos ?? []} torneoId={torneoId} onElegir={setElegido} />;
}

function PartidosDelTorneo({
  torneos,
  torneoId,
  onElegir,
}: {
  torneos: Torneo[];
  torneoId: number;
  onElegir: (id: number) => void;
}) {
  const { data: partidos, cargando, error, recargar } = useApi(() => getPartidos(torneoId), [torneoId]);
  const [fechaElegida, setFechaElegida] = useState<number | null>(null);

  // Al volver de un detalle se recarga: puede haber cambiado un resultado.
  useFocusEffect(recargar);

  // El backend los manda ordenados por fecha, así que las fechas quedan en orden.
  const fechas = [...new Set((partidos ?? []).map((p) => p.numeroFecha))];
  const fecha = fechaElegida ?? fechaActual(partidos ?? []);
  const deLaFecha = (partidos ?? []).filter((p) => p.numeroFecha === fecha);

  return (
    <Screen overline="Liga Amateur Santafesina" title="Partidos" refreshing={cargando} onRefresh={recargar}>
      {torneos.length > 1 ? (
        <View style={styles.chips}>
          {torneos.map((t) => (
            <FilterChip
              key={t.id}
              label={t.nombre}
              selected={t.id === torneoId}
              onPress={() => {
                onElegir(t.id);
                setFechaElegida(null);
              }}
            />
          ))}
        </View>
      ) : null}

      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !partidos ? <Loading /> : null}
      {partidos?.length === 0 ? (
        <EmptyState title="Sin partidos" description="Todavía no hay partidos programados en este torneo." />
      ) : null}

      {fechas.length > 0 ? (
        <View style={styles.chips}>
          {fechas.map((n) => (
            <FilterChip key={n} label={`Fecha ${n}`} selected={n === fecha} onPress={() => setFechaElegida(n)} />
          ))}
        </View>
      ) : null}

      {deLaFecha.map((p) => (
        <TarjetaPartido key={p.id} partido={p} />
      ))}
    </Screen>
  );
}

/**
 * Fecha que se muestra al abrir: la primera que todavía tiene partidos sin terminar.
 * Si ya terminaron todas, la última.
 */
function fechaActual(partidos: PartidoResumen[]) {
  const pendiente = partidos.find((p) => p.estado === 'PROGRAMADO' || p.estado === 'EN_JUEGO');
  return pendiente?.numeroFecha ?? partidos.at(-1)?.numeroFecha ?? null;
}

function TarjetaPartido({ partido }: { partido: PartidoResumen }) {
  const estado = estadosPartido[partido.estado];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/partidos/[id]', params: { id: String(partido.id) } })}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <View style={styles.encabezado}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.flex}>
          {formatearFechaHora(partido.fechaHoraInicio)} · {partido.cancha.nombre}
        </AppText>
        <StatusChip label={estado.label} status={estado.status} />
      </View>
      <FilaEquipo nombre={partido.local.nombre} goles={partido.golesLocal} />
      <FilaEquipo nombre={partido.visitante.nombre} goles={partido.golesVisitante} />
    </Pressable>
  );
}

/** RF-10: un partido sin goles muestra 0 a 0, también si todavía no empezó. */
function FilaEquipo({ nombre, goles }: { nombre: string; goles: number }) {
  return (
    <View style={styles.fila}>
      <AppText variant="body" style={styles.flex}>
        {nombre}
      </AppText>
      <AppText variant="subhead">{goles}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tarjeta: {
    borderWidth: borders.regular,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  presionada: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
