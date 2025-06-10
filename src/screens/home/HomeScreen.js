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
import { useSelector } from "react-redux";

const newsList = [
  {
    id: "1",
    title: "Chương trình đồng hành tặng vé Metro cho học sinh...",
    subtitle: "HCMC METRO- Hành trình kết nối yêu thương",
    time: "một ngày trước",
    image: require("../../assets/metro.jpg"),
    content: "Dự án Hỗ trợ vé đi tàu cho đối tượng có hoàn cảnh khó khăn...",
  },
  {
    id: "2",
    title: "Metro miễn phí vé hai ngày – Tri ân lịch sử...",
    subtitle: "Miễn phí vé tuyến Metro Số 1 trong hai ngày 30/4 & 01/5/2025...",
    time: "khoảng 1 tháng trước",
    image: require("../../assets/metro.jpg"),
    content: "Miễn phí vé tuyến Metro Số 1 trong hai ngày 30/4 & 01/5/2025...",
  },
  {
    id: "3",
    title: "HCMC Metro tổ chức ngày hội trải nghiệm tuyến số 1",
    subtitle: "Cơ hội trải nghiệm thực tế trước ngày vận hành chính thức",
    time: "2 tuần trước",
    image: require("../../assets/metro.jpg"),
    content:
      "Người dân TP.HCM được mời trải nghiệm miễn phí tuyến Metro Số 1 với nhiều hoạt động hấp dẫn như tham quan, chụp hình và giao lưu với nhân viên vận hành.",
  },
  {
    id: "4",
    title: "Tuyến Metro Số 1 hoàn tất giai đoạn chạy thử",
    subtitle: "Chuẩn bị bước vào vận hành thương mại",
    time: "3 ngày trước",
    image: require("../../assets/metro.jpg"),
    content:
      "Sau nhiều tháng thử nghiệm, tuyến Metro Số 1 đã hoàn tất các bài kiểm tra kỹ thuật và sẵn sàng vận hành chính thức vào quý 3 năm 2025.",
  },
  {
    id: "5",
    title: "Metro TP.HCM ký kết hợp tác phát triển du lịch xanh",
    subtitle: "Hướng tới thành phố bền vững và thân thiện với môi trường",
    time: "1 tuần trước",
    image: require("../../assets/metro.jpg"),
    content:
      "Ban quản lý Metro TP.HCM phối hợp cùng Sở Du lịch triển khai chương trình tour kết hợp sử dụng Metro, thúc đẩy hình ảnh thành phố năng động và xanh.",
  },
];

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
  const { user, isAuthenticated } = useSelector((state) => state.user);
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

          {/* Tin tức */}
          <View style={styles.newsHeaderRow}>
            <Text style={styles.newsSectionTitle}>Tin tức</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("News", { newsList })}
            >
              <Text style={styles.allText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newsList}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.newsCard}
                onPress={() =>
                  navigation.navigate("NewsDetail", { news: item })
                }
              >
                <Image source={item.image} style={styles.newsImage} />
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.newsTime}>{item.time}</Text>
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
