import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { getArbitros, getCanchas, getEquipos, getTorneos } from '@/api/catalogo';
import { mensajeDeError } from '@/api/client';
import { getPartido, modificarPartido, programarPartido } from '@/api/partidos';
import type { Arbitro, Cancha, Equipo, PartidoDetalle } from '@/api/types';
import { RequiereRol } from '@/auth/SoloRol';
import { Button, ErrorMessage, Loading, Screen, Selector, TextField } from '@/components';
import { useApi } from '@/hooks/useApi';
import { aFechaHoraIso, diaCompleto, hora } from '@/utils/formato';
import { volver } from '@/utils/navegacion';

// RF-06: programar un partido nuevo o, si viene un id, modificar uno PROGRAMADO (RN-07). Solo admin.
export default function ProgramarPartidoScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <RequiereRol roles={['ADMIN']} titulo={id ? 'Modificar partido' : 'Programar partido'}>
      <CargarDatos id={id ? Number(id) : null} />
    </RequiereRol>
  );
}

type Datos = {
  torneoId: number;
  equipos: Equipo[];
  canchas: Cancha[];
  arbitros: Arbitro[];
  partido: PartidoDetalle | null;
};

async function cargar(id: number | null): Promise<Datos> {
  const [torneos, canchas, arbitros, partido] = await Promise.all([
    getTorneos(),
    getCanchas(),
    getArbitros(),
    id ? getPartido(id) : Promise.resolve(null),
  ]);
  const torneoId = partido?.torneoId ?? (torneos.find((t) => t.activo) ?? torneos[0])?.id;
  if (!torneoId) throw new Error('No hay ningún torneo cargado.');
  const equipos = await getEquipos(torneoId);
  return { torneoId, equipos, canchas, arbitros, partido };
}

function CargarDatos({ id }: { id: number | null }) {
  const titulo = id ? 'Modificar partido' : 'Programar partido';
  const { data, error, recargar } = useApi(() => cargar(id), [id]);

  if (!data) {
    return (
      <Screen overline="Partidos" title={titulo}>
        {error ? <ErrorMessage message={error} onRetry={recargar} /> : <Loading />}
      </Screen>
    );
  }
  return <Formulario titulo={titulo} datos={data} />;
}

type Errores = Partial<Record<'numeroFecha' | 'local' | 'visitante' | 'cancha' | 'arbitro' | 'dia', string>>;

function Formulario({ titulo, datos }: { titulo: string; datos: Datos }) {
  const { partido } = datos;
  const [numeroFecha, setNumeroFecha] = useState(partido ? String(partido.numeroFecha) : '');
  const [localId, setLocalId] = useState<number | null>(partido?.local.id ?? null);
  const [visitanteId, setVisitanteId] = useState<number | null>(partido?.visitante.id ?? null);
  const [canchaId, setCanchaId] = useState<number | null>(partido?.cancha.id ?? null);
  const [arbitroId, setArbitroId] = useState<number | null>(partido?.arbitro.id ?? null);
  const [dia, setDia] = useState(partido ? diaCompleto(partido.fechaHoraInicio) : '');
  const [horaInicio, setHoraInicio] = useState(partido ? hora(partido.fechaHoraInicio) : '');
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const equipos = datos.equipos.map((e) => ({ id: e.id, nombre: e.nombre }));
  const canchas = datos.canchas.map((c) => ({ id: c.id, nombre: c.nombre }));
  const arbitros = datos.arbitros.map((a) => ({ id: a.id, nombre: `${a.nombre} ${a.apellido}` }));

  // Las reglas de horarios (RN-01, RN-02) las controla el backend; acá solo que esté todo completo.
  function validar(): Errores {
    const e: Errores = {};
    const n = Number(numeroFecha);
    if (!Number.isInteger(n) || n < 1) e.numeroFecha = 'Ingresá un número de fecha (1 o más)';
    if (!localId) e.local = 'Elegí el equipo local';
    if (!visitanteId) e.visitante = 'Elegí el equipo visitante';
    else if (visitanteId === localId) e.visitante = 'Tiene que ser distinto del local';
    if (!canchaId) e.cancha = 'Elegí la cancha';
    if (!arbitroId) e.arbitro = 'Elegí el árbitro';
    if (!aFechaHoraIso(dia, horaInicio)) e.dia = 'Revisá el día (dd/mm/aaaa) y la hora (hh:mm)';
    return e;
  }

  async function guardar() {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    const pedido = {
      torneoId: datos.torneoId,
      numeroFecha: Number(numeroFecha),
      equipoLocalId: localId!,
      equipoVisitanteId: visitanteId!,
      canchaId: canchaId!,
      arbitroId: arbitroId!,
      fechaHoraInicio: aFechaHoraIso(dia, horaInicio)!,
    };
    setGuardando(true);
    setError(null);
    try {
      if (partido) await modificarPartido(partido.id, pedido);
      else await programarPartido(pedido);
      volver('/');
    } catch (err) {
      // Por ejemplo 409: "La cancha ya tiene un partido a menos de 2 horas (RN-01)"
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Screen overline="Partidos" title={titulo}>
      <TextField
        label="Número de fecha"
        value={numeroFecha}
        onChangeText={setNumeroFecha}
        error={errores.numeroFecha}
        keyboardType="number-pad"
        placeholder="1"
        maxLength={3}
      />
      <Selector label="Local" opciones={equipos} value={localId} onChange={setLocalId} error={errores.local} />
      <Selector
        label="Visitante"
        opciones={equipos}
        value={visitanteId}
        onChange={setVisitanteId}
        error={errores.visitante}
      />
      <Selector label="Cancha" opciones={canchas} value={canchaId} onChange={setCanchaId} error={errores.cancha} />
      <Selector label="Árbitro" opciones={arbitros} value={arbitroId} onChange={setArbitroId} error={errores.arbitro} />
      <TextField
        label="Día"
        value={dia}
        onChangeText={setDia}
        error={errores.dia}
        placeholder="07/11/2026"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextField
        label="Hora"
        value={horaInicio}
        onChangeText={setHoraInicio}
        helper="La cancha y el árbitro no pueden tener otro partido a menos de 2 horas."
        placeholder="15:00"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />

      {/* Junto al botón: el formulario es largo y arriba no se vería */}
      {error ? <ErrorMessage message={error} /> : null}
      <Button title={partido ? 'Guardar cambios' : 'Programar'} size="large" onPress={guardar} loading={guardando} />
    </Screen>
  );
}
