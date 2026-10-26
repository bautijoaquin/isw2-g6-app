import { EmptyState, Screen } from '@/components';

// Tabla de posiciones (RF-11) y suspendidos (RF-12): a cargo de Negro.
// Endpoints: GET /api/torneos/{id}/tabla y GET /api/torneos/{id}/fechas/{n}/suspendidos
export default function TablaScreen() {
  return (
    <Screen overline="Posiciones" title="Tabla">
      <EmptyState title="Próximamente" description="Tabla de posiciones del torneo (RF-11)." />
    </Screen>
  );
}
