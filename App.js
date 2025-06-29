import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./src/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Thêm đoạn cấu hình này vào đầu file
GoogleSignin.configure({
  webClientId:
    "18046394453-1ovuaq3f50is6mfksrgvhape9i2f51sa.apps.googleusercontent.com", // <-- Rất quan trọng!
});
// https://console.cloud.google.com/auth/clients/18046394453-1ovuaq3f50is6mfksrgvhape9i2f51sa.apps.googleusercontent.com?inv=1&invt=Ab1bdA&project=metroapp-464416
//dùng console.cloud.google để lấy client ID
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
