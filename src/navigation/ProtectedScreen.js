import React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useSelector } from "react-redux";

const ProtectedScreen = ({ children, navigation }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace("Login");
      Alert.alert(
        "Biến", "Đăng nhập đi thằng khốn nạn không có quyền truy cập!")
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Có thể hiện màn loading hoặc null
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default ProtectedScreen;
