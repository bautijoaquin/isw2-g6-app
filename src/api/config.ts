import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 8080;

/**
 * URL del backend (isw2-g6-backend).
 *
 * 1. Si existe la variable EXPO_PUBLIC_API_URL (archivo .env.local), se usa esa.
 *    Ejemplo: EXPO_PUBLIC_API_URL=http://192.168.0.15:8080
 * 2. Si no, se usa la IP de la PC que está corriendo `npx expo start`: es la misma PC
 *    donde suele correr el backend, así Expo Go en el celular funciona sin tocar nada.
 * 3. En el navegador (modo web), localhost.
 */
function resolverApiUrl(): string {
  const desdeEnv = process.env.EXPO_PUBLIC_API_URL;
  if (desdeEnv) return desdeEnv.replace(/\/$/, '');

  if (Platform.OS === 'web') return `http://localhost:${BACKEND_PORT}`;

  // hostUri tiene la forma "192.168.0.15:8081"
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${BACKEND_PORT}`;

  // Emulador de Android sin Expo dev server: 10.0.2.2 es la PC.
  return Platform.OS === 'android' ? `http://10.0.2.2:${BACKEND_PORT}` : `http://localhost:${BACKEND_PORT}`;
}

export const API_URL = resolverApiUrl();
