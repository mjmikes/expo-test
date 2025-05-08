import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

function InnerLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn } = useAuth(); // Accessing login status

  const [fontsLoaded, setFontsLoaded] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isAppReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/login"); // Redirect to login if not logged in
    }

    if (isLoggedIn && inAuthGroup) {
      router.replace("/"); // Redirect to main screen if logged in
    }
  }, [isAppReady, isLoggedIn, segments]);

  if (!isAppReady) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="screens/TankDetailScreen"
          options={{
            title: "Tank", // optional, can be set dynamically too
            headerBackTitle: "Tanks", // 👈 Custom back button label
            headerStyle: {
              backgroundColor: "#0f172a", // dark background
            },
            headerTintColor: "#06b6d4", // text & icon color
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 28,
            },
          }}
        />
        <Stack.Screen
          name="screens/AddTank"
          options={{
            title: "", // optional, can be set dynamically too
            headerBackTitle: "Tanks", // 👈 Custom back button label
            headerStyle: {
              backgroundColor: "#0f172a", // dark background
            },
            headerTintColor: "#06b6d4", // text & icon color
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 28,
            },
          }}
        />
        <Toast />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
