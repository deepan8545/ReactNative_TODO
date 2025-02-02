import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-item" 
        options={{ 
          title: 'Add Item',
          presentation: 'modal',
          headerShown: false
        }} 
      />
    </Stack>
  );
}