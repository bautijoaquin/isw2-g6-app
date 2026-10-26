import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/js-tabs';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { borders, colors, fonts } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Ícono de la pestaña con la línea roja arriba cuando está activa (ver DESIGN.md, "Red Underline"). */
function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
      <MaterialCommunityIcons name={name} size={24} color={focused ? colors.text : colors.textTertiary} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Partidos',
          tabBarIcon: (p) => <TabIcon name="soccer" {...p} />,
        }}
      />
      <Tabs.Screen
        name="tabla"
        options={{
          title: 'Tabla',
          tabBarIcon: (p) => <TabIcon name="trophy-outline" {...p} />,
        }}
      />
      <Tabs.Screen
        name="equipos"
        options={{
          title: 'Equipos',
          tabBarIcon: (p) => <TabIcon name="shield-outline" {...p} />,
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Cuenta',
          tabBarIcon: (p) => <TabIcon name="account-outline" {...p} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: borders.regular,
    borderTopColor: colors.borderStrong,
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  iconWrap: {
    alignItems: 'center',
  },
  indicator: {
    width: 28,
    height: borders.accent,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.accent,
  },
});
