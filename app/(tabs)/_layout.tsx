import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows } from '@/lib/theme';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

const TABS: { name: string; icon: FeatherName }[] = [
  { name: 'index', icon: 'home' },
  { name: 'meals', icon: 'coffee' },
  { name: 'workout', icon: 'activity' },
  { name: 'chat', icon: 'message-circle' },
  { name: 'profile', icon: 'user' },
];

/**
 * Custom floating pill tab bar — matches the design's bottom nav:
 * frosted-white pill, soft shadow, dark rounded "active" capsule
 * around the focused icon. Sits 16px above the safe-area inset.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      tabBar={(props) => <PravahTabBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name={tab.icon}
                size={22}
                color={focused ? colors.white : colors.nav.inactive}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

function PravahTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) }]} pointerEvents="box-none">
      <View style={[styles.pill, shadows.s1]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tabBarIcon = descriptors[route.key]?.options.tabBarIcon;
          const icon = tabBarIcon
            ? tabBarIcon({ focused, color: focused ? colors.white : colors.nav.inactive, size: 22 })
            : null;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={[styles.tab, focused && styles.tabActive]}
            >
              {icon}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  pill: {
    height: 68,
    borderRadius: radii.pill,
    backgroundColor: colors.nav.bg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.nav.active,
  },
});
