import { EmptyState, Screen } from '@/components';

// Login y opciones según el rol (RF-01): a cargo de Matías.
export default function CuentaScreen() {
  return (
    <Screen overline="Acceso" title="Cuenta">
      <EmptyState title="Próximamente" description="Ingreso para administradores y delegados (RF-01)." />
    </Screen>
  );
}
