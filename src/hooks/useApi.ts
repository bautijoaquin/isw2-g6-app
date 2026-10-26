import { useCallback, useEffect, useState } from 'react';

import { mensajeDeError } from '@/api/client';

type Resultado<T> = { clave: string; data: T | null; error: string | null };

/**
 * Carga datos de la API al abrir la pantalla y maneja cargando / error / recargar.
 *
 *   const { data: torneos, cargando, error, recargar } = useApi(getTorneos);
 *
 * Si la función depende de un parámetro, pasarlo en `deps` para que vuelva a cargar cuando cambie:
 *   const { data } = useApi(() => getTabla(torneoId), [torneoId]);
 */
export function useApi<T>(cargar: () => Promise<T>, deps: unknown[] = []) {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  // Cada combinación de parámetros + recarga es un pedido distinto.
  const clave = `${JSON.stringify(deps)}#${version}`;

  useEffect(() => {
    let vigente = true;
    cargar().then(
      (data) => vigente && setResultado({ clave, data, error: null }),
      (e) => vigente && setResultado((prev) => ({ clave, data: prev?.data ?? null, error: mensajeDeError(e) })),
    );
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: resultado?.data ?? null,
    error: resultado?.error ?? null,
    cargando: resultado?.clave !== clave,
    recargar,
  };
}
