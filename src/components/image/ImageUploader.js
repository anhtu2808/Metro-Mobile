import React, { useState } from "react";
import { Button, Image, StyleSheet, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";

export default function ImageUploader({ setAvatarUrl }) {
  // Thêm setAvatarUrl để truyền uri lên Register
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Yêu cầu quyền truy cập
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

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    //   setAvatarUrl && setAvatarUrl(result.assets[0].uri); // truyền uri lên cha
    // }
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      // Bước 2: Upload lên AWS qua API
      const uploadRes = await api.post("/v1/uploads/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadRes.data.code === 200) {
        setImage(result.assets[0].uri);
      }

      const imageUrl = uploadRes.data.result; // link ảnh trả về
      console.log("uploadddddddddddddddd", uploadRes.data.result);
      return imageUrl;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hãy gửi hình ảnh thẻ sinh viên để xác minh (nếu có)
      </Text>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
