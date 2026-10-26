import { api } from './client';
import type { FilaTabla, PartidoDetalle, Suspendido } from './types';

// RF-10, RF-11 y RF-12: consultas públicas, no piden sesión

/** Detalle de un partido con su resultado y sus eventos. */
export const getPartido = (id: number) => api<PartidoDetalle>(`/api/partidos/${id}`);

/** Tabla ya ordenada por el backend (puntos, diferencia de gol, goles a favor y nombre). */
export const getTabla = (torneoId: number) => api<FilaTabla[]>(`/api/torneos/${torneoId}/tabla`);

/** Jugadores que no pueden jugar esa fecha (RN-03). */
export const getSuspendidos = (torneoId: number, fecha: number) =>
  api<Suspendido[]>(`/api/torneos/${torneoId}/fechas/${fecha}/suspendidos`);
