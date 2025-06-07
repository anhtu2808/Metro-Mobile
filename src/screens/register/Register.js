import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import ImageUploader from "../../components/image/ImageUploader";
import Header from "../../components/header/Header";

const Register = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header name="Đăng ký" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput style={styles.textInput} placeholder="Tên" />
        <TextInput style={styles.textInput} placeholder="Họ" />
        <TextInput style={styles.textInput} placeholder="Tên Đăng Nhập" />
        <TextInput
          style={styles.textInput}
          placeholder="Mật Khẩu"
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Xác Nhận Mật Khẩu"
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Số Điện Thoại"
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ImageUploader />
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
});

export default Register;
