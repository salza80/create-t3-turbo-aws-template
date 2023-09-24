import { Text, View } from "react-native";

import { useUser } from "../../providers/userProvider";

export default function Profile() {
  const response = useUser();
  let userData = undefined;
  if (response?.isSuccess) {
    userData = response.data;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>
        {userData?.name} - {response?.dataUpdatedAt}
      </Text>
    </View>
  );
}
