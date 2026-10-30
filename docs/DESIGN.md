# Noche de partido

Guía de estilo de la app. Los valores viven en `src/theme/index.ts`; esta guía explica cuándo usar cada uno.

## Overview

App oscura, con fondo negro verdoso, tarjetas redondeadas y un único acento: el degradado lima → verde agua.
Se inspira en las apps de resultados en vivo: el partido es el protagonista (escudos a los costados, marcador grande al centro).

## Colors

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0B110D` | Fondo de todas las pantallas |
| `header` | `#122D22` | Encabezado de las pantallas internas (continúa el brillo verde) |
| `surface` | `#161D18` | Tarjetas, campos, filas de lista |
| `surfaceRaised` | `#222A24` | Chips sin seleccionar, botones secundarios, encabezado de la tabla |
| `gradients.primary` | `#C4F25B` → `#3BD8A6` | Botón principal, chip y pestaña activos |
| `primary` | `#7FE580` | El verde cuando no puede ir degradado (botón elegido, puntos de la tabla, íconos) |
| `accent` | `#E5322D` | **En vivo** y acciones destructivas (suspender, dar de baja) |
| `text` / `textSecondary` | `#FFFFFF` / `#9AA39C` | Texto principal / secundario |
| `textInverse` | `#0B110D` | Texto sobre el verde |
| `warning` | `#F5C518` | Amarilla, suspendido |
| `borderSubtle` | blanco al 8 % | Borde de tarjetas y campos |

## Typography

Una sola familia: **Urbanist** (Google Fonts). Medium para el texto, SemiBold para etiquetas y botones,
ExtraBold para títulos y marcadores. Space Mono solo para los minutos de los eventos.
Usar siempre `<AppText variant="...">`; las variantes están en `type` del tema.

## Spacing

Base de 8: `xs 4 · sm 8 · md 16 · lg 24 · xl 32 · xxl 48`. Margen lateral de pantalla: `md`.

## Border Radius

`radius.sm 10` detalles · `radius.md 16` campos y filas · `radius.lg 24` tarjetas · `radius.pill` botones, chips y pestañas.

## Components

- **Button**: píldora. `primary` con el degradado y texto oscuro; `secondary` gris elevado; `destructive` rojo; `ghost` solo texto.
- **Card**: `surface`, radio 24, borde sutil. `elevated` agrega borde verde para lo destacado.
- **PartidoCard**: escudo (iniciales) a cada lado, hora o marcador al centro; en juego lleva la pestaña roja **En vivo**.
- **Escudo**: círculo con las iniciales del equipo (la base no guarda escudos).
- **FilterChip / StatusChip**: píldoras; el chip elegido lleva el degradado.
- **TextField**: `surface`, radio 16, borde verde al enfocar.
- **ListItem**: fila como tarjeta chica, con el ícono en un círculo.
- **Barra de pestañas**: flotante y redondeada; la pestaña activa es una píldora con el degradado y su nombre.

## Do's and Don'ts

- Sí: usar los componentes de `src/components` y los tokens del tema. Nada de colores sueltos.
- Sí: un solo elemento con degradado por zona de la pantalla, para que se note qué es lo principal.
- No: usar el rojo para algo que no sea "en vivo" o una acción destructiva.
- No: bordes rectos ni bordes blancos fuertes; en fondo oscuro separan los bordes sutiles.
