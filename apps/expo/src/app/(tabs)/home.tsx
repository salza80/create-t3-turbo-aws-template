import { View, Text } from "react-native";

import { useUser } from "~/providers/userProvider";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
    </View>
  );
}
