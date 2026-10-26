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
