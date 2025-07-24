import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import Account from "../screens/account/Account";
import BuyTurnTicket from "../screens/buyTicket/BuyTurnTicket";
import Expired from "../screens/expired/Expired";
import TicketTabNavigator from "./TicketTabNavigator";
import TransactionScreen from "../screens/transaction/TransactionScreen";
import Invoice from "../screens/invoice/Invoice";
import AdjustTicket from "../screens/adjustTicket/AdjustTicket";
import News from "../screens/news/News";
import NewsDetail from "../screens/news/NewsDetail";
import MetroMapScreen from "../screens/route/Route";
import Guideline from "../screens/guideline/Guideline";
import ProtectedScreen from "./ProtectedScreen";
import PaymentSuccessScreen from "../components/paymentSuccess/PaymentSuccessScreen ";
import Verification from "../screens/invoice/Verification";
import ForgotPassword from "../screens/forgotPassword/ForgotPassword";
import ResetPassword from "../screens/forgotPassword/ResetPassword";
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
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Invoice"
        options={{ headerShown: false }}
      >
      {(props) => (
        <ProtectedScreen navigation={props.navigation}>
          <Invoice {...props} />
        </ProtectedScreen>
      )}
      </Stack.Screen>
      <Stack.Screen
        name="AdjustTicket"
        component={AdjustTicket}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Route"
        component={MetroMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guideline"
        component={Guideline}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentSuccessScreen"
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{headerShown: false}}
        />
      <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
      />
      <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
