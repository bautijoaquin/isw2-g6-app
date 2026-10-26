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
