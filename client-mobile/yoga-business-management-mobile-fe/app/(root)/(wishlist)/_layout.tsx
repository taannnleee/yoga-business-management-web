import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="/page-wishlist" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
