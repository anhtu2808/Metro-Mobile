import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const ticketOptions = [
  { label: "Vé 1 ngày", price: "40.000 đ" },
  { label: "Vé 3 ngày", price: "90.000 đ" },
  { label: "Vé tháng", price: "300.000 đ" },
];

const studentTicket = { label: "Vé tháng HSSV", price: "150.000 đ" };

const stations = [
  "Nhà hát Thành phố",
  "Ba Son",
  "Văn Thánh",
  "Tân Cảng",
  "Thảo Điền",
  "An Phú",
  "Rạch Chiếc",
  "Phước Long",
  "Bình Thái",
  "Thủ Đức",
  "Khu Công nghệ cao",
  "Đại học Quốc gia",
  // Thêm các ga khác nếu có
];

const BuyTicket = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Welcome */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcome}>Chào mừng, Nguyễn Sĩ Vạn Hào!</Text>
        <Text style={styles.subWelcome}>
          Bắt đầu các trải nghiệm mới cùng Metro nhé!
        </Text>
      </View>

      {/* Nổi bật */}
      <Text style={styles.sectionTitle}>🔥 Nổi bật 🔥</Text>
      <View style={styles.ticketList}>
        {ticketOptions.map((item, idx) => (
          <View key={idx} style={styles.ticketItem}>
            <Text style={styles.ticketLabel}>{item.label}</Text>
            <Text style={styles.ticketPrice}>{item.price}</Text>
          </View>
        ))}
      </View>

      {/* Ưu đãi Học sinh Sinh viên */}
      <Text style={styles.sectionTitle}>Ưu đãi Học sinh 🎒 Sinh viên 🎓</Text>
      <View style={styles.ticketItem}>
        <Text style={styles.ticketLabel}>{studentTicket.label}</Text>
        <Text style={styles.ticketPrice}>{studentTicket.price}</Text>
      </View>

      {/* Danh sách ga */}
      <View style={{ marginTop: 24, marginBottom: 50 }}>
        {stations.map((station, idx) => (
          <View key={idx} style={styles.stationRow}>
            <Text style={styles.stationText}>Đi từ ga {station}</Text>
            <TouchableOpacity>
              <Text style={styles.detailText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ebf7fa",
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 20,
    elevation: 2,
  },
  welcome: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subWelcome: {
    color: "#888",
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 12,
  },
  ticketList: {
    marginBottom: 8,
  },
  ticketItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  ticketLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  ticketPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007aff",
  },
  stationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  stationText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "bold",
  },
  detailText: {
    color: "#007aff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default BuyTicket;
