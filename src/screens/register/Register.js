import {
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ImageUploader from "../../components/image/ImageUploader";
import Header from "../../components/header/Header";
import { createRegisterAPI } from "../../apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // const [avatarUrl, setAvatarUrl] = useState(null);
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!firstName || !lastName || !username || !password || !phone || !email) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const data = {
      firstName,
      lastName,
      username,
      password,
      address,
      phone,
      email,
      // avatarUrl: avatarUrl || "", // Nếu không có avatarUrl thì để trống
    };
    createRegisterAPI(data)
      .then((response) => {
        navigation.navigate("Login");
        Alert.alert("Đăng ký thành công", "Bạn đã đăng ký thành công!");
      })
      .catch((error) => {
        console.log(error?.response?.data || error);
        Alert.alert("Lỗi đăng ký", "Đã xảy ra lỗi trong quá trình đăng ký.");
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header name="Đăng ký" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.textInput}
          placeholder="Tên"
          autoCapitalize="none"
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Họ"
          autoCapitalize="none"
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Tên Đăng Nhập"
          autoCapitalize="none"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Mật Khẩu"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Đia Chỉ"
          autoCapitalize="none"
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Số Điện Thoại"
          keyboardType="numeric"
          autoCapitalize="none"
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
  },
  textInput: {
    height: 50,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderColor: "#ddd",
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
    alignSelf: "center",
    width: "30%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Register;
