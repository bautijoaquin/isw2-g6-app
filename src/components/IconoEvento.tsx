import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { TipoEvento } from '@/api/types';
import { colors } from '@/theme';

/**
 * Pelota para el gol; rectángulo amarillo o rojo para las tarjetas.
 * `color` es el de la pelota: oscuro cuando va sobre un botón seleccionado (verde).
 */
export function IconoEvento({
  tipo,
  size = 18,
  color = colors.text,
}: {
  tipo: TipoEvento;
  size?: number;
  color?: string;
}) {
  if (tipo === 'GOL') {
    return <MaterialCommunityIcons name="soccer" size={size} color={color} accessibilityLabel="Gol" />;
  }
  return (
    <View
      accessibilityLabel={tipo === 'ROJA' ? 'Tarjeta roja' : 'Tarjeta amarilla'}
      style={[
        styles.tarjeta,
        { width: size * 0.67, height: size * 0.9, backgroundColor: tipo === 'ROJA' ? colors.error : colors.warning },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    borderRadius: 3,
  },
});
