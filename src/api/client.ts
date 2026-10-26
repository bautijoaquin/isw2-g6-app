import { API_URL } from './config';

/**
 * Error que devuelve cualquier llamada a la API.
 * `mensaje` es el texto del backend ({status, mensaje}) y se puede mostrar tal cual.
 */
export class ApiError extends Error {
  status: number;
  mensaje: string;

  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.status = status;
    this.mensaje = mensaje;
  }
}

// El token y qué hacer ante un 401 los configura AuthProvider (src/auth).
let token: string | null = null;
let alExpirarSesion: (() => void) | null = null;

export function setToken(nuevo: string | null) {
  token = nuevo;
}

export function onSesionExpirada(callback: (() => void) | null) {
  alExpirarSesion = callback;
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Hace un pedido al backend. Agrega el header Authorization si hay sesión
 * y convierte cualquier error en ApiError con el mensaje del backend.
 *
 *   const torneos = await api<Torneo[]>('/api/torneos');
 *   await api('/api/usuarios', 'POST', { username, password, ... });
 */
export async function api<T = void>(ruta: string, metodo: Metodo = 'GET', cuerpo?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(0, `No se pudo conectar con el servidor (${API_URL}). ¿Está levantado el backend?`);
  }

  if (!res.ok) {
    const mensaje = await leerMensaje(res);
    // Token vencido o inválido: se cierra la sesión (no aplica al propio login).
    if (res.status === 401 && token && ruta !== '/api/auth/login') alExpirarSesion?.();
    throw new ApiError(res.status, mensaje);
  }

  if (res.status === 204) return undefined as T;
  const texto = await res.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

async function leerMensaje(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.mensaje) return data.mensaje;
  } catch {
    // sin cuerpo JSON
  }
  switch (res.status) {
    case 401:
      return 'Tenés que iniciar sesión.';
    case 403:
      return 'No tenés permiso para hacer esto.';
    case 404:
      return 'No se encontró lo que buscabas.';
    default:
      return `Error del servidor (${res.status}).`;
  }
}

/** Para mostrar cualquier error atrapado en un catch. */
export function mensajeDeError(e: unknown): string {
  if (e instanceof ApiError) return e.mensaje;
  if (e instanceof Error) return e.message;
  return 'Ocurrió un error inesperado.';
}
