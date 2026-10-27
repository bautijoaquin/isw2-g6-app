/**
 * Minuto de juego aproximado según la hora de inicio programada, entre 1 y 120.
 * El backend manda la hora sin zona ("2026-10-26T15:00:00"), en hora de Santa Fe: se arma a mano.
 * Es solo el valor inicial del campo: el delegado lo corrige si el partido empezó tarde.
 */
export function minutoEstimado(fechaHoraInicio: string, ahora = new Date()) {
  const [dia, hora = '00:00'] = fechaHoraInicio.split('T');
  const [anio, mes, d] = dia.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  const inicio = new Date(anio, mes - 1, d, h, m);
  const minuto = Math.floor((ahora.getTime() - inicio.getTime()) / 60_000) + 1;
  return Math.min(120, Math.max(1, minuto));
}
