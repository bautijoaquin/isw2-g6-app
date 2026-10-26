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

/** "07/11/2026", para precargar un formulario. */
export function diaCompleto(iso: string) {
  const p = partes(iso);
  return `${dos(p.dia)}/${dos(p.mes)}/${p.anio}`;
}

/**
 * Junta "07/11/2026" y "15:00" en "2026-11-07T15:00", el formato que espera el backend.
 * Devuelve null si el día o la hora no son válidos.
 */
export function aFechaHoraIso(dia: string, horaTexto: string): string | null {
  const d = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dia.trim());
  const h = /^(\d{1,2}):(\d{2})$/.exec(horaTexto.trim());
  if (!d || !h) return null;
  const [dd, mm, aaaa] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const [hh, min] = [Number(h[1]), Number(h[2])];
  const fecha = new Date(aaaa, mm - 1, dd);
  // new Date corrige solo los días que no existen (31/02 → 03/03): así se detectan
  if (fecha.getDate() !== dd || fecha.getMonth() !== mm - 1 || hh > 23 || min > 59) return null;
  return `${aaaa}-${dos(mm)}-${dos(dd)}T${dos(hh)}:${dos(min)}`;
}
