import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

export default function HomeScreen() {
  const navigation = useNavigation();
  const horizontalCards = [
    {
      id: "1",
      image: require("../../assets/metro.jpg"),
      text: "Hướng dẫn sử dụng",
    },
    {
      id: "2",
      image: require("../../assets/metro.jpg"),
      text: "Hướng dẫn sử dụng",
    },
  ];
  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <Video
            source={require("../../assets/metro.mp4")}
            style={styles.image}
            resizeMode="cover"
            isLooping
            shouldPlay
          />
          <View style={styles.board}>
            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate("TicketTabs", { screen: "BuyTicket" })
                }
              >
                <View style={styles.iconContent}>
                  <MaterialIcons name="local-atm" size={30} color="#000" />
                  <Text style={styles.iconLabel}>Mua Vé</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate("TicketTabs", { screen: "MyTicket" })
                }
              >
                <View style={styles.iconContent}>
                  <MaterialIcons
                    name="confirmation-number"
                    size={30}
                    color="#000"
                  />
                  <Text style={styles.iconLabel}>Vé Của Tôi</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconBox}>
              <MaterialIcons name="sync" size={30} color="#000" />
              <Text style={styles.iconLabel}>Điều Chỉnh Giá Vé</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="tram" size={30} color="#000" />
              <Text style={styles.iconLabel}>Hành Trình</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="chat" size={30} color="#000" />
              <Text style={styles.iconLabel}>Nhận xét</Text>
            </View>
            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Login")}
              >
                <View style={styles.iconContent}>
                  <MaterialIcons name="person" size={30} color="#000" />
                  <Text style={styles.iconLabel}>Tài Khoản</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={horizontalCards}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.boardInstruction}>
                <Image source={item.image} style={styles.imageInstruction} />
                <Text>{item.text}</Text>
              </View>
            )}
          />
        </View>
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
    backgroundColor: "#ebf7fa",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  imageInstruction: {
    width: 300,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  board: {
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    elevation: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  boardInstruction: {
    width: 300,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    paddingBottom: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
  },
  iconBox: {
    width: "30%",
    alignItems: "center",
    marginVertical: 12,
  },
  iconLabel: {
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  iconButton: {
    alignItems: "center",
    width: "100%",
  },
  iconContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
