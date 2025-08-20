import { EventsProvider } from "@/hooks/use-events";
import { ThemeProvider, useTheme } from "@/hooks/use-theme";
import { TimerProvider } from "@/hooks/use-timer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { theme } = useTheme();
  
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-diaper" 
        options={{ 
          title: "Diaper Change",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="add-bottle" 
        options={{ 
          title: "Bottle Feeding",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="add-measurement" 
        options={{ 
          title: "Measurements",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="add-note" 
        options={{ 
          title: "Add Note",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}

function AppContent() {
  return (
    <EventsProvider>
      <TimerProvider>
        <GestureHandlerRootView>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </TimerProvider>
    </EventsProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}