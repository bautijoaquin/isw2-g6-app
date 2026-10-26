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

// Partido en vivo y cálculos (RF-10, RF-11, RF-12)

/** Referencia corta a otra entidad (equipo, cancha, árbitro). */
export type Resumen = {
  id: number;
  nombre: string;
};

export type EstadoPartido = 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'SUSPENDIDO';

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

/** El resultado no viene guardado: el backend lo calcula con los goles (RN-06). */
export type PartidoDetalle = {
  id: number;
  torneoId: number;
  numeroFecha: number;
  local: Resumen;
  visitante: Resumen;
  golesLocal: number;
  golesVisitante: number;
  cancha: Resumen;
  arbitro: Resumen;
  /** Fecha y hora local sin zona, por ejemplo "2026-10-26T15:00:00". */
  fechaHoraInicio: string;
  estado: EstadoPartido;
  /** Ordenados por minuto. */
  eventos: Evento[];
};

/** Un partido en el listado de una fecha: igual que el detalle pero sin árbitro ni eventos. */
export type PartidoResumen = {
  id: number;
  numeroFecha: number;
  local: Resumen;
  visitante: Resumen;
  golesLocal: number;
  golesVisitante: number;
  cancha: Resumen;
  fechaHoraInicio: string;
  estado: EstadoPartido;
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

// Partido en vivo (RF-08, RF-09)

export type Jugador = {
  id: number;
  equipoId: number;
  equipo: string;
  nombre: string;
  apellido: string;
  dni: string;
  numeroCamiseta: number | null;
  activo: boolean;
};

export type EventoNuevo = {
  jugadorId: number;
  tipo: TipoEvento;
  /** De 1 a 120. */
  minuto: number;
};
