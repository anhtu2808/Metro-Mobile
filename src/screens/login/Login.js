import React from "react";
import {
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function Login() {
  const [number, onChangeNumber] = React.useState("");
  const [text, onChangeText] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false); // Add this line
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/metro.jpg")} style={styles.image} />
      <View style={styles.board}>
        <Text style={styles.title}>Chào Mừng Bạn</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tên Đăng Nhập"
          placeholderTextColor="#999"
          value={text}
          onChangeText={onChangeText}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.textInput, { flex: 1, marginVertical: 0 }]}
            placeholder="Mật Khẩu"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholderTextColor="#999"
            value={number}
            onChangeText={onChangeNumber}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => Alert.alert("Login pressed")}
        >
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginGoogleButton}
          onPress={() => navigation.navigate("Account")}
        >
          <Text style={styles.loginGoogleButtonText}>Đăng Nhập Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.register}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "stretch",
  },
  board: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignSelf: "center",
    marginTop: -40,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    padding: 4,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginGoogleButton: {
    backgroundColor: "#DB4437",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginGoogleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  register: {
    color: "#007AFF",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
});

export default Login;
