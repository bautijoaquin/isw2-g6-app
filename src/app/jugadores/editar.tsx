import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import { cambiarActivoJugador, crearJugador, getJugador, modificarJugador } from '@/api/equipos';
import type { Jugador } from '@/api/types';
import { RequiereRol } from '@/auth/SoloRol';
import { Button, ErrorMessage, Loading, Screen, StatusChip, TextField } from '@/components';
import { useApi } from '@/hooks/useApi';
import { spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';
import { volver } from '@/utils/navegacion';

// RF-04: alta de un jugador en un equipo o, si viene un id, modificarlo y darlo de baja/alta. Solo admin.
export default function EditarJugadorScreen() {
  const { id, equipoId } = useLocalSearchParams<{ id?: string; equipoId?: string }>();
  const titulo = id ? 'Editar jugador' : 'Nuevo jugador';
  return (
    <RequiereRol roles={['ADMIN']} titulo={titulo}>
      {id ? (
        <CargarJugador id={Number(id)} />
      ) : (
        <Formulario titulo={titulo} equipoId={Number(equipoId)} jugador={null} onCambio={() => {}} />
      )}
    </RequiereRol>
  );
}

function CargarJugador({ id }: { id: number }) {
  const { data: jugador, error, recargar } = useApi(() => getJugador(id), [id]);

  if (!jugador) {
    return (
      <Screen overline="Jugadores" title="Editar jugador">
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }
  // key: si cambia el estado, el formulario arranca de nuevo con los datos actualizados
  return (
    <Formulario
      key={`${jugador.id}-${jugador.activo}`}
      titulo="Editar jugador"
      equipoId={jugador.equipoId}
      jugador={jugador}
      onCambio={recargar}
    />
  );
}

type Errores = Partial<Record<'nombre' | 'apellido' | 'dni' | 'numeroCamiseta', string>>;

type Props = { titulo: string; equipoId: number; jugador: Jugador | null; onCambio: () => void };

function Formulario({ titulo, equipoId, jugador, onCambio }: Props) {
  const [nombre, setNombre] = useState(jugador?.nombre ?? '');
  const [apellido, setApellido] = useState(jugador?.apellido ?? '');
  const [dni, setDni] = useState(jugador?.dni ?? '');
  const [camiseta, setCamiseta] = useState(jugador?.numeroCamiseta != null ? String(jugador.numeroCamiseta) : '');
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  // Mismas reglas que valida el backend (JugadorCrearRequest).
  function validar(): Errores {
    const e: Errores = {};
    if (!nombre.trim()) e.nombre = 'Ingresá el nombre';
    else if (nombre.trim().length > 60) e.nombre = 'Máximo 60 caracteres';
    if (!apellido.trim()) e.apellido = 'Ingresá el apellido';
    else if (apellido.trim().length > 60) e.apellido = 'Máximo 60 caracteres';
    if (!/^[0-9]{7,8}$/.test(dni.trim())) e.dni = 'Debe tener 7 u 8 dígitos, sin puntos';
    if (camiseta.trim()) {
      const n = Number(camiseta);
      if (!Number.isInteger(n) || n < 1 || n > 99) e.numeroCamiseta = 'Tiene que ser un número del 1 al 99';
    }
    return e;
  }

  async function guardar() {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    const datos = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
      numeroCamiseta: camiseta.trim() ? Number(camiseta) : null,
    };
    setGuardando(true);
    setError(null);
    try {
      if (jugador) await modificarJugador(jugador.id, datos);
      else await crearJugador({ equipoId, ...datos });
      volver({ pathname: '/equipos/[id]', params: { id: String(equipoId) } });
    } catch (err) {
      // Por ejemplo 409: "Ya existe un jugador con ese DNI" o "La camiseta ya está usada en el equipo"
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function alternarActivo() {
    if (!jugador) return;
    const activar = !jugador.activo;
    if (!activar) {
      const ok = await confirmar(
        `¿Dar de baja a ${jugador.nombre} ${jugador.apellido}?`,
        'No va a poder jugar partidos nuevos. Se conservan sus goles y tarjetas.',
        'Dar de baja',
      );
      if (!ok) return;
    }
    setCambiandoEstado(true);
    setError(null);
    try {
      await cambiarActivoJugador(jugador.id, activar);
      onCambio();
    } catch (err) {
      setError(mensajeDeError(err));
      setCambiandoEstado(false);
    }
  }

  return (
    <Screen overline={jugador?.equipo ?? 'Jugadores'} title={titulo}>
      {jugador && !jugador.activo ? (
        <View style={styles.estado}>
          <StatusChip label="De baja" status="error" />
        </View>
      ) : null}

      <TextField label="Nombre" value={nombre} onChangeText={setNombre} error={errores.nombre} maxLength={60} />
      <TextField label="Apellido" value={apellido} onChangeText={setApellido} error={errores.apellido} maxLength={60} />
      <TextField
        label="DNI"
        value={dni}
        onChangeText={setDni}
        error={errores.dni}
        helper="Sin puntos."
        keyboardType="number-pad"
        placeholder="40123456"
        maxLength={8}
      />
      <TextField
        label="Número de camiseta"
        value={camiseta}
        onChangeText={setCamiseta}
        error={errores.numeroCamiseta}
        helper="Opcional, del 1 al 99."
        keyboardType="number-pad"
        placeholder="10"
        maxLength={2}
      />

      {/* Junto al botón: el formulario es largo y arriba no se vería */}
      {error ? <ErrorMessage message={error} /> : null}
      <Button title={jugador ? 'Guardar cambios' : 'Agregar jugador'} size="large" onPress={guardar} loading={guardando} />

      {jugador ? (
        <View style={styles.baja}>
          <Button
            title={jugador.activo ? 'Dar de baja' : 'Reactivar jugador'}
            variant={jugador.activo ? 'destructive' : 'secondary'}
            onPress={alternarActivo}
            loading={cambiandoEstado}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  estado: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  baja: {
    marginTop: spacing.lg,
  },
});
