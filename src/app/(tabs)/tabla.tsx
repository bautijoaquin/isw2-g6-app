import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getTorneos } from '@/api/catalogo';
import { getSuspendidos, getTabla } from '@/api/resultados';
import type { FilaTabla, Torneo } from '@/api/types';
import {
  AppText,
  Button,
  EmptyState,
  ErrorMessage,
  FilterChip,
  ListItem,
  Loading,
  Screen,
  StatusChip,
} from '@/components';
import { useApi } from '@/hooks/useApi';
import { borders, colors, fonts, radius, spacing } from '@/theme';

// RF-11: tabla de posiciones y RF-12: suspendidos de una fecha. Son públicas, no piden sesión.
// El backend ya manda la tabla calculada y ordenada: la app solo la muestra (RN-06).
export default function TablaScreen() {
  const { data: torneos, error, recargar } = useApi(getTorneos);
  const [elegido, setElegido] = useState<number | null>(null);

  // Si no se eligió ninguno, se muestra el torneo en curso.
  const torneoId = elegido ?? (torneos?.find((t) => t.activo) ?? torneos?.[0])?.id ?? null;

  if (torneoId === null) {
    return (
      <Screen overline="Posiciones" title="Tabla" onRefresh={recargar}>
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
        {!torneos && !error ? <Loading /> : null}
        {torneos?.length === 0 ? <EmptyState title="Todavía no hay torneos" /> : null}
      </Screen>
    );
  }

  return <TablaDelTorneo torneos={torneos ?? []} torneoId={torneoId} onElegir={setElegido} />;
}

function TablaDelTorneo({
  torneos,
  torneoId,
  onElegir,
}: {
  torneos: Torneo[];
  torneoId: number;
  onElegir: (id: number) => void;
}) {
  const { data: filas, cargando, error, recargar } = useApi(() => getTabla(torneoId), [torneoId]);
  // Al tirar para abajo se recargan la tabla y los suspendidos juntos.
  const [refresco, setRefresco] = useState(0);
  const recargarTodo = useCallback(() => {
    recargar();
    setRefresco((r) => r + 1);
  }, [recargar]);

  // Al volver a la pestaña se recarga: puede haber terminado un partido.
  useFocusEffect(recargarTodo);

  return (
    <Screen overline="Posiciones" title="Tabla" refreshing={cargando} onRefresh={recargarTodo}>
      {torneos.length > 1 ? (
        <View style={styles.chips}>
          {torneos.map((t) => (
            <FilterChip key={t.id} label={t.nombre} selected={t.id === torneoId} onPress={() => onElegir(t.id)} />
          ))}
        </View>
      ) : null}

      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !filas ? <Loading /> : null}
      {filas?.length === 0 ? <EmptyState title="Todavía no hay equipos en el torneo" /> : null}
      {filas && filas.length > 0 ? <Tabla filas={filas} /> : null}

      {filas ? (
        <Suspendidos key={torneoId} torneoId={torneoId} fechaInicial={proximaFecha(filas)} refresco={refresco} />
      ) : null}
    </Screen>
  );
}

/**
 * Fecha que se muestra al abrir los suspendidos. Cada equipo juega un partido por fecha,
 * así que la próxima fecha es la mayor cantidad de partidos jugados + 1. Se puede cambiar a mano.
 */
function proximaFecha(filas: FilaTabla[]) {
  return Math.max(0, ...filas.map((f) => f.pj)) + 1;
}

const columnas = ['pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'dg', 'pts'] as const;

/** Columnas de RF-11. Los números tienen ancho fijo y el nombre del equipo usa lo que sobra. */
function Tabla({ filas }: { filas: FilaTabla[] }) {
  return (
    <View style={styles.tabla}>
      <View style={[styles.fila, styles.encabezado]}>
        <AppText variant="label" style={styles.posicion}>
          #
        </AppText>
        <AppText variant="label" style={styles.equipo}>
          Equipo
        </AppText>
        {columnas.map((c) => (
          <AppText key={c} variant="label" style={styles.numero}>
            {c.toUpperCase()}
          </AppText>
        ))}
      </View>

      {filas.map((f) => (
        <View key={f.equipoId} style={styles.fila}>
          <AppText variant="bodySmall" style={styles.posicion}>
            {f.posicion}
          </AppText>
          <AppText variant="bodySmall" style={styles.equipo} numberOfLines={2}>
            {f.equipo}
          </AppText>
          {columnas.map((c) => (
            <AppText key={c} variant="bodySmall" style={[styles.numero, c === 'pts' && styles.puntos]}>
              {c === 'dg' && f.dg > 0 ? `+${f.dg}` : f[c]}
            </AppText>
          ))}
        </View>
      ))}
    </View>
  );
}

const nombreMotivo = { ROJA: 'Roja', DOBLE_AMARILLA: 'Doble amarilla' } as const;

/** RF-12: quiénes no pueden jugar la fecha elegida (RN-03, lo calcula el backend). */
function Suspendidos({
  torneoId,
  fechaInicial,
  refresco,
}: {
  torneoId: number;
  fechaInicial: number;
  refresco: number;
}) {
  const [fecha, setFecha] = useState(fechaInicial);
  const { data: suspendidos, cargando, error, recargar } = useApi(
    () => getSuspendidos(torneoId, fecha),
    [torneoId, fecha, refresco],
  );

  return (
    <View style={styles.seccion}>
      <AppText variant="subhead">Suspendidos</AppText>

      <View style={styles.selectorFecha}>
        <Button
          title="−"
          variant="secondary"
          size="small"
          disabled={fecha <= 1}
          onPress={() => setFecha(fecha - 1)}
        />
        <AppText variant="label" style={styles.fecha}>
          Fecha {fecha}
        </AppText>
        <Button title="+" variant="secondary" size="small" onPress={() => setFecha(fecha + 1)} />
      </View>

      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !suspendidos ? <Loading /> : null}
      {suspendidos?.length === 0 && !cargando ? (
        <EmptyState title="Sin suspendidos" description={`Todos los jugadores pueden jugar la fecha ${fecha}.`} />
      ) : null}

      {suspendidos?.map((s) => (
        <ListItem
          key={s.jugadorId}
          title={`${s.nombre} ${s.apellido}${s.numeroCamiseta ? ` · #${s.numeroCamiseta}` : ''}`}
          subtitle={`${s.equipo} · sancionado en la fecha ${s.fechaSancion}`}
          right={
            <StatusChip label={nombreMotivo[s.motivo]} status={s.motivo === 'ROJA' ? 'error' : 'warning'} />
          }
        />
      ))}
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
  tabla: {
    backgroundColor: colors.surface,
    borderWidth: borders.thin,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.borderSubtle,
  },
  encabezado: {
    backgroundColor: colors.surfaceRaised,
  },
  posicion: {
    width: 20,
  },
  equipo: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  numero: {
    width: 28,
    textAlign: 'center',
  },
  puntos: {
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },
  seccion: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  selectorFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  fecha: {
    minWidth: 72,
    textAlign: 'center',
  },
});
