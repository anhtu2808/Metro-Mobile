import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Cần cài @expo/vector-icons hoặc react-native-vector-icons
import Header from "../../components/header/Header";

const TransactionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header name="Phương thức thanh toán" />

      {/* Danh sách phương thức thanh toán */}
      <TouchableOpacity style={styles.paymentMethod}>
        {/* Nếu có icon VNPay PNG, thay thế Image source bên dưới */}
        {/* <Image source={require('../assets/vnpay.png')} style={styles.icon} /> */}
        <View style={styles.iconVNPay}>
          <Text style={styles.iconVNPayText}>VN</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Ví VNPay</Text>
          <Text style={styles.methodDesc}>Thanh toán qua VNPay</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    color: "#2D2E82",
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginLeft: -28, // Để căn giữa khi có icon ở 2 bên
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconVNPay: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1565C0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconVNPayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  methodDesc: {
    fontSize: 14,
    color: "#7B7B7B",
  },
  // Nếu dùng ảnh icon
  icon: {
    width: 44,
    height: 44,
    resizeMode: "contain",
    marginRight: 16,
  },
});

export default TransactionScreen;
