import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../components/formatDate/formatters";
const NewsDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const news = route.params?.newsItem;
  const author = {
    1: "Ban lý Metro",
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ebf7fa" }}>
      <View style={styles.header}>
        {/* Nút Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {news?.title}
        </Text>
      </View>
      {/* <Image source={news.imageUrl} style={styles.detailImage} /> */}
      {/* <Image
        source={
          news.imageUrl
            ? { uri: news.imageUrl }
            : require("../../assets/metro.jpg") // Ảnh dự phòng
        }
        style={styles.detailImage}
      /> */}
      <Image
        source={require("../../assets/news.jpg")}
        style={styles.detailImage}
      />
      <Text style={styles.detailSummary}>{news?.summary}</Text>
      <View style={{ padding: 16 }}>
        {/* Thông tin tác giả và ngày đăng */}
        <View style={styles.metaInfo}>
          <Text style={styles.authorText}>Tác giả: {author[1]}</Text>
          <Text style={styles.timeText}>{formatDate(news.publishAt)}</Text>
        </View>

        <Text style={styles.detailContent}>{news?.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#1976d2",
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  detailImage: {
    width: "94%",
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 16,
  },
  detailSummary: {
    fontSize: 20,
    color: "#444",
    marginTop: 16,
    marginHorizontal: 16,
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  metaInfo: {
    marginTop: 12,
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    color: "#555",
  },
  detailContent: {
    fontSize: 16,
    color: "#222",
    lineHeight: 26,
    fontWeight: "400",
    textAlign: "justify",
  },
});

export default NewsDetail;
