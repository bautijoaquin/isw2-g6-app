import { api } from './client';
import type { Rol, Usuario, UsuarioNuevo } from './types';

// RF-02: administrar usuarios (solo ADMIN)

export const getUsuarios = () => api<Usuario[]>('/api/usuarios');

export const getUsuario = (id: number) => api<Usuario>(`/api/usuarios/${id}`);

export const crearUsuario = (datos: UsuarioNuevo) => api<Usuario>('/api/usuarios', 'POST', datos);

/** El username no se puede cambiar. */
export const modificarUsuario = (id: number, datos: { nombreCompleto: string; rol: Rol }) =>
  api<Usuario>(`/api/usuarios/${id}`, 'PUT', datos);

export const cambiarPassword = (id: number, password: string) =>
  api(`/api/usuarios/${id}/password`, 'PUT', { password });

/** Baja o alta lógica (RN-08: el admin no puede desactivarse a sí mismo). */
export const cambiarActivo = (id: number, activo: boolean) =>
  api<Usuario>(`/api/usuarios/${id}/activo`, 'PATCH', { activo });
