import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BuyTicket from "../screens/buyTicket/BuyTicket";
import MyTicket from "../screens/myTicket/MyTicket";
import HistoryTransaction from "../screens/historyTransaction/HistoryTransaction";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TicketTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="BuyTicket"
        component={BuyTicket}
        options={{
          title: "Mua vé",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTicket"
        component={MyTicket}
        options={{
          title: "Vé của tôi",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="confirmation-number"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTransaction"
        component={HistoryTransaction}
        options={{
          title: "Lịch sử",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
