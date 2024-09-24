import React from "react";
import * as SplashScreen from "expo-splash-screen";

import { Navigator, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

const AuthedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(restaurant)"} options={{ headerShown: false }} />
    </Stack>
  );
};
export default AuthedLayout;
