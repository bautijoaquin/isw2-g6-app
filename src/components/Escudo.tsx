import { StyleSheet, View } from 'react-native';

import { borders, colors, fonts, radius } from '@/theme';

import { AppText } from './AppText';

/** Iniciales del equipo: "Boca" → "BO", "Unión de Santa Fe" → "US". */
function iniciales(nombre: string) {
  const palabras = nombre.trim().split(/\s+/).filter((p) => p.length > 2 || p === p.toUpperCase());
  if (palabras.length >= 2) return (palabras[0][0] + palabras[1][0]).toUpperCase();
  return nombre.trim().slice(0, 2).toUpperCase();
}

/** Escudo del equipo: la base no guarda escudos, así que es un círculo con sus iniciales. */
export function Escudo({ nombre, size = 52 }: { nombre: string; size?: number }) {
  return (
    <View style={[styles.circulo, { width: size, height: size }]}>
      <AppText style={[styles.texto, { fontSize: size * 0.34 }]}>{iniciales(nombre)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: borders.accent,
    borderColor: 'rgba(127,229,128,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: fonts.bodyBold,
    color: colors.text,
  },
});
