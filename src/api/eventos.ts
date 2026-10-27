import { api } from './client';
import type { Evento, EventoNuevo, Jugador } from './types';

// RF-08 y RF-09: cargar y borrar eventos. Piden sesión de delegado o administrador.

/** Plantel activo de un equipo (es público). */
export const getJugadores = (equipoId: number) => api<Jugador[]>(`/api/equipos/${equipoId}/jugadores`);

/** El backend controla RN-03 y RN-04: si el jugador está suspendido o no juega el partido, responde con el motivo. */
export const registrarEvento = (partidoId: number, evento: EventoNuevo) =>
  api<Evento>(`/api/partidos/${partidoId}/eventos`, 'POST', evento);

/** Solo mientras el partido está EN_JUEGO. */
export const borrarEvento = (eventoId: number) => api(`/api/eventos/${eventoId}`, 'DELETE');
