import { api } from './client';
import type { Partido, PartidoDetalle } from './types';

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
