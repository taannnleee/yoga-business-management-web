import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="/rating" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
