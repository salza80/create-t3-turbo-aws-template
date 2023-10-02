import React from "react";
import { Platform, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

import { useSession } from "../../providers/sessionProvider/ctx";
import { UserProvider } from "../../providers/userProvider";

export default function TabsLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <UserProvider>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarStyle: Platform.OS === "ios" && {
            backgroundColor: "transparent",
          },
          headerShown: false,
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tabBar={(props: any) =>
          Platform.OS === "ios" ? (
            <BlurView
              style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
              intensity={95}
            >
              <BottomTabBar {...props} />
            </BlurView>
          ) : (
            <BottomTabBar {...props} />
          )
        }
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 17,
                  backgroundColor: "transparent",
                }}
              >
                <TabBarIcon name="user" color={color} size={24} />
                <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                  Profile
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 17,
                  backgroundColor: "transparent",
                }}
              >
                <TabBarIcon name="home" color={color} size={24} />
                <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                  Swipe!
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="signout"
          options={{
            title: "Sign Out",
            headerShown: true,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome
      size={props.size ?? 26}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}
