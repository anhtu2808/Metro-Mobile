import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./src/store";
import AuthLoader from "./src/AuthLoader"; // đây là trang để mà xử lý việc lưu thông tin người dùng để không bị đăng nhập lại mỗi lần mở ứng dụng

export default function App() {
  return (
    <Provider store={store}>
      <AuthLoader>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AuthLoader>
    </Provider>
  );
}
