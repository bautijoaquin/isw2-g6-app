import { useState } from 'react';

import { mensajeDeError } from '@/api/client';
import type { Rol } from '@/api/types';
import { crearUsuario } from '@/api/usuarios';
import { RequiereRol } from '@/auth/SoloRol';
import { Button, ErrorMessage, RolSelector, Screen, TextField } from '@/components';
import { volver } from '@/utils/navegacion';

type Errores = Partial<Record<'username' | 'password' | 'nombreCompleto', string>>;

// RF-02: alta de usuario (administrador o delegado).
export default function NuevoUsuarioScreen() {
  return (
    <RequiereRol roles={['ADMIN']} titulo="Nuevo usuario">
      <FormularioAlta />
    </RequiereRol>
  );
}

function FormularioAlta() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [rol, setRol] = useState<Rol>('DELEGADO');
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Mismas reglas que valida el backend (UsuarioCrearRequest).
  function validar(): Errores {
    const e: Errores = {};
    if (!username.trim()) e.username = 'Ingresá un nombre de usuario';
    else if (username.trim().length > 40) e.username = 'Máximo 40 caracteres';
    else if (/\s/.test(username.trim())) e.username = 'Sin espacios';
    if (password.length < 8) e.password = 'Debe tener al menos 8 caracteres';
    if (!nombreCompleto.trim()) e.nombreCompleto = 'Ingresá el nombre y apellido';
    else if (nombreCompleto.trim().length > 100) e.nombreCompleto = 'Máximo 100 caracteres';
    return e;
  }

  async function guardar() {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setGuardando(true);
    setError(null);
    try {
      await crearUsuario({ username: username.trim(), password, nombreCompleto: nombreCompleto.trim(), rol });
      volver('/usuarios');
    } catch (err) {
      // Por ejemplo 409: "Ya existe un usuario con el nombre ..."
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Screen overline="Usuarios" title="Nuevo usuario">
      {error ? <ErrorMessage message={error} /> : null}

      <TextField
        label="Nombre y apellido"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
        error={errores.nombreCompleto}
        placeholder="Juan Pérez"
        maxLength={100}
      />
      <TextField
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        error={errores.username}
        helper="Con este nombre ingresa a la app. No se puede cambiar después."
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="jperez"
        maxLength={40}
      />
      <TextField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        error={errores.password}
        helper="Mínimo 8 caracteres."
        secureTextEntry
        autoComplete="new-password"
      />
      <RolSelector value={rol} onChange={setRol} />

      <Button title="Crear usuario" size="large" onPress={guardar} loading={guardando} />
    </Screen>
  );
}
