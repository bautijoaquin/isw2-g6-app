/**
 * El backend manda las fechas sin zona horaria ("2026-10-26T15:00:00"), en hora de Santa Fe.
 * Se cortan a mano para no depender de la zona horaria del celular.
 */
export function formatearFechaHora(valor: string) {
  const [dia, hora = ''] = valor.split('T');
  const [anio, mes, d] = dia.split('-');
  return `${d}/${mes}/${anio} ${hora.slice(0, 5)}`;
}
