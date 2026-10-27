import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { login } from '@/api/auth';
import { onSesionExpirada, setToken } from '@/api/client';
import type { LoginResponse, Rol } from '@/api/types';

import { borrarSesion, guardarSesion, leerSesion, leerToken, tokenVencido } from './almacenamiento';

type Sesion = LoginResponse;

type AuthContextValue = {
  sesion: Sesion | null;
  /** id del usuario logueado (sale del token). Sirve, por ejemplo, para RN-08. */
  usuarioId: number | null;
  /** true mientras se lee la sesión guardada al abrir la app. */
  restaurando: boolean;
  /** true si se cerró sola porque el backend respondió 401 (token vencido). */
  expirada: boolean;
  iniciarSesion: (username: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  tieneRol: (...roles: Rol[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [restaurando, setRestaurando] = useState(true);
  const [expirada, setExpirada] = useState(false);

  const limpiar = useCallback(async () => {
    setToken(null);
    setSesion(null);
    await borrarSesion();
  }, []);

  // Al abrir la app: recuperar la sesión guardada si el token sigue vigente.
  useEffect(() => {
    leerSesion().then(async (guardada) => {
      if (guardada && !tokenVencido(guardada.token)) {
        setToken(guardada.token);
        setSesion(guardada);
      } else if (guardada) {
        await borrarSesion();
      }
      setRestaurando(false);
    });
  }, []);

  // Si cualquier pedido devuelve 401, se cierra la sesión.
  useEffect(() => {
    onSesionExpirada(() => {
      setExpirada(true);
      limpiar();
    });
    return () => onSesionExpirada(null);
  }, [limpiar]);

  const iniciarSesion = useCallback(async (username: string, password: string) => {
    const respuesta = await login(username.trim(), password);
    setToken(respuesta.token);
    setSesion(respuesta);
    setExpirada(false);
    await guardarSesion(respuesta);
  }, []);

  const cerrarSesion = useCallback(async () => {
    setExpirada(false);
    await limpiar();
  }, [limpiar]);

  const usuarioId = useMemo(() => (sesion ? (leerToken(sesion.token)?.id ?? null) : null), [sesion]);

  const tieneRol = useCallback((...roles: Rol[]) => !!sesion && roles.includes(sesion.rol), [sesion]);

  const value = useMemo(
    () => ({ sesion, usuarioId, restaurando, expirada, iniciarSesion, cerrarSesion, tieneRol }),
    [sesion, usuarioId, restaurando, expirada, iniciarSesion, cerrarSesion, tieneRol],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Datos de la sesión actual: `const { sesion, tieneRol, cerrarSesion } = useAuth();` */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth tiene que usarse dentro de <AuthProvider>');
  return ctx;
}
