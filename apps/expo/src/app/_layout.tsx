import React, { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/providers/trcpProvider";
import { SessionProvider } from "../providers/sessionProvider";

// This is the main layout of the app
// It wraps your pages with the providers they need

const RootLayout = () => {
  return (
    <SessionProvider>
      <TRPCProvider>
        <SafeAreaProvider>
          {/*
            The Stack component displays the current page.
            It also allows you to configure your screens 
          */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(auth)/login"
              options={{
                headerShown: true,
                headerTitle: "Login",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(auth)/register"
              options={{
                headerShown: true,
                headerTitle: "Register",
                headerBackTitle: "Back",
              }}
            />
          </Stack>
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </SessionProvider>
  );
};

export default RootLayout;
