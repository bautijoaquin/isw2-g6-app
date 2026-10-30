import { useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import { borrarEvento, getJugadores, registrarEvento } from '@/api/eventos';
import { getPartido } from '@/api/partidos';
import { getSuspendidos } from '@/api/resultados';
import type { Evento, Jugador, PartidoDetalle, TipoEvento } from '@/api/types';
import { RequiereRol } from '@/auth/SoloRol';
import {
  AppText,
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  IconoEvento,
  Loading,
  Screen,
  StatusChip,
  estadoPartido,
} from '@/components';
import { useApi } from '@/hooks/useApi';
import { borders, colors, fonts, radius, spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';
import { minutoEstimado } from '@/utils/fechas';

// RF-08 y RF-09: el delegado carga goles y tarjetas durante el partido y borra los cargados por error.
// La app guía la carga, pero las reglas (RN-03, RN-04) las controla el backend y acá se muestra su respuesta.
export default function EnVivoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <RequiereRol roles={['ADMIN', 'DELEGADO']} titulo="En vivo">
      <CargarPartido id={Number(id)} />
    </RequiereRol>
  );
}

function CargarPartido({ id }: { id: number }) {
  const { data: partido, error, recargar } = useApi(() => getPartido(id), [id]);

  if (!partido) {
    return (
      <Screen overline="Partido en vivo" title="En vivo">
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }
  return <PanelEnVivo partido={partido} error={error} recargar={recargar} />;
}

const tipos: { tipo: TipoEvento; label: string }[] = [
  { tipo: 'GOL', label: 'Gol' },
  { tipo: 'AMARILLA', label: 'Amarilla' },
  { tipo: 'ROJA', label: 'Roja' },
];

function PanelEnVivo({
  partido,
  error,
  recargar,
}: {
  partido: PartidoDetalle;
  error: string | null;
  recargar: () => void;
}) {
  const { local, visitante } = partido;
  const planteles = useApi(
    () => Promise.all([getJugadores(local.id), getJugadores(visitante.id)]),
    [local.id, visitante.id],
  );
  // Los suspendidos de esta fecha aparecen deshabilitados (RN-03), para no tener que esperar el error del backend.
  const suspendidos = useApi(
    () => getSuspendidos(partido.torneoId, partido.numeroFecha),
    [partido.torneoId, partido.numeroFecha],
  );

  const [tipo, setTipo] = useState<TipoEvento | null>(null);
  const [equipoId, setEquipoId] = useState(local.id);
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [minuto, setMinuto] = useState(String(minutoEstimado(partido.fechaHoraInicio)));
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const enJuego = partido.estado === 'EN_JUEGO';
  const minutoNumero = Number(minuto);
  const minutoValido = Number.isInteger(minutoNumero) && minutoNumero >= 1 && minutoNumero <= 120;
  const plantel = planteles.data?.[equipoId === local.id ? 0 : 1] ?? [];
  const idsSuspendidos = new Set((suspendidos.data ?? []).map((s) => s.jugadorId));
  // El último cargado es el de id más alto, aunque la lista esté ordenada por minuto.
  const ultimo = partido.eventos.reduce<Evento | null>((a, e) => (a && a.id > e.id ? a : e), null);

  async function registrar() {
    if (!tipo || !jugador || !minutoValido) return;
    setEnviando(true);
    setErrorEnvio(null);
    try {
      await registrarEvento(partido.id, { jugadorId: jugador.id, tipo, minuto: minutoNumero });
      setTipo(null);
      setJugador(null);
      recargar();
    } catch (e) {
      // Por ejemplo "El jugador está suspendido para esta fecha" (409) o "El partido no está en juego"
      setErrorEnvio(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  }

  async function borrar(evento: Evento) {
    const ok = await confirmar(
      `¿Borrar ${nombreTipo(evento.tipo)} de ${evento.jugador}?`,
      `Minuto ${evento.minuto}. El resultado y la tabla se recalculan solos.`,
      'Borrar',
    );
    if (!ok) return;
    setErrorEnvio(null);
    try {
      await borrarEvento(evento.id);
      recargar();
    } catch (e) {
      setErrorEnvio(mensajeDeError(e));
    }
  }

  return (
    <Screen overline={`Fecha ${partido.numeroFecha} · en vivo`} title="Cargar eventos" onRefresh={recargar}>
      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      <Marcador partido={partido} />

      {!enJuego ? (
        <EmptyState
          title="El partido no está en juego"
          description="Solo se pueden cargar o borrar eventos mientras el partido está EN JUEGO."
        />
      ) : (
        <>
          <Paso numero={1} titulo="¿Qué pasó?" />
          <View style={styles.fila}>
            {tipos.map((t) => (
              <BotonGrande key={t.tipo} seleccionado={tipo === t.tipo} onPress={() => setTipo(t.tipo)}>
                <IconoEvento tipo={t.tipo} size={24} color={tipo === t.tipo ? colors.textInverse : colors.text} />
                <Etiqueta texto={t.label} seleccionado={tipo === t.tipo} />
              </BotonGrande>
            ))}
          </View>

          <Paso numero={2} titulo="¿Quién?" />
          <View style={styles.fila}>
            {[local, visitante].map((e) => (
              <BotonGrande
                key={e.id}
                seleccionado={equipoId === e.id}
                onPress={() => {
                  setEquipoId(e.id);
                  setJugador(null);
                }}>
                <Etiqueta texto={e.nombre} seleccionado={equipoId === e.id} />
              </BotonGrande>
            ))}
          </View>

          {planteles.error ? <ErrorMessage message={planteles.error} onRetry={planteles.recargar} /> : null}
          {planteles.cargando && !planteles.data ? <Loading /> : null}
          {planteles.data && plantel.length === 0 ? <EmptyState title="El equipo no tiene jugadores activos" /> : null}
          <View style={styles.grilla}>
            {plantel.map((j) => {
              const suspendido = idsSuspendidos.has(j.id);
              return (
                <BotonGrande
                  key={j.id}
                  seleccionado={jugador?.id === j.id}
                  deshabilitado={suspendido}
                  ancho="mitad"
                  onPress={() => setJugador(j)}>
                  <Etiqueta
                    texto={`${j.numeroCamiseta ? `#${j.numeroCamiseta} ` : ''}${j.apellido}`}
                    seleccionado={jugador?.id === j.id}
                  />
                  {suspendido ? (
                    <AppText variant="caption" color={colors.error}>
                      Suspendido
                    </AppText>
                  ) : null}
                </BotonGrande>
              );
            })}
          </View>

          <Paso numero={3} titulo="¿En qué minuto?" />
          <View style={[styles.fila, styles.filaMinuto]}>
            <Button
              title="−"
              variant="secondary"
              size="large"
              disabled={!minutoValido || minutoNumero <= 1}
              onPress={() => setMinuto(String(minutoNumero - 1))}
            />
            <TextInput
              accessibilityLabel="Minuto"
              value={minuto}
              onChangeText={(t) => setMinuto(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={3}
              style={[styles.minuto, !minutoValido && styles.minutoInvalido]}
            />
            <Button
              title="+"
              variant="secondary"
              size="large"
              disabled={!minutoValido || minutoNumero >= 120}
              onPress={() => setMinuto(String(minutoNumero + 1))}
            />
          </View>

          {!minutoValido ? (
            <AppText variant="caption" color={colors.error} style={styles.ayuda}>
              El minuto tiene que estar entre 1 y 120.
            </AppText>
          ) : null}

          {errorEnvio ? <ErrorMessage message={errorEnvio} /> : null}
          <Button
            title={
              tipo && jugador
                ? `Registrar ${nombreTipo(tipo)} · ${jugador.apellido} ${minuto}'`
                : 'Elegí qué pasó y quién'
            }
            size="large"
            disabled={!tipo || !jugador || !minutoValido}
            loading={enviando}
            onPress={registrar}
          />

          {ultimo ? (
            <Button
              title="Deshacer último evento"
              variant="secondary"
              onPress={() => borrar(ultimo)}
              style={styles.deshacer}
            />
          ) : null}
        </>
      )}

      <View style={styles.seccion}>
        <AppText variant="subhead">Eventos</AppText>
        {partido.eventos.length === 0 ? <EmptyState title="Todavía no hay eventos" /> : null}
        {partido.eventos.map((e) => (
          <View key={e.id} style={styles.evento}>
            <AppText variant="mono" style={styles.minutoEvento}>
              {e.minuto}&apos;
            </AppText>
            <IconoEvento tipo={e.tipo} />
            <View style={styles.flex}>
              <AppText variant="bodySmall" numberOfLines={1}>
                {e.jugador}
                {e.numeroCamiseta ? ` #${e.numeroCamiseta}` : ''}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {e.equipoId === local.id ? local.nombre : visitante.nombre}
              </AppText>
            </View>
            {enJuego ? <Button title="Borrar" variant="ghost" size="small" onPress={() => borrar(e)} /> : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}

function nombreTipo(tipo: TipoEvento) {
  return { GOL: 'gol', AMARILLA: 'amarilla', ROJA: 'roja' }[tipo];
}

function Marcador({ partido }: { partido: PartidoDetalle }) {
  const estado = estadoPartido[partido.estado];
  return (
    <Card style={styles.marcador}>
      <StatusChip label={estado.label} status={estado.status} />
      <View style={styles.filaMarcador}>
        <AppText variant="body" style={styles.flex}>
          {partido.local.nombre}
        </AppText>
        <AppText variant="headline">{partido.golesLocal}</AppText>
      </View>
      <View style={styles.filaMarcador}>
        <AppText variant="body" style={styles.flex}>
          {partido.visitante.nombre}
        </AppText>
        <AppText variant="headline">{partido.golesVisitante}</AppText>
      </View>
    </Card>
  );
}

function Paso({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <AppText variant="label" color={colors.textSecondary} style={styles.paso}>
      {numero}. {titulo}
    </AppText>
  );
}

function Etiqueta({ texto, seleccionado }: { texto: string; seleccionado: boolean }) {
  return (
    <AppText
      variant="label"
      color={seleccionado ? colors.textInverse : colors.text}
      numberOfLines={2}
      style={styles.etiqueta}>
      {texto}
    </AppText>
  );
}

/** Botón alto y fácil de tocar con el celular en la mano, al costado de la cancha. */
function BotonGrande({
  seleccionado,
  deshabilitado,
  ancho = 'flex',
  onPress,
  children,
}: {
  seleccionado: boolean;
  deshabilitado?: boolean;
  ancho?: 'flex' | 'mitad';
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: seleccionado, disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botonGrande,
        ancho === 'mitad' ? styles.mitad : styles.flex,
        (seleccionado || pressed) && styles.botonSeleccionado,
        deshabilitado && styles.botonDeshabilitado,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marcador: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  filaMarcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paso: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  filaMinuto: {
    alignItems: 'stretch',
    marginBottom: spacing.lg,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  mitad: {
    width: '48%',
  },
  botonGrande: {
    minHeight: 64,
    backgroundColor: colors.surface,
    borderWidth: borders.thin,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  botonSeleccionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  botonDeshabilitado: {
    opacity: 0.35,
  },
  etiqueta: {
    textAlign: 'center',
  },
  minuto: {
    flex: 1,
    // Sin esto, en web el campo no se achica y empuja el botón + fuera de la pantalla
    minWidth: 0,
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: borders.thin,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.text,
  },
  minutoInvalido: {
    borderColor: colors.error,
  },
  ayuda: {
    marginTop: spacing.xs,
  },
  deshacer: {
    marginTop: spacing.sm,
  },
  seccion: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  evento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.borderSubtle,
  },
  minutoEvento: {
    width: 36,
  },
});
