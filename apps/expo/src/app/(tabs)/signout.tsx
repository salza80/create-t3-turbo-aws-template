import { View } from "react-native";
import { Button } from "@rneui/themed";

import { useSession } from "../../providers/sessionProvider/ctx";

export default function Index() {
  const { signOut } = useSession();
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-2/3">
        <Button className="w-2/3" title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}
