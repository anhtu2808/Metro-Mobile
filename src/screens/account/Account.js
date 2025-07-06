import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../store/userSlice";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { MaterialIcons } from "@expo/vector-icons";

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  // Đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    dispatch(logout());
    navigation.navigate("Login");
  };

  // Xử lý chọn ảnh từ thư viện
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Bạn cần cho phép truy cập thư viện ảnh!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      await uploadAndUpdateAvatar(result.assets[0].uri);
    }
  };

  // Xử lý chụp ảnh
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Bạn cần cho phép truy cập camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      await uploadAndUpdateAvatar(result.assets[0].uri);
    }
  };

  // Xử lý upload lên AWS và cập nhật avatarUrl
  const uploadAndUpdateAvatar = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
      const uploadRes = await api.post("/v1/uploads/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (uploadRes.data.code === 200) {
        const imageUrl = uploadRes.data.result;
        setAvatarUrl(imageUrl);
        // Gọi API update user avatarUrl nếu cần
        // await api.put("/v1/users", { avatarUrl: imageUrl });
        Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện.");
    }
    setShowActionModal(false);
    setShowAvatarModal(false);
  };

  // Xử lý xóa avatar
  const handleDeleteAvatar = async () => {
    setAvatarUrl(null);
    // Gọi API update user avatarUrl = null nếu cần
    // await api.put("/v1/users", { avatarUrl: null });
    setShowActionModal(false);
    setShowAvatarModal(false);
    Alert.alert("Thành công", "Đã xóa ảnh đại diện.");
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Header name="Thông tin cá nhân" />
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onLongPress={() => setShowAvatarModal(true)}
          delayLongPress={300}
        >
          <Image
            source={
              avatarUrl ? { uri: avatarUrl } : require("../../assets/metro.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
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
          value={" "}
        />
        <InfoItem label="Đăng xuất" value=" " isDanger onPress={handleLogout} />
      </ScrollView>

      {/* Modal hiển thị avatar lớn và icon edit */}
      <Modal visible={showAvatarModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.avatarModalView}>
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("../../assets/metro.jpg")
              }
              style={styles.avatarLarge}
            />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => setShowActionModal(true)}
            >
              <MaterialIcons name="edit" size={32} color="#fff" />
            </TouchableOpacity>
            <Pressable
              style={styles.closeModal}
              onPress={() => setShowAvatarModal(false)}
            >
              <MaterialIcons name="close" size={32} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal các tùy chọn: Chọn ảnh, Chụp ảnh, Xóa */}
      <Modal visible={showActionModal} transparent animationType="fade">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setShowActionModal(false)}
        >
          <View style={styles.actionSheet}>
            <TouchableOpacity style={styles.actionItem} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color="#333" />
              <Text style={styles.actionText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={24} color="#333" />
              <Text style={styles.actionText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleDeleteAvatar}
            >
              <MaterialIcons name="delete" size={24} color="#e53935" />
              <Text style={[styles.actionText, { color: "#e53935" }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
      <Text>Thông tin chưa được cung cấp</Text>
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
  avatarLarge: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "black",
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarModalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 8,
    elevation: 4,
  },
  closeModal: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 4,
    elevation: 4,
  },
  actionSheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: 300,
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 80,
    elevation: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  actionText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#222",
  },
});

export default Account;
