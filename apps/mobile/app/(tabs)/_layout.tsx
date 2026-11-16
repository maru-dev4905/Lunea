import { Tabs } from 'expo-router';

import { SlidingTabBar } from '@/navigation/SlidingTabBar';

// Today / Collection / Settings follow docs/03 as a proposal, not the final IA.
// The tab bar is the sliding-pill bar of the visual direction (D-34).
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <SlidingTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="collection" options={{ title: 'Collection' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
