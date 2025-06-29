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
  console.log("aaaaaaaaa", guidelines);
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
            : require("../../assets/metro.jpg") // Ảnh dự phòng
        }
        style={styles.detailImage}
      />
      <Text style={styles.detailContent}>{guidelines?.summary}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#1976d2",
  },
  backText: { color: "#fff", fontSize: 22, marginRight: 12 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  detailImage: { width: "100%", height: 180, resizeMode: "cover" },
  detailTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
    color: "#1976d2",
  },
  detailSubtitle: { color: "#555", fontSize: 16, marginVertical: 4 },
  detailTime: { color: "#1976d2", fontSize: 14, marginBottom: 8 },
  detailContent: { fontSize: 16, color: "#222", marginTop: 8 },
});

export default Guideline;
