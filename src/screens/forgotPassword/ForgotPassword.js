import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { createForgotPasswordAPI } from "../../apis"; // đường dẫn import đúng API của bạn
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return;
    }
    // Có thể kiểm tra định dạng email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Định dạng email không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      const response = await createForgotPasswordAPI({ email }); // Gửi API
      if (response?.code === 200) {
        Alert.alert(
          "Thành công",
          "Mã OTP đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư.",
          [
            {
                text: "OK",
                onPress: () => navigation.navigate("ResetPassword", { email }),
            }
          ]
        );
        // Ở đây bạn có thể điều hướng sang màn nhập mã OTP
        // navigation.navigate("OTPVerification", { email });
      } else {
        Alert.alert("Lỗi", response?.message || "Gửi mã OTP thất bại.");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header name="Quên mật khẩu"/>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <Text style={styles.label}>Nhập email của bạn để nhận mã OTP:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Gửi mã OTP</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: "#444",
    textAlign: "center",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    height: 48,
    backgroundColor: "#1976d2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0a7d6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ForgotPassword;
