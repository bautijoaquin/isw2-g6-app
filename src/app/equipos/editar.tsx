import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { mensajeDeError } from '@/api/client';
import { crearEquipo, getEquipo, modificarEquipo } from '@/api/equipos';
import type { Equipo } from '@/api/types';
import { RequiereRol } from '@/auth/SoloRol';
import { Button, ErrorMessage, Loading, Screen, TextField } from '@/components';
import { useApi } from '@/hooks/useApi';
import { volver } from '@/utils/navegacion';

// RF-03: alta de un equipo en el torneo o, si viene un id, modificar nombre y barrio. Solo admin.
export default function EditarEquipoScreen() {
  const { id, torneoId } = useLocalSearchParams<{ id?: string; torneoId?: string }>();
  const titulo = id ? 'Editar equipo' : 'Nuevo equipo';
  return (
    <RequiereRol roles={['ADMIN']} titulo={titulo}>
      {id ? <CargarEquipo id={Number(id)} /> : <Formulario titulo={titulo} torneoId={Number(torneoId)} equipo={null} />}
    </RequiereRol>
  );
}

function CargarEquipo({ id }: { id: number }) {
  const { data: equipo, error, recargar } = useApi(() => getEquipo(id), [id]);

  if (!equipo) {
    return (
      <Screen overline="Equipos" title="Editar equipo">
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }
  return <Formulario titulo="Editar equipo" torneoId={equipo.torneoId} equipo={equipo} />;
}

type Errores = Partial<Record<'nombre' | 'barrio', string>>;

function Formulario({ titulo, torneoId, equipo }: { titulo: string; torneoId: number; equipo: Equipo | null }) {
  const [nombre, setNombre] = useState(equipo?.nombre ?? '');
  const [barrio, setBarrio] = useState(equipo?.barrio ?? '');
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Mismas reglas que valida el backend (EquipoCrearRequest).
  function validar(): Errores {
    const e: Errores = {};
    if (!nombre.trim()) e.nombre = 'Ingresá el nombre del equipo';
    else if (nombre.trim().length > 80) e.nombre = 'Máximo 80 caracteres';
    if (barrio.trim().length > 80) e.barrio = 'Máximo 80 caracteres';
    return e;
  }

  async function guardar() {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    const datos = { nombre: nombre.trim(), barrio: barrio.trim() || null };
    setGuardando(true);
    setError(null);
    try {
      if (equipo) await modificarEquipo(equipo.id, datos);
      else await crearEquipo({ torneoId, ...datos });
      volver('/equipos');
    } catch (err) {
      // Por ejemplo 409: "Ya existe un equipo con ese nombre en el torneo"
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Screen overline="Equipos" title={titulo}>
      {error ? <ErrorMessage message={error} /> : null}

      <TextField
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        error={errores.nombre}
        placeholder="Club Atlético Barranquitas"
        maxLength={80}
      />
      <TextField
        label="Barrio"
        value={barrio}
        onChangeText={setBarrio}
        error={errores.barrio}
        helper="Opcional."
        placeholder="Barranquitas"
        maxLength={80}
      />

      <Button title={equipo ? 'Guardar cambios' : 'Crear equipo'} size="large" onPress={guardar} loading={guardando} />
    </Screen>
  );
}
