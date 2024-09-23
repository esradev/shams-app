import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          headerSearchBarOptions: {
            placeholder: "Search",
            autoFocus: false,
            autoCapitalize: "sentences",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "شمس المعارف",
          }}
        />
        <Stack.Screen
          name="category/[id]"
          options={({ route }) => ({
            title: route.params?.categoryName || ".....",
          })}
        />
        <Stack.Screen
          name="posts/[id]"
          options={({ route }) => ({
            title: route.params?.postTitle || ".....",
          })}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
