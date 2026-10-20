import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';

import type { IconName } from '@/lib/categories';
import { fonts, palettes, radius, usePalette } from '@/lib/theme';

function icon(outline: IconName, filled: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? filled : outline} size={24} color={color} />;
  };
}

// Host is a tab, but it's the one that makes the feed exist, so its icon is key paint and a size up.
function HostIcon({ focused }: { focused: boolean }) {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: radius.sm,
        backgroundColor: palettes.light.accent,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: focused ? 1.06 : 1 }],
      }}>
      <Ionicons name="add" size={25} color={palettes.light.onAccent} />
    </View>
  );
}

export default function TabsLayout() {
  const c = usePalette();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.navy,
        tabBarInactiveTintColor: c.inkSoft,
        tabBarLabelStyle: { fontFamily: fonts.extrabold, fontSize: 11 },
        tabBarStyle: { backgroundColor: c.tabBar, borderTopColor: c.line },
        headerStyle: { backgroundColor: c.ground },
        headerShadowVisible: false,
        headerTitleStyle: { color: c.ink, fontFamily: fonts.black, fontSize: 18 },
        sceneStyle: { backgroundColor: c.ground },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Games',
          headerShown: false,
          tabBarIcon: icon('basketball-outline', 'basketball'),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Host',
          headerTitle: 'Host a game',
          tabBarIcon: HostIcon,
          tabBarActiveTintColor: c.accentInk,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: icon('person-circle-outline', 'person-circle') }}
      />
    </Tabs>
  );
}
