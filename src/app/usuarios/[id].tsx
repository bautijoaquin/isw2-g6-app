import { useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/client';
import type { Rol, Usuario } from '@/api/types';
import { cambiarActivo, cambiarPassword, getUsuario, modificarUsuario } from '@/api/usuarios';
import { useAuth } from '@/auth/AuthContext';
import { RequiereRol } from '@/auth/SoloRol';
import { AppText, Button, Card, ErrorMessage, Loading, RolSelector, Screen, StatusChip, TextField } from '@/components';
import { useApi } from '@/hooks/useApi';
import { borders, colors, spacing } from '@/theme';
import { confirmar } from '@/utils/confirmar';

// RF-02: modificar datos y rol, cambiar contraseña y baja/alta lógica (RN-08).
export default function EditarUsuarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <RequiereRol roles={['ADMIN']} titulo="Usuario">
      <CargarUsuario id={Number(id)} />
    </RequiereRol>
  );
}

function CargarUsuario({ id }: { id: number }) {
  const { data: usuario, error, recargar } = useApi(() => getUsuario(id), [id]);

  if (error && !usuario) {
    return (
      <Screen overline="Usuarios" title="Usuario">
        <ErrorMessage message={error} onRetry={recargar} />
      </Screen>
    );
  }
  if (!usuario) {
    return (
      <Screen overline="Usuarios" title="Usuario">
        <Loading />
      </Screen>
    );
  }
  // key: si cambia el usuario, el formulario arranca de nuevo con sus datos
  return <EditarUsuario key={`${usuario.id}-${usuario.activo}`} usuario={usuario} onCambio={recargar} />;
}

type Mensaje = { tipo: 'ok' | 'error'; texto: string } | null;

function EditarUsuario({ usuario, onCambio }: { usuario: Usuario; onCambio: () => void }) {
  const { usuarioId } = useAuth();
  const esYo = usuario.id === usuarioId;

  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [rol, setRol] = useState<Rol>(usuario.rol);
  const [errorNombre, setErrorNombre] = useState<string>();
  const [guardando, setGuardando] = useState(false);

  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState<string>();
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);

  const huboCambios = nombreCompleto.trim() !== usuario.nombreCompleto || rol !== usuario.rol;

  async function guardarDatos() {
    if (!nombreCompleto.trim()) return setErrorNombre('Ingresá el nombre y apellido');
    setErrorNombre(undefined);
    setGuardando(true);
    setMensaje(null);
    try {
      await modificarUsuario(usuario.id, { nombreCompleto: nombreCompleto.trim(), rol });
      setMensaje({ tipo: 'ok', texto: 'Datos guardados.' });
      onCambio();
    } catch (e) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(e) });
    } finally {
      setGuardando(false);
    }
  }

  async function guardarPassword() {
    if (password.length < 8) return setErrorPassword('Debe tener al menos 8 caracteres');
    setErrorPassword(undefined);
    setCambiandoPassword(true);
    setMensaje(null);
    try {
      await cambiarPassword(usuario.id, password);
      setPassword('');
      setMensaje({ tipo: 'ok', texto: 'Contraseña actualizada.' });
    } catch (e) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(e) });
    } finally {
      setCambiandoPassword(false);
    }
  }

  async function alternarActivo() {
    const activar = !usuario.activo;
    if (!activar) {
      const ok = await confirmar(
        `¿Desactivar a ${usuario.nombreCompleto}?`,
        'No va a poder ingresar a la app. Se puede volver a activar cuando quieras.',
        'Desactivar',
      );
      if (!ok) return;
    }
    setCambiandoEstado(true);
    setMensaje(null);
    try {
      await cambiarActivo(usuario.id, activar);
      onCambio();
    } catch (e) {
      // RN-08: "No puede desactivarse a sí mismo"
      setMensaje({ tipo: 'error', texto: mensajeDeError(e) });
      setCambiandoEstado(false);
    }
  }

  return (
    <Screen overline={`@${usuario.username}`} title={usuario.nombreCompleto}>
      <View style={styles.estado}>
        <StatusChip label={usuario.activo ? 'Activo' : 'Inactivo'} status={usuario.activo ? 'success' : 'error'} />
        {esYo ? <StatusChip label="Sos vos" /> : null}
      </View>

      {mensaje?.tipo === 'error' ? <ErrorMessage message={mensaje.texto} /> : null}
      {mensaje?.tipo === 'ok' ? (
        <View style={styles.ok} accessibilityRole="alert">
          <AppText variant="bodySmall" color={colors.success}>
            {mensaje.texto}
          </AppText>
        </View>
      ) : null}

      <Seccion titulo="Datos">
        <TextField
          label="Nombre y apellido"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          error={errorNombre}
          maxLength={100}
        />
        <TextField label="Usuario" value={usuario.username} editable={false} helper="No se puede cambiar." />
        <RolSelector
          value={rol}
          onChange={setRol}
          disabled={esYo}
          helper={esYo ? 'No podés quitarte a vos mismo el rol de administrador (RN-08).' : undefined}
        />
        <Button title="Guardar cambios" onPress={guardarDatos} loading={guardando} disabled={!huboCambios} />
      </Seccion>

      <Seccion titulo="Contraseña">
        <TextField
          label="Nueva contraseña"
          value={password}
          onChangeText={setPassword}
          error={errorPassword}
          helper="Mínimo 8 caracteres."
          secureTextEntry
          autoComplete="new-password"
        />
        <Button
          title="Cambiar contraseña"
          variant="secondary"
          onPress={guardarPassword}
          loading={cambiandoPassword}
          disabled={!password}
        />
      </Seccion>

      <Seccion titulo="Estado">
        {esYo ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            No podés desactivarte a vos mismo (RN-08).
          </AppText>
        ) : (
          <Card>
            <AppText variant="bodySmall" color={colors.textSecondary} style={styles.textoEstado}>
              {usuario.activo
                ? 'Un usuario inactivo no puede ingresar, pero se conserva su historial.'
                : 'Este usuario no puede ingresar a la app.'}
            </AppText>
            <Button
              title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
              variant={usuario.activo ? 'destructive' : 'primary'}
              onPress={alternarActivo}
              loading={cambiandoEstado}
            />
          </Card>
        )}
      </Seccion>
    </Screen>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.seccion}>
      <AppText variant="overline" color={colors.textSecondary} style={styles.tituloSeccion}>
        {titulo}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  estado: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ok: {
    borderLeftWidth: borders.heavy,
    borderLeftColor: colors.success,
    backgroundColor: colors.successBg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  seccion: {
    marginBottom: spacing.xl,
  },
  tituloSeccion: {
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: borders.regular,
    borderBottomColor: colors.borderStrong,
  },
  textoEstado: {
    marginBottom: spacing.md,
  },
});
