import { api } from './client';
import type { Arbitro, Cancha, Equipo, Torneo } from './types';

// RF-05: catálogos públicos

export const getTorneos = () => api<Torneo[]>('/api/torneos');

export const getCanchas = () => api<Cancha[]>('/api/canchas');

export const getArbitros = () => api<Arbitro[]>('/api/arbitros');

/** Solo los activos (los desactivados no se pueden programar, RN-07). */
export const getEquipos = (torneoId: number) => api<Equipo[]>(`/api/equipos?torneoId=${torneoId}`);
