import { api } from './client';
import type { Partido } from './types';

// RF-10: fixture público

/** Sin fecha trae todo el torneo, ordenado por fecha y horario. */
export const getPartidos = (torneoId: number, fecha?: number) =>
  api<Partido[]>(`/api/partidos?torneoId=${torneoId}${fecha ? `&fecha=${fecha}` : ''}`);
