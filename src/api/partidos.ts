import { api } from './client';
import type { Partido, PartidoDetalle, PartidoNuevo } from './types';

// RF-10: fixture público

/** Sin fecha trae todo el torneo, ordenado por fecha y horario. */
export const getPartidos = (torneoId: number, fecha?: number) =>
  api<Partido[]>(`/api/partidos?torneoId=${torneoId}${fecha ? `&fecha=${fecha}` : ''}`);

/** Con el resultado calculado y los eventos en orden. */
export const getPartido = (id: number) => api<PartidoDetalle>(`/api/partidos/${id}`);

// RF-07 y RN-05: cambios de estado (delegado o admin)

export const iniciarPartido = (id: number) => api<Partido>(`/api/partidos/${id}/iniciar`, 'POST');

export const finalizarPartido = (id: number) => api<Partido>(`/api/partidos/${id}/finalizar`, 'POST');

export const suspenderPartido = (id: number) => api<Partido>(`/api/partidos/${id}/suspender`, 'POST');

// RF-06: programar, modificar y eliminar (solo admin; RN-07: solo partidos PROGRAMADOS)

export const programarPartido = (datos: PartidoNuevo) => api<Partido>('/api/partidos', 'POST', datos);

export const modificarPartido = (id: number, datos: PartidoNuevo) => api<Partido>(`/api/partidos/${id}`, 'PUT', datos);

export const eliminarPartido = (id: number) => api(`/api/partidos/${id}`, 'DELETE');
