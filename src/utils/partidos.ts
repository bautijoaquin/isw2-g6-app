import type { EstadoPartido } from '@/api/types';

/** Texto y color del StatusChip de cada estado del partido. */
export const estadosPartido: Record<
  EstadoPartido,
  { label: string; status: 'success' | 'warning' | 'error' | 'neutral' }
> = {
  PROGRAMADO: { label: 'Programado', status: 'neutral' },
  EN_JUEGO: { label: 'En juego', status: 'success' },
  FINALIZADO: { label: 'Finalizado', status: 'neutral' },
  SUSPENDIDO: { label: 'Suspendido', status: 'warning' },
};
