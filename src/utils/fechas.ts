/**
 * El backend manda las fechas sin zona horaria ("2026-10-26T15:00:00"), en hora de Santa Fe.
 * Se cortan a mano para no depender de la zona horaria del celular.
 */
export function formatearFechaHora(valor: string) {
  const [dia, hora = ''] = valor.split('T');
  const [anio, mes, d] = dia.split('-');
  return `${d}/${mes}/${anio} ${hora.slice(0, 5)}`;
}

/**
 * Minuto de juego aproximado según la hora de inicio programada, entre 1 y 120.
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
