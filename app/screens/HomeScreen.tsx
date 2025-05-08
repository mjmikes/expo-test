import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home / Tank List</Text>
      <Button
        title="Go to Tank Detail"
        onPress={() => navigation.navigate("TankDetail", { tankId: "123" })}
      />
    </View>
  );
}
