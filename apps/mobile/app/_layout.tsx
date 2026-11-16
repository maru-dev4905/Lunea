import { Stack } from 'expo-router';

import { DraftProvider } from '@/journal';

export default function RootLayout() {
  return (
    <DraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DraftProvider>
  );
}
