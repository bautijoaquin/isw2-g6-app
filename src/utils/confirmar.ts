import { Alert, Platform } from 'react-native';

/**
 * Pide confirmación antes de una acción importante (desactivar, borrar...).
 *   if (await confirmar('¿Desactivar a Juan?', 'No va a poder ingresar.')) { ... }
 */
export function confirmar(titulo: string, mensaje = '', textoAceptar = 'Aceptar'): Promise<boolean> {
  // Alert no funciona en el navegador
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(mensaje ? `${titulo}\n\n${mensaje}` : titulo));

  return new Promise((resolve) => {
    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: textoAceptar, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
