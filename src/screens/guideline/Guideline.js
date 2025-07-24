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
const Guideline = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const guidelines = route.params?.guidelines;
  const author = {
    1: "Ban lý Metro",
  };
  // Thêm vào đầu component Guideline
  if (!guidelines) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy nội dung hướng dẫn.</Text>
      </View>
    );
  }

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
          {guidelines?.title}
        </Text>
      </View>
      {/* <Image source={guidelines.imageUrl} style={styles.detailImage} /> */}
      <Image
        source={
          guidelines?.imageUrl
            ? { uri: guidelines?.imageUrl }
            : require("../../assets/metro1.jpg") // Ảnh dự phòng
        }
        style={styles.detailImage}
      />
      <Text style={styles.detailSummary}>{guidelines?.summary}</Text>
      <View style={{ padding: 16 }}>
        {/* Thông tin tác giả và ngày đăng */}
        <View style={styles.metaInfo}>
          <Text style={styles.authorText}>Tác giả: {author[1]}</Text>
          <Text style={styles.timeText}>
            {formatDate(guidelines?.publishAt)}
          </Text>
        </View>

        <Text style={styles.detailContent}>{guidelines?.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#1976d2",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },

  // IMAGE
  detailImage: {
    width: "94%",
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 16,
  },

  // SUMMARY
  detailSummary: {
    fontSize: 20,
    color: "#444",
    marginTop: 16,
    marginHorizontal: 16,
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "bold",
  },

  // META INFO
  metaInfo: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  authorText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
  },
  timeText: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
  },

  // CONTENT
  detailContent: {
    fontSize: 16,
    color: "#222",
    lineHeight: 26,
    fontWeight: "400",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    textAlign: "justify",
  },
});

export default Guideline;
