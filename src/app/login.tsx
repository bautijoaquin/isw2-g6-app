import { router } from 'expo-router';
import { ComponentRef, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mensajeDeError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { AppText, Button, ErrorMessage, TextField } from '@/components';
import { borders, colors, spacing } from '@/theme';

// RF-01: ingreso de administradores y delegados.
export default function LoginScreen() {
  const { iniciarSesion, expirada } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<{ username?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function ingresar() {
    const nuevos = {
      username: username.trim() ? undefined : 'Ingresá tu usuario',
      password: password ? undefined : 'Ingresá tu contraseña',
    };
    setErrores(nuevos);
    if (nuevos.username || nuevos.password) return;

    setEnviando(true);
    setError(null);
    try {
      await iniciarSesion(username, password);
      if (router.canGoBack()) router.back();
      else router.replace('/cuenta');
    } catch (e) {
      setError(mensajeDeError(e));
      setPassword('');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AppText variant="overline" color={colors.textSecondary}>
              Administradores y delegados
            </AppText>
            <AppText variant="display" accessibilityRole="header">
              Ingresar
            </AppText>
          </View>

          {expirada && !error ? (
            <ErrorMessage message="Tu sesión venció. Volvé a ingresar." />
          ) : null}
          {error ? <ErrorMessage message={error} /> : null}

          <TextField
            label="Usuario"
            value={username}
            onChangeText={setUsername}
            error={errores.username}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            placeholder="admin"
          />
          <TextField
            ref={passwordRef}
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            error={errores.password}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={ingresar}
          />

          <Button title="Ingresar" size="large" onPress={ingresar} loading={enviando} style={styles.boton} />
          <AppText variant="caption" color={colors.textSecondary} style={styles.nota}>
            Para ver partidos, tabla y equipos no hace falta ingresar.
          </AppText>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
    borderBottomWidth: borders.heavy,
    borderBottomColor: colors.borderStrong,
  },
  boton: {
    marginTop: spacing.sm,
  },
  nota: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
