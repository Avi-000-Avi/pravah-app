import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, shadows, typography } from '@/lib/theme';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const TABS: { name: string; label: string; icon: MaterialIconName }[] = [
  { name: 'index', label: 'Today', icon: 'calendar-today' },
  { name: 'meals', label: 'Fuel', icon: 'restaurant' },
  { name: 'workout', label: 'Flow', icon: 'fitness-center' },
  { name: 'chat', label: 'Rest', icon: 'self-improvement' },
  { name: 'profile', label: 'Data', icon: 'analytics' },
  { name: 'grocery', label: 'Grocery', icon: 'shopping-cart' },
];

/**
 * Custom bottom tab bar — "Serene Flow" design.
 * Rounded top corners, lavender-tinted border, warm shadow.
 * Active tab: lavender pill with eggplant icon + italic serif label.
 * Inactive: warm-brown muted icon + label.
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
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={focused ? colors.eggplant : colors.nav.inactive}
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
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) + 8 }, shadows.nav]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS[index];
        const tabBarIcon = descriptors[route.key]?.options.tabBarIcon;
        const icon = tabBarIcon
          ? tabBarIcon({
              focused,
              color: focused ? colors.eggplant : colors.nav.inactive,
              size: 22,
            })
          : null;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
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
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab?.label ?? ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.nav.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,178,220,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radii.pill,
    minHeight: 56,
  },
  tabActive: {
    backgroundColor: colors.nav.active,
  },
  tabLabel: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.xs,
    color: colors.nav.inactive,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tabLabelActive: {
    color: colors.nav.activeText,
  },
});
