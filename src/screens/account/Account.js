import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/header/Header";

const Account = () => {
  return (
    <View style={styles.container}>
      <Header name="Thông tin cá nhân" />
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../assets/metro.jpg")}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.name}>Nguyen Si Van Hao (K17 HCM)</Text>
      <ScrollView style={styles.infoContainer}>
        <InfoItem label="Tên" value="Hao (K17 HCM)" />
        <InfoItem label="Họ" value="Nguyen Si Van" />
        <InfoItem label="Email" value="haonsvse172181@fpt.edu.vn" />
        <InfoItem label="Tên đăng nhập" value="Vạn Hào" />
        <InfoItem label="Mật khẩu" value="" />
        <InfoItem label="Số điện thoại" value="0900000000" />
        <InfoItem label="Quản lý phương thức thanh toán" value="" />
        <InfoItem label="Xoá tài khoản" value="" isDanger />
        <InfoItem label="Đăng xuất" value="" isDanger />
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ label, value, isDanger }) => (
  <TouchableOpacity style={styles.infoItem}>
    <Text style={[styles.infoLabel, isDanger && { color: "#e53935" }]}>
      {label}
    </Text>
    {value ? <Text style={styles.infoValue}>{value}</Text> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 30,
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#b3e5fc",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "black",
  },
  badgeContainer: {
    backgroundColor: "#ffeb3b",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badge: {
    color: "#d84315",
    fontWeight: "bold",
    fontSize: 14,
  },
  logo: {
    width: 60,
    height: 30,
    resizeMode: "contain",
    marginBottom: 10,
  },
  infoContainer: {
    width: "90%",
    marginTop: 10,
  },
  infoItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 15,
    color: "#222",
  },
  infoValue: {
    fontSize: 15,
    color: "#555",
    marginLeft: 10,
  },
});

export default Account;
