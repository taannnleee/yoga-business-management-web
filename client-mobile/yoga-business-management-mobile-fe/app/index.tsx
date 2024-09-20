import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { getJwt } from "@/jwt/get-jwt";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkJwt = async () => {
      const isAuth = await getJwt();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };

    checkJwt();
  }, []);

  // Display a loading screen while token is being checked
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status
  return isAuthenticated ? (
    <Redirect href="/(root)/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/welcome" />
  );
};

export default Home;
