import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(true, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Agent',        // Üst başlık
          tabBarLabel: '',   // Alt etiket
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
