import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator, // Thêm để hiển thị loading
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { readContentAPI } from "../../apis";
import { formatDate } from "../../components/formatDate/formatters";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // 1. Tách state cho news và guidelines
  const [news, setNews] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        // Fetch News
        const newsResponse = await readContentAPI("NEWS");
        if (newsResponse && newsResponse.data) {
          setNews(newsResponse.data);
        }

        // Fetch Guidelines
        const guidelineResponse = await readContentAPI("GUIDELINE");
        if (guidelineResponse && guidelineResponse.data) {
          setGuidelines(guidelineResponse.data);
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false); // Dừng loading sau khi fetch xong
      }
    };
    fetchAllContent();
  }, []);

  // 3. Sửa lại renderItem cho Hướng dẫn sử dụng
  const renderGuidelineItem = ({ item }) => (
    <View style={styles.boardInstruction}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Guideline", { guidelines: item })}
      >
        {/* 4. Sửa lại Image source để dùng URL từ API */}
        <Image
          source={{ uri: item.imageUrl }} // Giả sử API trả về trường 'imageUrl'
          style={styles.imageInstruction}
        />
        <Text style={styles.guidelineTitle}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  // Hiển thị loading nếu chưa có dữ liệu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

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
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("AdjustTicket")}
              >
                <View style={styles.iconContent}>
                  <MaterialIcons name="sync" size={30} color="#000" />
                  <Text style={styles.iconLabel}>Điều Chỉnh Giá Vé</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Route")}
              >
                <View style={styles.iconContent}>
                  <MaterialIcons name="tram" size={30} color="#000" />
                  <Text style={styles.iconLabel}>Hành Trình</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconBox}>
              <MaterialIcons name="chat" size={30} color="#000" />
              <Text style={styles.iconLabel}>Nhận xét</Text>
            </View>

            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  if (isAuthenticated) {
                    navigation.navigate("Account");
                  } else {
                    navigation.navigate("Login");
                  }
                }}
              >
                <View style={styles.iconContent}>
                  <MaterialIcons name="person" size={30} color="#000" />
                  <Text style={styles.iconLabel}>Tài Khoản</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hướng dẫn sử dụng */}
          <FlatList
            data={guidelines}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderGuidelineItem}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
          />

          {/* Tin tức */}
          <View style={styles.newsHeaderRow}>
            <Text style={styles.newsSectionTitle}>Tin tức</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("News", { Allnews: news })}
            >
              <Text style={styles.allText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={news}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.newsCard}
                onPress={() =>
                  navigation.navigate("NewsDetail", { newsItem: item })
                }
              >
                <Image source={item.imageUrl} style={styles.newsImage} />
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.newsTime}>
                  {formatDate(item.publishAt) || "mới đây"}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
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
    marginTop: 20,
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
  newsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 4,
  },
  newsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  allText: {
    color: "#1976d2",
    fontSize: 15,
    fontWeight: "bold",
  },
  guidelineTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginLeft: 20,
  },
  newsCard: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    elevation: 2,
  },
  newsImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  newsTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  newsTime: {
    color: "#1976d2",
    fontSize: 12,
    marginTop: 2,
  },
});
