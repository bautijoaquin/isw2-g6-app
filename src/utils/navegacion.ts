import { Href, router } from 'expo-router';

/** Vuelve a la pantalla anterior; si no hay (se abrió directo por link), va a `alternativa`. */
export function volver(alternativa: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(alternativa);
}
