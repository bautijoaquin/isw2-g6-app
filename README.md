# isw2-g6-app · Liga Amateur Santafesina

App móvil del proyecto integrador de Ingeniería de Software II × Programación (IES N.º 9233).
React Native con **Expo (SDK 58)** y **Expo Router**. Consume la API REST de
[`isw2-g6-backend`](https://github.com/bautijoaquin/isw2-g6-backend).

**Grupo 6:** Miretti · Scolari · Matías · Negro

## Cómo levantarla

Requisitos: **Node.js 20+** y la app **Expo Go** en el celular.

```bash
git clone https://github.com/bautijoaquin/isw2-g6-app.git
cd isw2-g6-app
npm install
npx expo start
```

- **Celular (Expo Go):** escanear el QR. La PC y el celular tienen que estar en el **mismo wifi**.
- **Navegador:** apretar `w` en la terminal de Expo.
- **Emulador de Android:** apretar `a`.

### Conexión con el backend

Antes, levantar el backend en otra terminal (`gradlew.bat bootRun` en el repo del backend, puerto 8080).

La app busca el backend sola, en la **misma PC que corre `npx expo start`**, puerto 8080
(ver `src/api/config.ts`). Si el backend corre en otra PC, crear un archivo `.env.local` en la raíz:

```
EXPO_PUBLIC_API_URL=http://192.168.0.15:8080
```

(la IP sale con `ipconfig`). Después de crearlo, reiniciar Expo.

Si el celular no conecta: revisar que el firewall de Windows permita Java en redes privadas.

Usuario inicial: `admin` / `Admin2026!`

## Estructura

```
src/
├── app/                 Pantallas. Cada archivo es una ruta (Expo Router)
│   ├── _layout.tsx      Raíz: fuentes, tema, sesión y navegación
│   ├── login.tsx        Ingreso (RF-01)
│   └── (tabs)/          Pestañas: Partidos, Tabla, Equipos, Cuenta
├── api/                 Llamadas al backend
│   ├── client.ts        api(): agrega el token y convierte errores en ApiError
│   ├── config.ts        URL del backend
│   ├── types.ts         Tipos de los JSON (iguales a los DTO del backend)
│   └── catalogo.ts      Un archivo por módulo: torneos, canchas, árbitros...
├── components/          Componentes de UI reutilizables (Button, Card, TextField...)
├── auth/                Sesión (AuthContext) y permisos por rol (SoloRol, RequiereRol)
├── hooks/useApi.ts      Cargar datos con cargando / error / recargar
└── theme/               Colores, fuentes y espaciado (sale de docs/DESIGN.md)
```

## Cómo sumar una pantalla

1. Agregar los tipos del JSON en `src/api/types.ts` y las llamadas en `src/api/<modulo>.ts`:
   ```ts
   export const getTabla = (torneoId: number) => api<FilaTabla[]>(`/api/torneos/${torneoId}/tabla`);
   ```
2. En la pantalla, cargar los datos con `useApi` y mostrar los errores del backend tal cual:
   ```tsx
   const { data, cargando, error, recargar } = useApi(() => getTabla(1), []);
   ...
   {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
   ```
3. Para enviar datos: `await api('/api/equipos', 'POST', { nombre, barrio })` dentro de un `try/catch`,
   y mostrar `mensajeDeError(e)` si falla (por ejemplo los 409 de las reglas de negocio).

### Sesión y permisos por rol

```tsx
import { useAuth } from '@/auth/AuthContext';
import { RequiereRol, SoloRol } from '@/auth/SoloRol';

const { sesion, tieneRol } = useAuth();      // sesion: { token, nombre, rol } o null

<SoloRol roles={['ADMIN']}>                  // solo lo ve el admin
  <Button title="Nuevo equipo" ... />
</SoloRol>

<RequiereRol roles={['ADMIN', 'DELEGADO']} titulo="Cargar eventos">
  ...pantalla protegida...
</RequiereRol>
```

El token se agrega solo en cada pedido. Si el backend responde 401, la sesión se cierra y la app pide ingresar de nuevo.
Ocultar botones es solo para la experiencia de uso: el control real lo hace el backend (RNF-07).

### Estilo (docs/DESIGN.md)

- Usar **siempre** los componentes de `src/components` y los tokens de `src/theme`. No escribir colores sueltos.
- Blanco y negro, bordes de 2px, **sin bordes redondeados ni sombras**.
- El rojo (`colors.accent`) es para **un solo elemento por pantalla**.
- Títulos con `<Screen title="...">` (Archivo Black); el resto, Work Sans vía `<AppText>`.

## Flujo de trabajo con Git

Es el mismo que en el backend:

```
main      ← solo versiones estables (entregas y defensa)
  └── develop   ← integración de todo lo terminado
        └── feature/RF-xx-descripcion   ← una rama por funcionalidad
```

1. Arrancar cada funcionalidad desde `develop`: `git checkout develop && git pull && git checkout -b feature/RF-03-equipos`.
2. Antes del PR: `git pull origin develop`, `npx tsc --noEmit` y `npx eslint .` sin errores.
3. Pull Request **contra `develop`**, revisado por al menos un compañero.
4. Cuando `develop` está estable, PR de `develop` a `main`.

A `main` y `develop` no se hace push directo.
