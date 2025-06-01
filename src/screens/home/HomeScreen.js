import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
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
          <Image
            source={require("../../assets/metro.jpg")}
            style={styles.image}
          />
          <View style={styles.board}>
            <View style={styles.iconBox}>
              <MaterialIcons name="local-atm" size={30} color="#000" />
              <Text style={styles.iconLabel}>Buy Ticket</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons
                name="confirmation-number"
                size={30}
                color="#000"
              />
              <Text style={styles.iconLabel}>My Ticket</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="sync" size={30} color="#000" />
              <Text style={styles.iconLabel}>Adjust Ticket</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="tram" size={30} color="#000" />
              <Text style={styles.iconLabel}>Route</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="map" size={30} color="#000" />
              <Text style={styles.iconLabel}>Map</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialIcons name="person" size={30} color="#000" />
              <Text style={styles.iconLabel}>Account</Text>
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
});
