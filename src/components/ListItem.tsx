import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { borders, colors, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Algo a la derecha, por ejemplo un StatusChip. */
  right?: ReactNode;
  onPress?: () => void;
};

/** Fila de lista con separador inferior (ver "Lists" en DESIGN.md). */
export function ListItem({ title, subtitle, icon, right, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      {icon ? <MaterialCommunityIcons name={icon} size={20} color={colors.text} /> : null}
      <View style={styles.texts}>
        <AppText variant="body">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textSecondary}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      {onPress ? <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.borderSubtle,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
