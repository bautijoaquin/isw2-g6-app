import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { LoginResponse } from '@/api/types';

const CLAVE = 'liga.sesion';

// En el celular la sesión se guarda cifrada (SecureStore).
// SecureStore no existe en web, así que ahí se usa localStorage (solo para probar).

export async function guardarSesion(sesion: LoginResponse) {
  const valor = JSON.stringify(sesion);
  if (Platform.OS === 'web') localStorage.setItem(CLAVE, valor);
  else await SecureStore.setItemAsync(CLAVE, valor);
}

export async function leerSesion(): Promise<LoginResponse | null> {
  try {
    const valor = Platform.OS === 'web' ? localStorage.getItem(CLAVE) : await SecureStore.getItemAsync(CLAVE);
    return valor ? (JSON.parse(valor) as LoginResponse) : null;
  } catch {
    return null;
  }
}

export async function borrarSesion() {
  if (Platform.OS === 'web') localStorage.removeItem(CLAVE);
  else await SecureStore.deleteItemAsync(CLAVE);
}

/** Datos que el backend pone dentro del JWT (ver JwtService). */
export function leerToken(token: string): { id?: number; exp?: number } | null {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** true si el JWT ya venció (el backend los emite por 8 horas). */
export function tokenVencido(token: string): boolean {
  const payload = leerToken(token);
  if (!payload) return true;
  return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
}
