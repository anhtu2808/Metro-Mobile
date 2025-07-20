import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal, Pressable, TouchableWithoutFeedback, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateUser } from "../account/userHelpers"; // hoặc api gọi cập nhật, bạn import đúng
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header/Header";
import { uploadImageToServer } from '../account/userHelpers'; 
import * as ImagePicker from 'expo-image-picker';

const Verification = ({ navigation }) => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [schoolName, setSchoolName] = useState("");
  const [graduateDate, setGraduateDate] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Có thể thêm upload ảnh nếu cần
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const handleSubmit = async () => {
  if (!schoolName || !graduateDate || !imageUri) {
    Alert.alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh.");
    return;
  }

  setLoading(true);
  try {
    const success = await handleUpdateUser({
      userId: user.id,
      data: {
        schoolName,
        graduateDate,
        imageUrl: imageUri, // url ảnh upload
        status: "PENDING",
      },
      dispatch,
      accessToken: user.accessToken,
      onSuccess: () => {
        Alert.alert(
          "Thành công",
          "Đã gửi yêu cầu xác minh. Vui lòng đợi admin duyệt.",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      },
      onError: () => {
        Alert.alert("Lỗi", "Gửi yêu cầu xác minh thất bại");
      },
    });

    if (!success) {
      Alert.alert("Lỗi", "Không thể gửi yêu cầu xác minh");
    }
  } catch (error) {
    Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại");
  } finally {
    setLoading(false);
  }
};

  //chọn ảnh từ máy
  const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Bạn cần cho phép truy cập thư viện ảnh!');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled) {
    await handleUpload(result.assets[0].uri);
  }
};

//chụp ảnh
const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Bạn cần cho phép truy cập camera!');
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled) {
    await handleUpload(result.assets[0].uri);
  }
};

//upload ảnh
const handleUpload = async (uri) => {
  try {
    setLoading(true);
    const uploadedUrl = await uploadImageToServer(uri); // Hàm upload ảnh có thể tái sử dụng từ trang Account
    setImageUri(uploadedUrl);
    setShowActionModal(false);
  } catch (error) {
    Alert.alert('Lỗi', error.message || 'Upload ảnh thất bại');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    <Header name="Xác minh học sinh sinh viên"/>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Trường học</Text>
      <TextInput style={styles.input} value={schoolName} onChangeText={setSchoolName} placeholder="Tên trường học" />
      <Text>Ngày tốt nghiệp (ghi trên thẻ hssv)</Text>
      <TextInput style={styles.input} value={graduateDate} onChangeText={setGraduateDate} placeholder="YYYY-MM-DD" />
      <View style={{ marginBottom: 20 }}>
  <Text>Ảnh thẻ học sinh sinh viên (bắt buộc):</Text>
  {imageUri ? (
    <View style={{ marginVertical: 10, alignItems: 'center' }}>
      <Image source={{ uri: imageUri }} style={{ width: 200, height: 120, borderRadius: 8 }} />
      <TouchableOpacity onPress={() => setShowActionModal(true)} style={{ marginTop: 10 }}>
        <Text style={{ color: '#2D2E82' }}>Thay đổi ảnh</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={() => setShowActionModal(true)} style={{ padding: 10, backgroundColor: '#1976d2', borderRadius: 6, marginTop: 10 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Chọn hoặc chụp ảnh</Text>
    </TouchableOpacity>
  )}
</View>
      {/* Nếu có upload ảnh bạn có thể làm thêm phần upload */}

      <TouchableOpacity
        style={[styles.btn, loading ? { opacity: 0.5 } : {}]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "Đang gửi..." : "Gửi xác minh"}
        </Text>
      </TouchableOpacity>
    </ScrollView>

    <Modal visible={showActionModal} transparent animationType="fade">
  <View style={styles.modalBackground}>
    {/* Vùng ngoài -- bắt sự kiện chạm để tắt modal */}
    <TouchableWithoutFeedback onPress={() => setShowActionModal(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>
    {/* Vùng dưới là actionSheet: KHÔNG bị ảnh hưởng khi bấm vào các lựa chọn bên dưới */}
    <View style={styles.actionSheet}>
      <TouchableOpacity style={styles.actionItem} onPress={pickImage}>
        <Text>Chọn từ thư viện</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem} onPress={takePhoto}>
        <Text>Chụp ảnh</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  btn: {
    backgroundColor: "#2D2E82",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBackground: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},
  actionSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},
  actionItem: {
    paddingVertical: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});

export default Verification;
