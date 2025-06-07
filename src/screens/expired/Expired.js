import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";

const Expired = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header name="Hết hạn" />

      <View style={styles.content}>
        <Text style={styles.emptyText}>Bạn không có vé nào</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Gradient nền: Có thể dùng thư viện 'react-native-linear-gradient' nếu muốn gradient thực sự
    backgroundColor: "#ebf7fa", // màu trắng xanh nhạt gần giống, có thể chỉnh lại cho phù hợp
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#b0b0b0",
    fontSize: 18,
  },
});

export default Expired;
