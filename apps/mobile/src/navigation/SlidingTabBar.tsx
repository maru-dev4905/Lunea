import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { PillIndicator } from '@/motion/PillIndicator';
import { useTheme } from '@/theme';

// Bottom tab bar (D-34): a hairline track with a small dot per tab; the active tab gets a short
// ink bar that slides to it. Labels stay visible so tabs never rely on the motion to be understood.
// Press handling follows the navigator's own bar: emit `tabPress`, then navigate unless prevented.
export function SlidingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const theme = useTheme();
  const [barWidth, setBarWidth] = useState(0);
  const count = state.routes.length;

  return (
    <View
      accessibilityRole="tablist"
      testID="tab-bar"
      onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}
      style={[
        styles.bar,
        { backgroundColor: theme.color.background, paddingBottom: insets.bottom },
      ]}
    >
      <View
        style={[styles.track, { backgroundColor: theme.color.borderSubtle }]}
        pointerEvents="none"
      >
        {state.routes.map((route, i) => (
          <View
            key={route.key}
            style={[
              styles.dot,
              {
                left: ((i + 0.5) * barWidth) / count - DOT / 2,
                backgroundColor: theme.color.textMuted,
              },
            ]}
          />
        ))}
        <PillIndicator index={state.index} count={count} barWidth={barWidth} />
      </View>

      <View style={styles.row}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label = descriptors[route.key]?.options.title ?? route.name;
          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              // iOS does not announce the position by itself; the others do through the role.
              accessibilityLabel={
                Platform.OS === 'ios' ? `${label}, tab, ${i + 1} of ${count}` : label
              }
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
            >
              <Text
                style={[
                  styles.label,
                  { color: focused ? theme.color.textPrimary : theme.color.textMuted },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const DOT = 5;

const styles = StyleSheet.create({
  bar: { paddingTop: 0 },
  track: { height: StyleSheet.hairlineWidth, marginHorizontal: 0 },
  dot: {
    position: 'absolute',
    top: -DOT / 2 + StyleSheet.hairlineWidth / 2,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    opacity: 0.35,
  },
  row: { flexDirection: 'row' },
  tab: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
});
