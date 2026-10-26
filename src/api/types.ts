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

export type Equipo = {
  id: number;
  torneoId: number;
  nombre: string;
  barrio: string | null;
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

export type TipoEvento = 'GOL' | 'AMARILLA' | 'ROJA';

export type Evento = {
  id: number;
  tipo: TipoEvento;
  minuto: number;
  jugadorId: number;
  jugador: string;
  numeroCamiseta: number | null;
  equipoId: number;
};

/** Detalle de un partido con sus goles y tarjetas en orden de minuto (RF-10). */
export type PartidoDetalle = Partido & {
  eventos: Evento[];
};

/** Lo que se manda al programar o modificar un partido (RF-06). fechaHoraInicio: "2026-11-07T15:00". */
export type PartidoNuevo = {
  torneoId: number;
  numeroFecha: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  canchaId: number;
  arbitroId: number;
  fechaHoraInicio: string;
};
