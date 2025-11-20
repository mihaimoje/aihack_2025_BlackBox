import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { backgroundColor: '#05220b' }, // very dark green
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Quests',
          tabBarIcon: () => (
  <Image
    source={require('../../assets/images/scroll.png')}
    style={{ width: 28, height: 28 }}
    resizeMode="contain"
  />
),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Chart',
          tabBarIcon: () => (
  <Image
    source={require('../../assets/images/chart.png')}
    style={{ width: 28, height: 28 }}
    resizeMode="contain"
  />
),
        }}
      />
    </Tabs>
  );
}
