import React, { useState, useEffect } from "react";
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
  TextInput,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../store/userSlice";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { handleUpdateUser } from "./userHelpers";

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);

  // Thông tin form chỉnh sửa (không bao gồm avatarUrl)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setAvatarUrl(user?.avatarUrl || null);
  }, [user]);

  // Đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("user");
    dispatch(logout());
    navigation.navigate("Login");
  };

  // Upload ảnh helper
  const uploadImageToServer = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    });
    const token = await AsyncStorage.getItem("accessToken");
    const uploadRes = await api.post("/v1/uploads/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (uploadRes?.data?.code === 200 && uploadRes.data.result) {
      return uploadRes.data.result;
    }
    throw new Error("Upload ảnh thất bại");
  };

  // Upload và cập nhật avatarUrl riêng biệt
  const uploadAndUpdateAvatar = async (uri) => {
    try {
      setLoading(true);
      const imageUrl = await uploadImageToServer(uri);

      // Cập nhật avatarUrl xuống DB riêng biệt
      const success = await handleUpdateUser({
        userId: user.id,
        data: { avatarUrl: imageUrl }, // Chỉ gửi avatarUrl
        dispatch,
        accessToken: user.accessToken,
        onSuccess: () => {
          setAvatarUrl(imageUrl);
          Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
        },
        onError: () => {
          Alert.alert("Lỗi", "Cập nhật ảnh đại diện thất bại!");
        },
      });

      if (!success) {
        Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện.");
      }
    } catch (e) {
      Alert.alert("Lỗi", e.message || "Không thể cập nhật ảnh đại diện.");
    } finally {
      setLoading(false);
      setShowActionModal(false);
      setShowAvatarModal(false);
    }
  };

  // Xóa avatar riêng biệt
  const handleDeleteAvatar = async () => {
    setLoading(true);
    const success = await handleUpdateUser({
      userId: user.id,
      data: { avatarUrl: null },
      dispatch,
      accessToken: user.accessToken,
      onSuccess: () => {
        setAvatarUrl(null);
        Alert.alert("Thành công", "Đã xóa ảnh đại diện.");
      },
      onError: () => {
        Alert.alert("Lỗi", "Xóa ảnh đại diện thất bại!");
      },
    });

    if (!success) {
      Alert.alert("Lỗi", "Không thể xóa ảnh đại diện.");
    }
    setLoading(false);
    setShowActionModal(false);
    setShowAvatarModal(false);
  };

  // Chọn ảnh từ thư viện
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

  // Chụp ảnh
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

  // Lưu thông tin cá nhân (không cập nhật avatarUrl)
  const saveProfileInfo = async () => {
    setLoading(true);
    const updatedUserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    const success = await handleUpdateUser({
      userId: user.id,
      data: updatedUserData,
      dispatch,
      accessToken: user.accessToken,
      onSuccess: () => {
        Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân!");
        setShowEditInfoModal(false);
      },
      onError: () => {
        Alert.alert("Lỗi", "Cập nhật thông tin thất bại!");
      },
    });
    setLoading(false);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Header name="Thông tin cá nhân" />
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
          <Image
            source={
              avatarUrl ? { uri: avatarUrl } : require("../../assets/metro.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{user.username}</Text>

      <TouchableOpacity
        style={styles.editInfoButton}
        onPress={() => setShowEditInfoModal(true)}
      >
        <Text style={styles.editInfoButtonText}>
          Chỉnh sửa thông tin cá nhân
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.infoContainer}>
        <InfoItem label="Tên: " value={user.firstName} />
        <InfoItem label="Họ: " value={user.lastName} />
        <InfoItem label="Email: " value={user.email} />
        <InfoItem label="Tên đăng nhập: " value={user.username} />
        <InfoItem label="Địa chỉ: " value={user.address} />
        <InfoItem label="Số điện thoại: " value={user.phone} />
        <InfoItem
          label="Quản lý phương thức thanh toán"
          onPress={() => navigation.navigate("Transaction")}
          value={" "}
        />
        <InfoItem label="Đăng xuất" value=" " isDanger onPress={handleLogout} />
      </ScrollView>

      {/* Modal avatar */}
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

      {/* Modal chọn hành động ảnh */}
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

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Modal visible={showEditInfoModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.editInfoModal}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>

            <ScrollView>
              <InputItem
                label="Tên"
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, firstName: text }))
                }
              />
              <InputItem
                label="Họ"
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, lastName: text }))
                }
              />
              <InputItem
                label="Email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
              />
              <InputItem
                label="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                keyboardType="phone-pad"
              />
              <InputItem
                label="Địa chỉ"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text }))
                }
              />
            </ScrollView>

            <View style={styles.editInfoButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => setShowEditInfoModal(false)}
                disabled={loading}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#2D2E82" }]}
                onPress={saveProfileInfo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoItem = ({ label, value, isDanger, onPress }) => (
  <TouchableOpacity
    style={styles.infoItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <Text style={[styles.infoLabel, isDanger && { color: "#e53935" }]}>
      {label}
    </Text>
    {value ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      <Text style={styles.infoValue}>Thông tin chưa được cung cấp</Text>
    )}
  </TouchableOpacity>
);

const InputItem = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
}) => (
  <View style={styles.inputItem}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={`Nhập ${label.toLowerCase()}`}
    />
  </View>
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
  editInfoModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2E82",
    marginBottom: 12,
    textAlign: "center",
  },
  inputItem: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  editInfoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  editInfoButton: {
    backgroundColor: "#1976d2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
  },
  editInfoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Account;
