import { api } from './client';
import type { Arbitro, Cancha, Torneo } from './types';

// RF-05: catálogos públicos

export const getTorneos = () => api<Torneo[]>('/api/torneos');

export const getCanchas = () => api<Cancha[]>('/api/canchas');

export const getArbitros = () => api<Arbitro[]>('/api/arbitros');
