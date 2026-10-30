import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import {
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
} from '@expo-google-fonts/urbanist';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/auth/AuthContext';
import { colors, fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.borderSubtle,
  },
};

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts({
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    SpaceMono_400Regular,
  });

  useEffect(() => {
    if (fuentesListas || errorFuentes) SplashScreen.hideAsync();
  }, [fuentesListas, errorFuentes]);

  if (!fuentesListas && !errorFuentes) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.header },
            headerTintColor: colors.text,
            headerTitleStyle: { fontFamily: fonts.bodyBold, fontSize: 18 },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: '', presentation: 'modal' }} />
          <Stack.Screen name="usuarios/index" options={{ title: '' }} />
          <Stack.Screen name="usuarios/nuevo" options={{ title: '' }} />
          <Stack.Screen name="usuarios/[id]" options={{ title: '' }} />
          <Stack.Screen name="partidos/[id]" options={{ title: '' }} />
          <Stack.Screen name="partidos/programar" options={{ title: '' }} />
          <Stack.Screen name="en-vivo/[id]" options={{ title: '' }} />
          <Stack.Screen name="equipos/[id]" options={{ title: '' }} />
          <Stack.Screen name="equipos/editar" options={{ title: '' }} />
          <Stack.Screen name="jugadores/editar" options={{ title: '' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
