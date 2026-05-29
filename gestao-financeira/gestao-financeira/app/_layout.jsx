import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import GlobalState, { MoneyContext } from "../contexts/GlobalState";

function RootLayoutNav() {
  const { isAuthenticated, loadingAuth } = useContext(MoneyContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loadingAuth) return;
    const inTabsGroup = segments[0] === "(tabs)";
    if (isAuthenticated && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && inTabsGroup) {
      router.replace("/login");
    }
  }, [isAuthenticated, segments, loadingAuth]);
  if (loadingAuth) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GlobalState>
      <RootLayoutNav />
    </GlobalState>
  );
}
