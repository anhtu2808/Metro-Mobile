import React, { useEffect, useState } from "react";
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
import { readInfoAPI, fectchLoginAPI, fetchLoginGoogleAPI } from "../../apis";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSuccess } from "../../store/userSlice";

// Thêm các import cho expo-auth-session
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Video } from "expo-av";
WebBrowser.maybeCompleteAuthSession();

function Login() {
  const [password, setPasword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Thay thế GoogleSignin bằng useAuthRequest
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "18046394453-11jgpgqqh0pu3fkdej41d3lj3ps4muo9.apps.googleusercontent.com",
    androidClientId:
      "18046394453-ddm07h7r5rn7mgd2se1ljv35smvbm3si.apps.googleusercontent.com",
    iosClientId:
      "18046394453-rlng833atqajg639mh3435pt2gtpg3k7.apps.googleusercontent.com",
    webClientId:
      "709789750534-gt40kns8437i96kl0olichbo0og1hv97.apps.googleusercontent.com",
  });
  // scopes: ['profile', 'email'] // nếu cần

  const handleLogin = () => {
    if (username === "" || password === "") {
      Alert.alert("Thông báo", "Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    const data = {
      username: username,
      password: password,
    };

    // Handle login logic here
    fectchLoginAPI(data)
      .then(async (response) => {
        // Lưu token vào AsyncStorage nếu cần
        await AsyncStorage.setItem("accessToken", response.result.token);

        // Gọi tiếp API lấy thông tin user
        const userInfo = await readInfoAPI();
        await AsyncStorage.setItem("user", JSON.stringify(userInfo.result));
        console.log(userInfo);
        // Lưu user vào Redux
        dispatch(
          loginSuccess({
            user: userInfo.result, // tuỳ theo response API trả về
            accessToken: response.result.token,
          })
        );
        navigation.navigate("Home");
        // Alert.alert("Đăng nhập thành công", `Chào mừng ${username}!`);
      })
      .catch((error) => {
        console.log("Login error:", error?.response?.data || error);
        Alert.alert("Lỗi đăng nhập", "Tên đăng nhập hoặc mật khẩu không đúng.");
      });
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("authhhhhhhhhhhhhhhhhhh", authentication);
      // authentication.accessToken, authentication.idToken
      handleGoogleAuth(authentication?.idToken);
    }
  }, [response]);

  const handleGoogleAuth = async (idToken) => {
    if (!idToken) {
      Alert.alert("Lỗi", "Không lấy được idToken từ Google.");
      return;
    }
    console.log("idTokennnnnnnnnnnnnnnnnnn", idToken);
    try {
      const response = await fetchLoginGoogleAPI({ idToken });
      await AsyncStorage.setItem("accessToken", response.result.token);
      const loggedInUserInfo = await readInfoAPI();
      dispatch(
        loginSuccess({
          user: loggedInUserInfo.result,
          accessToken: response.result.token,
        })
      );
      navigation.navigate("Home");
      Alert.alert(
        "Đăng nhập thành công",
        `Chào mừng ${loggedInUserInfo.result.fullName}!`
      );
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Đăng nhập bằng Google không thành công. Vui lòng thử lại."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("../../assets/metro_video.mp4")}
        style={styles.image}
        resizeMode="cover"
        isLooping
        shouldPlay
      />
      <View style={styles.board}>
        <Text style={styles.title}>Chào Mừng Bạn</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tên Đăng Nhập"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.textInput, { flex: 1, marginVertical: 0 }]}
            placeholder="Mật Khẩu"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPasword}
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.loginGoogleButton}
          onPress={() => promptAsync()} // Sử dụng promptAsync để đăng nhập Google
          disabled={!request}
        >
          <Text style={styles.loginGoogleButtonText}>Đăng Nhập Google</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.register}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.register}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
  },
  image: {
    width: "100%",
    height: 440,
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
