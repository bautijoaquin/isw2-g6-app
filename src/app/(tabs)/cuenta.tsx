import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { AppText, Button, Card, Loading, Screen, StatusChip } from '@/components';
import { colors, spacing } from '@/theme';

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
});
