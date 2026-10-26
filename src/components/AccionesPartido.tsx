import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import { finalizarPartido, iniciarPartido, suspenderPartido } from '@/api/partidos';
import type { Partido } from '@/api/types';
import { spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';

import { Button } from './Button';
import { ErrorMessage } from './Feedback';

type Accion = {
  titulo: string;
  pregunta: string;
  detalle: string;
  variante: 'primary' | 'destructive';
  llamar: (id: number) => Promise<Partido>;
};

const iniciar: Accion = {
  titulo: 'Iniciar partido',
  pregunta: '¿Iniciar el partido?',
  detalle: 'Se habilita la carga de goles y tarjetas.',
  variante: 'primary',
  llamar: iniciarPartido,
};
const finalizar: Accion = {
  titulo: 'Finalizar partido',
  pregunta: '¿Finalizar el partido?',
  detalle: 'El resultado pasa a la tabla y ya no se pueden cargar eventos.',
  variante: 'primary',
  llamar: finalizarPartido,
};
const suspender: Accion = {
  titulo: 'Suspender',
  pregunta: '¿Suspender el partido?',
  detalle: 'No va a sumar en la tabla y no se puede deshacer.',
  variante: 'destructive',
  llamar: suspenderPartido,
};

/** RN-05: qué se puede hacer en cada estado. FINALIZADO y SUSPENDIDO no tienen acciones. */
const acciones: Record<Partido['estado'], Accion[]> = {
  PROGRAMADO: [iniciar, suspender],
  EN_JUEGO: [finalizar, suspender],
  FINALIZADO: [],
  SUSPENDIDO: [],
};

/** Botones para cambiar el estado del partido (RF-07). Mostrarlos solo a delegados y admins. */
export function AccionesPartido({ partido, onCambio }: { partido: Partido; onCambio: () => void }) {
  const [enCurso, setEnCurso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ejecutar(a: Accion) {
    if (!(await confirmar(a.pregunta, a.detalle, a.titulo))) return;
    setEnCurso(a.titulo);
    setError(null);
    try {
      await a.llamar(partido.id);
      onCambio();
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnCurso(null);
    }
  }

  if (acciones[partido.estado].length === 0) return null;

  return (
    <View style={styles.contenedor}>
      {error ? <ErrorMessage message={error} /> : null}
      {acciones[partido.estado].map((a) => (
        <Button
          key={a.titulo}
          title={a.titulo}
          variant={a.variante}
          onPress={() => ejecutar(a)}
          loading={enCurso === a.titulo}
          disabled={enCurso !== null}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
