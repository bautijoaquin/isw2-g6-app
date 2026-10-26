import { api } from './client';
import type { LoginResponse } from './types';

// RF-01: ingreso con usuario y contraseña, devuelve el JWT
export const login = (username: string, password: string) =>
  api<LoginResponse>('/api/auth/login', 'POST', { username, password });
