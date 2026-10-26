import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { SoloRol } from '@/auth/SoloRol';
import { AppText, Button, Card, Loading, Screen, StatusChip } from '@/components';
import { borders, colors, spacing } from '@/theme';

const nombreRol = { ADMIN: 'Administrador', DELEGADO: 'Delegado' } as const;

// RF-01: ingreso, datos de la sesión y cierre de sesión.
export default function CuentaScreen() {
  const { sesion, restaurando, cerrarSesion } = useAuth();

  if (restaurando) {
    return (
      <Screen overline="Acceso" title="Cuenta">
        <Loading />
      </Screen>
    );
  }

  if (!sesion) {
    return (
      <Screen overline="Acceso" title="Cuenta">
        <Card>
          <AppText variant="subhead">¿Sos administrador o delegado?</AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.texto}>
            Ingresá para cargar partidos, resultados y tarjetas. Partidos, tabla y equipos se pueden ver sin
            cuenta.
          </AppText>
          <Button title="Ingresar" onPress={() => router.push('/login')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen overline="Sesión iniciada" title="Cuenta">
      <Card style={styles.perfil}>
        <AppText variant="overline" color={colors.textSecondary}>
          Usuario
        </AppText>
        <AppText variant="subhead">{sesion.nombre}</AppText>
        <StatusChip label={nombreRol[sesion.rol]} status="neutral" />
      </Card>

      {/* Cada uno suma acá el acceso a su módulo, dentro del SoloRol que corresponda. */}
      <SoloRol roles={['ADMIN']}>
        <View style={styles.seccion}>
          <AppText variant="overline" color={colors.textSecondary} style={styles.tituloSeccion}>
            Administración
          </AppText>
        </View>
      </SoloRol>

      <SoloRol roles={['DELEGADO']}>
        <View style={styles.seccion}>
          <AppText variant="overline" color={colors.textSecondary} style={styles.tituloSeccion}>
            Delegado
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Los goles y tarjetas se cargan desde el detalle de cada partido en juego.
          </AppText>
        </View>
      </SoloRol>

      <Button title="Cerrar sesión" variant="secondary" onPress={cerrarSesion} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  texto: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  perfil: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  seccion: {
    marginBottom: spacing.xl,
  },
  tituloSeccion: {
    paddingBottom: spacing.sm,
    borderBottomWidth: borders.regular,
    borderBottomColor: colors.borderStrong,
  },
});
