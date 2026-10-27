import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import type { Rol } from '@/api/types';
import { AppText, Button, Card, Loading, Screen } from '@/components';
import { colors, spacing } from '@/theme';

import { useAuth } from './AuthContext';

/**
 * Muestra su contenido solo si el usuario tiene alguno de los roles.
 * Es solo para la experiencia de uso: el control real lo hace el backend (401/403).
 *
 *   <SoloRol roles={['ADMIN']}>
 *     <Button title="Nuevo equipo" ... />
 *   </SoloRol>
 */
export function SoloRol({ roles, children }: { roles: Rol[]; children: ReactNode }) {
  const { tieneRol } = useAuth();
  return tieneRol(...roles) ? <>{children}</> : null;
}

/**
 * Protege una pantalla entera. Si no hay sesión pide ingresar; si el rol no alcanza, lo avisa.
 *
 *   export default function UsuariosScreen() {
 *     return <RequiereRol roles={['ADMIN']} titulo="Usuarios">...</RequiereRol>;
 *   }
 */
export function RequiereRol({ roles, titulo, children }: { roles: Rol[]; titulo: string; children: ReactNode }) {
  const { sesion, restaurando, tieneRol } = useAuth();

  if (restaurando) {
    return (
      <Screen title={titulo}>
        <Loading />
      </Screen>
    );
  }

  if (!sesion) {
    return (
      <Screen overline="Acceso restringido" title={titulo}>
        <Card>
          <AppText variant="body" color={colors.textSecondary} style={styles.texto}>
            Tenés que ingresar para ver esta sección.
          </AppText>
          <Button title="Ingresar" onPress={() => router.push('/login')} />
        </Card>
      </Screen>
    );
  }

  if (!tieneRol(...roles)) {
    return (
      <Screen overline="Acceso restringido" title={titulo}>
        <Card>
          <AppText variant="body" color={colors.textSecondary}>
            Tu usuario no tiene permiso para esta sección.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  texto: {
    marginBottom: spacing.lg,
  },
});
