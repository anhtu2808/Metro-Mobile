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
import { createResetPasswordAPI } from "../../apis"; 
import { useNavigation, useRoute } from "@react-navigation/native";

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {}; // Lấy email từ params

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!otpCode.trim() || !newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ OTP và mật khẩu mới.");
      return;
    }
    setLoading(true);
    try {
      const response = await createResetPasswordAPI({
        email,
        otpCode,
        newPassword,
      });
      if (response?.code === 200) {
        Alert.alert(
          "Thành công",
          "Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      } else {
        Alert.alert("Lỗi", response?.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={styles.label}>Email: {email || "Chưa có email"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
        value={otpCode}
        onChangeText={setOtpCode}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Xác nhận</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#1976d2",
  },
  label: {
    fontSize: 14,
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

export default ResetPassword;
