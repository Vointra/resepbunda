import { Stack, router, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";
import { useDatabase } from "../src/hooks/useDatabase";
import { theme } from "../src/theme";

function Splash() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.neutral.bg }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
}

function GuardedStack() {
  const { ready: authReady, session } = useAuth();
  const isDbReady = useDatabase(); // Menggunakan hook database
  const segments = useSegments();

  // Aplikasi dianggap siap hanya jika autentikasi dan database sudah siap
  const appReady = authReady && isDbReady;

  useEffect(() => {
    if (!appReady) return; // Tunggu kedua proses selesai

    const inAuth = segments[0] === "(auth)";

    if (!session && !inAuth) {
      router.replace("/(auth)/login");
    } else if (session && inAuth) {
      router.replace("/(tabs)");
    }
  }, [appReady, session, segments]);

  if (!appReady) {
    return <Splash />;
  }

  // Tampilkan navigasi utama setelah semua siap
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GuardedStack />
    </AuthProvider>
  );
}
