import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import Account from "../screens/account/Account";

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ title: "Thông tin tài khoản" }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
