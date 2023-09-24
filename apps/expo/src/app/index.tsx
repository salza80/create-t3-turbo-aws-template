import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@rneui/themed";

const Index = () => {
  return (
    <SafeAreaView className="flex h-full justify-center bg-[#dfd588]">
      <View className="flex-1 items-center justify-center">
        <View className="w-2/3 space-y-4">
          <Button title="Login" onPress={() => router.push("/login")} />
          <Button title="Register" onPress={() => router.push("/register")} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
