/**
 * Tipos de los JSON que devuelve el backend.
 * Tienen que coincidir con los DTO de isw2-g6-backend (ver el contrato en su README).
 */

export type Rol = 'ADMIN' | 'DELEGADO';

export type Torneo = {
  id: number;
  nombre: string;
  anio: number;
  activo: boolean;
};

export type Cancha = {
  id: number;
  nombre: string;
  direccion: string | null;
  activo: boolean;
};

export type Arbitro = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  activo: boolean;
};

export type LoginResponse = {
  token: string;
  nombre: string;
  rol: Rol;
};

export type Usuario = {
  id: number;
  username: string;
  nombreCompleto: string;
  rol: Rol;
  activo: boolean;
  fechaAlta: string;
};

export type UsuarioNuevo = {
  username: string;
  password: string;
  nombreCompleto: string;
  rol: Rol;
};

/** Referencia corta a un equipo, cancha o árbitro dentro de otra respuesta. */
export type Resumen = {
  id: number;
  nombre: string;
};

export type EstadoPartido = 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'SUSPENDIDO';

/** Un partido del fixture (RF-10). El resultado lo calcula el backend con los goles. */
export type Partido = {
  id: number;
  torneoId: number;
  numeroFecha: number;
  local: Resumen;
  visitante: Resumen;
  golesLocal: number;
  golesVisitante: number;
  cancha: Resumen;
  arbitro: Resumen;
  fechaHoraInicio: string;
  estado: EstadoPartido;
};

// Partido en vivo y cálculos (RF-10, RF-11, RF-12)

export type TipoEvento = 'GOL' | 'AMARILLA' | 'ROJA';

export type Evento = {
  id: number;
  tipo: TipoEvento;
  minuto: number;
  jugadorId: number;
  /** Nombre y apellido juntos. */
  jugador: string;
  numeroCamiseta: number | null;
  /** Equipo del jugador: sirve para saber si el evento es del local o del visitante. */
  equipoId: number;
};

/** Detalle de un partido: lo mismo que en el fixture más sus eventos, ordenados por minuto. */
export type PartidoDetalle = Partido & {
  eventos: Evento[];
};

export type FilaTabla = {
  posicion: number;
  equipoId: number;
  equipo: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

export type Suspendido = {
  jugadorId: number;
  nombre: string;
  apellido: string;
  numeroCamiseta: number | null;
  equipoId: number;
  equipo: string;
  motivo: 'ROJA' | 'DOBLE_AMARILLA';
  /** Fecha en la que recibió la tarjeta (la anterior a la consultada). */
  fechaSancion: number;
};
