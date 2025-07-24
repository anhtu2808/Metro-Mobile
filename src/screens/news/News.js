import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput, // Thêm TextInput
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/header/Header";
import { formatDate } from "../../components/formatDate/formatters";
import { Ionicons } from "@expo/vector-icons"; // Thêm để có icon

const News = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const newsList = route.params?.Allnews || [];
  const [search, setSearch] = useState("");

  // Dùng useMemo để tối ưu hiệu suất, chỉ lọc lại khi cần
  const filteredNews = useMemo(() => {
    if (!search) {
      return newsList;
    }
    return newsList.filter((news) =>
      news.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, newsList]);

  return (
    <View style={styles.container}>
      <Header name="Tin tức" />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tiêu đề..." // Sửa placeholder
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
      </View>
      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id.toString()} // Sửa: Dùng .toString()
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsListItem}
            onPress={() =>
              navigation.navigate("NewsDetail", { newsItem: item })
            } // Sửa: Truyền key là newsItem cho rõ ràng
          >
            <Image
              source={
                item.imageUrl
                  ? { uri: item.imageUrl } // Sửa: Dùng { uri: ... }
                  : require("../../assets/news.jpg") // Ảnh dự phòng
              }
              style={styles.newsListImage}
            />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsListTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsListTime}>
                {formatDate(item.publishAt)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        // Thêm thông báo khi không có kết quả
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy tin tức nào.</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 15,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  newsListItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    padding: 10,
  },
  newsListImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  newsTextContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  newsListTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  newsListTime: {
    color: "#007aff",
    fontSize: 13,
    alignSelf: "flex-end",
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default News;
