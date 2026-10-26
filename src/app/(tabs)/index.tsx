import { StyleSheet, View } from 'react-native';

import { getTorneos } from '@/api/catalogo';
import { AppText, Card, EmptyState, ErrorMessage, Loading, Screen, StatusChip } from '@/components';
import { useApi } from '@/hooks/useApi';
import { colors, spacing } from '@/theme';

// Fixture y partidos por fecha (RF-10): a cargo de Scolari.
// Por ahora muestra los torneos para comprobar la conexión con el backend.
export default function PartidosScreen() {
  const { data: torneos, cargando, error, recargar } = useApi(getTorneos);

  return (
    <Screen overline="Liga Amateur Santafesina" title="Partidos" refreshing={cargando} onRefresh={recargar}>
      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !torneos ? <Loading /> : null}

      {torneos?.map((t) => (
        <Card key={t.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="overline" color={colors.textSecondary}>
                Torneo {t.anio}
              </AppText>
              <AppText variant="subhead">{t.nombre}</AppText>
            </View>
            <StatusChip label={t.activo ? 'En curso' : 'Cerrado'} status={t.activo ? 'success' : 'neutral'} />
          </View>
        </Card>
      ))}

      <EmptyState title="Fixture" description="Acá van los partidos de cada fecha (RF-10)." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
    gap: spacing.xs,
  },
});
