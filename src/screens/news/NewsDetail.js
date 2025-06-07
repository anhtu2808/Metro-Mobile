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

const NewsDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const news = route.params?.news;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {news?.title}
        </Text>
      </View>
      <Image source={news.image} style={styles.detailImage} />
      <View style={{ padding: 16 }}>
        <Text style={styles.detailTitle}>{news?.title}</Text>
        <Text style={styles.detailSubtitle}>{news?.subtitle}</Text>
        <Text style={styles.detailTime}>{news?.time}</Text>
        <Text style={styles.detailContent}>{news?.content}</Text>
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", flex: 1 },
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

export default NewsDetail;
