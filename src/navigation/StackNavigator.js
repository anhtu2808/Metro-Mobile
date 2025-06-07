import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import Account from "../screens/account/Account";
import BuyTicket from "../screens/buyTicket/BuyTicket";
import MyTicket from "../screens/myTicket/MyTicket";
import BuyTurnTicket from "../screens/buyTicket/BuyTurnTicket";
import Expired from "../screens/expired/Expired";
import HistoryTransaction from "../screens/historyTransaction/HistoryTransaction";
import TicketTabNavigator from "./TicketTabNavigator";

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
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false, title: "Thông tin tài khoản" }}
      />
      <Stack.Screen
        name="BuyTurnTicket"
        component={BuyTurnTicket}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Expired"
        component={Expired}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TicketTabs"
        component={TicketTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
