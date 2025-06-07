import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/header/Header";

const News = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const newsList = route.params?.newsList || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#ebf7fa" }}>
      <Header name="Tin tức" />
      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Tìm kiếm</Text>
      </View>
      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsListItem}
            onPress={() => navigation.navigate("NewsDetail", { news: item })}
          >
            <Image source={item.image} style={styles.newsListImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.newsListTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsListSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
              <Text style={styles.newsListTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1976d2",
  },
  backText: { color: "#fff", fontSize: 22, marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  searchBox: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    padding: 8,
  },
  searchText: { color: "#888", fontSize: 16 },
  newsListItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    padding: 10,
  },
  newsListImage: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  newsListTitle: { fontWeight: "bold", fontSize: 16, color: "#222" },
  newsListSubtitle: { color: "#555", fontSize: 14 },
  newsListTime: { color: "#1976d2", fontSize: 13, marginTop: 2 },
});

export default News;
