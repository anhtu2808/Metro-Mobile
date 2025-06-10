import React, { use, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../store/userSlice";

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    dispatch(logout());
    navigation.navigate("Login");
  };

  if (!user) return null; // hoặc hiển thị loading

  return (
    <View style={styles.container}>
      <Header name="Thông tin cá nhân" />
      <View style={styles.avatarContainer}>
        <Image
          source={
            user.avatarUrl
              ? { uri: user.avatarUrl }
              : require("../../assets/metro.jpg")
          }
          style={styles.avatar}
        />
      </View>
      <Text style={styles.name}>{user.username}</Text>
      <ScrollView style={styles.infoContainer}>
        <InfoItem value={"Tên: " + user.firstName} />
        <InfoItem value={"Họ: " + user.lastName} />
        <InfoItem value={"Email: " + user.email} />
        <InfoItem value={"Tên đăng nhập: " + user.username} />
        <InfoItem value={"Địa chỉ: " + user.address} />
        <InfoItem value={"Số điện thoại: " + user.phone} />
        <InfoItem
          label="Quản lý phương thức thanh toán"
          onPress={() => navigation.navigate("Transaction")}
        />
        <InfoItem label="Đăng xuất" value="" isDanger onPress={handleLogout} />
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ label, value, isDanger, onPress }) => (
  <TouchableOpacity style={styles.infoItem} onPress={onPress}>
    <Text style={[styles.infoLabel, isDanger && { color: "#e53935" }]}>
      {label}
    </Text>
    {value ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      "Thông tin chưa được cung cấp"
    )}
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
    textAlign: "left",
    flex: 1,
  },
});

export default Account;
