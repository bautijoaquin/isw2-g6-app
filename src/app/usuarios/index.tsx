import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getUsuarios } from '@/api/usuarios';
import { RequiereRol } from '@/auth/SoloRol';
import { Button, EmptyState, ErrorMessage, FilterChip, ListItem, Loading, Screen, StatusChip } from '@/components';
import { useApi } from '@/hooks/useApi';
import { spacing } from '@/theme';

type Filtro = 'todos' | 'activos' | 'inactivos';

const nombreRol = { ADMIN: 'Administrador', DELEGADO: 'Delegado' } as const;

// RF-02: listado de usuarios, activos e inactivos.
export default function UsuariosScreen() {
  return (
    <RequiereRol roles={['ADMIN']} titulo="Usuarios">
      <ListaUsuarios />
    </RequiereRol>
  );
}

function ListaUsuarios() {
  const { data: usuarios, cargando, error, recargar } = useApi(getUsuarios);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Al volver de crear o editar, se recarga la lista.
  useFocusEffect(useCallback(() => recargar(), [recargar]));

  const visibles = (usuarios ?? []).filter(
    (u) => filtro === 'todos' || (filtro === 'activos' ? u.activo : !u.activo),
  );

  return (
    <Screen
      overline="Administración"
      title="Usuarios"
      refreshing={cargando}
      onRefresh={recargar}
      action={<Button title="Nuevo" size="small" onPress={() => router.push('/usuarios/nuevo')} />}>
      <View style={styles.filtros}>
        <FilterChip label="Todos" selected={filtro === 'todos'} onPress={() => setFiltro('todos')} />
        <FilterChip label="Activos" selected={filtro === 'activos'} onPress={() => setFiltro('activos')} />
        <FilterChip label="Inactivos" selected={filtro === 'inactivos'} onPress={() => setFiltro('inactivos')} />
      </View>

      {error ? <ErrorMessage message={error} onRetry={recargar} /> : null}
      {cargando && !usuarios ? <Loading /> : null}

      {usuarios && visibles.length === 0 ? <EmptyState title="No hay usuarios con este filtro" /> : null}

      {visibles.map((u) => (
        <ListItem
          key={u.id}
          icon={u.rol === 'ADMIN' ? 'shield-account-outline' : 'account-outline'}
          title={u.nombreCompleto}
          subtitle={`@${u.username} · ${nombreRol[u.rol]}`}
          right={u.activo ? null : <StatusChip label="Inactivo" status="error" />}
          onPress={() => router.push({ pathname: '/usuarios/[id]', params: { id: String(u.id) } })}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
