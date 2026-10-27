import { api } from './client';
import type { Equipo, EquipoNuevo, Jugador, JugadorNuevo } from './types';

// RF-03 y RF-04: equipos y jugadores. Las consultas son públicas; altas, cambios y bajas solo ADMIN.

/** Con `incluirInactivos` también trae los dados de baja (para que el admin los pueda reactivar). */
export const getEquiposDelTorneo = (torneoId: number, incluirInactivos = false) =>
  api<Equipo[]>(`/api/equipos?torneoId=${torneoId}&incluirInactivos=${incluirInactivos}`);

export const getEquipo = (id: number) => api<Equipo>(`/api/equipos/${id}`);

export const getPlantel = (equipoId: number, incluirInactivos = false) =>
  api<Jugador[]>(`/api/equipos/${equipoId}/jugadores?incluirInactivos=${incluirInactivos}`);

export const crearEquipo = (datos: EquipoNuevo) => api<Equipo>('/api/equipos', 'POST', datos);

/** El torneo no se cambia. */
export const modificarEquipo = (id: number, datos: { nombre: string; barrio: string | null }) =>
  api<Equipo>(`/api/equipos/${id}`, 'PUT', datos);

/** Baja o alta lógica (RN-09). */
export const cambiarActivoEquipo = (id: number, activo: boolean) =>
  api<Equipo>(`/api/equipos/${id}/activo`, 'PATCH', { activo });

export const getJugador = (id: number) => api<Jugador>(`/api/jugadores/${id}`);

export const crearJugador = (datos: JugadorNuevo) => api<Jugador>('/api/jugadores', 'POST', datos);

/** El equipo no se cambia durante el torneo (RF-04). */
export const modificarJugador = (id: number, datos: Omit<JugadorNuevo, 'equipoId'>) =>
  api<Jugador>(`/api/jugadores/${id}`, 'PUT', datos);

export const cambiarActivoJugador = (id: number, activo: boolean) =>
  api<Jugador>(`/api/jugadores/${id}/activo`, 'PATCH', { activo });
