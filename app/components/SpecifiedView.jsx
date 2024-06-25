import { Platform, SafeAreaView, View } from "react-native";

const SpecifiedView = ({ children, style }) => {
  return Platform.OS === "ios" ? (
    <SafeAreaView style={style}>{children}</SafeAreaView>
  ) : (
    <View style={style}>{children}</View>
  );
};

export default SpecifiedView;
