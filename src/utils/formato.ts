const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

const dos = (n: number) => String(n).padStart(2, '0');

/**
 * El backend manda la fecha sin zona horaria ("2026-11-07T15:00:00"), en hora de Santa Fe.
 * Se arma a mano para que el celular no la corra según su propia zona.
 */
function partes(iso: string) {
  const [fecha, hora = '00:00'] = iso.split('T');
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [hh, mm] = hora.split(':').map(Number);
  return { anio, mes, dia, hh, mm, diaSemana: new Date(anio, mes - 1, dia).getDay() };
}

/** "sáb 07/11" */
export function diaCorto(iso: string) {
  const p = partes(iso);
  return `${DIAS[p.diaSemana]} ${dos(p.dia)}/${dos(p.mes)}`;
}

/** "15:00" */
export function hora(iso: string) {
  const p = partes(iso);
  return `${dos(p.hh)}:${dos(p.mm)}`;
}
