import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name={"welcome"} options={{ headerShown: false }} />
      <Stack.Screen name={"sign-up"} options={{ headerShown: false }} />
      <Stack.Screen name={"sign-in"} options={{ headerShown: false }} />
      <Stack.Screen name={"forget-password"} options={{ headerShown: false }} />
      <Stack.Screen name={"verify-otp"} options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
