import { EmptyState, Screen } from '@/components';

// Equipos y jugadores (RF-03, RF-04, RF-05): a cargo de Miretti.
// Endpoints: GET /api/equipos y GET /api/equipos/{id}/jugadores
export default function EquiposScreen() {
  return (
    <Screen overline="Clubes" title="Equipos">
      <EmptyState title="Próximamente" description="Equipos del torneo y sus planteles (RF-03, RF-04)." />
    </Screen>
  );
}
