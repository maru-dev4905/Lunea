import { Stack } from 'expo-router';

import { DraftProvider, RecordsProvider } from '@/journal';

export default function RootLayout() {
  return (
    <DraftProvider>
      <RecordsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </RecordsProvider>
    </DraftProvider>
  );
}
