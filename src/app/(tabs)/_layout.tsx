import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router/js-tabs';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components';
import { borders, colors, fonts, gradients, radius, spacing } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Pestaña de la barra flotante: la activa es una píldora con el degradado y su nombre; las demás, solo el ícono. */
function TabIcon({ name, label, focused }: { name: IconName; label: string; focused: boolean }) {
  if (!focused) {
    return (
      <View style={styles.circulo}>
        <MaterialCommunityIcons name={name} size={22} color={colors.textSecondary} />
      </View>
    );
  }
  return (
    <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.activa}>
      <MaterialCommunityIcons name={name} size={20} color={colors.textInverse} />
      <AppText style={styles.activaTexto}>{label}</AppText>
    </LinearGradient>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: Math.max(insets.bottom, spacing.md) }],
        tabBarItemStyle: styles.item,
        tabBarIconStyle: styles.icono,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Partidos',
          tabBarIcon: (p) => <TabIcon name="soccer" label="Partidos" {...p} />,
        }}
      />
      <Tabs.Screen
        name="tabla"
        options={{
          title: 'Tabla',
          tabBarIcon: (p) => <TabIcon name="trophy-outline" label="Tabla" {...p} />,
        }}
      />
      <Tabs.Screen
        name="equipos"
        options={{
          title: 'Equipos',
          tabBarIcon: (p) => <TabIcon name="shield-outline" label="Equipos" {...p} />,
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Cuenta',
          tabBarIcon: (p) => <TabIcon name="account-outline" label="Cuenta" {...p} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    height: 68,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(22,29,24,0.96)',
    borderTopWidth: borders.thin,
    borderWidth: borders.thin,
    borderColor: colors.borderMedium,
    borderTopColor: colors.borderMedium,
    borderRadius: radius.pill,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  item: {
    height: 66,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  icono: {
    flex: 1,
    width: '100%',
    overflow: 'visible',
  },
  circulo: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: borders.thin,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  activaTexto: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textInverse,
  },
});
