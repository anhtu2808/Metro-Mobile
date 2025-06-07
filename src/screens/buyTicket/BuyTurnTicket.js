import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import Header from "../../components/header/Header";
import { useNavigation } from "@react-navigation/native";

const stations = [
  { name: "Đến Nhà hát Thành phố", price: "6.000 đ" },
  { name: "Đến Ba Son", price: "6.000 đ" },
  { name: "Đến Văn Thánh", price: "6.000 đ" },
  { name: "Đến Tân Cảng", price: "6.000 đ" },
  { name: "Đến Thảo Điền", price: "6.000 đ" },
  { name: "Đến An Phú", price: "6.000 đ" },
  { name: "Đến Rạch Chiếc", price: "8.000 đ" },
  { name: "Đến Phước Long", price: "8.000 đ" },
  { name: "Đến Bình Thái", price: "8.000 đ" },
];

const BuyTurnTicket = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigation = useNavigation();

  const openModal = (item) => {
    setSelectedStation(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStation(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.ticketCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.stationName}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header name="Vé lượt - Đi từ ga Bến Thành" />

      <FlatList // dùng FlatList thì đã có thuộc tính data, nếu muốn .map ra từng đối tượng thì dùng ScrollView hoặc View
        data={stations}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal hiển thị popup vé */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedStation?.name}</Text>
            <View style={styles.ticketInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Loại vé: </Text>
                <Text style={styles.value}>{selectedStation?.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>HSD: </Text>
                <Text style={styles.value}>24h kể từ thời điểm kích hoạt</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelRed}>Lưu ý: </Text>
                <Text style={styles.valueRed}>
                  Tự động kích hoạt sau 30 ngày kể từ ngày mua vé
                </Text>
              </View>
            </View>
            <View style={styles.dashedLineContainer}>
              <View style={styles.circleLeft} />
              <View style={styles.dashedLine} />
              <View style={styles.circleRight} />
            </View>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() =>
                navigation.navigate("Invoice", { ticket: selectedStation })
              }
            >
              <Text style={styles.buyButtonText}>
                Mua ngay: {selectedStation?.price}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
  },
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: "#1976d2",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: windowWidth * 0.92,
    backgroundColor: "#f7fbff",
    borderRadius: 28,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 18,
    shadowColor: "#1976d2",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    borderWidth: 1.5,
    borderColor: "#1976d2",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: "center",
  },
  ticketInfo: {
    width: "100%",
    backgroundColor: "#eaf6ff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    color: "#1976d2",
    fontSize: 16,
    minWidth: 78,
  },
  value: {
    color: "#1a237e",
    fontSize: 16,
    flexShrink: 1,
  },
  labelRed: {
    fontWeight: "bold",
    color: "#e53935",
    fontSize: 16,
    minWidth: 78,
  },
  valueRed: {
    color: "#e53935",
    fontSize: 16,
    flexShrink: 1,
  },
  dashedLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
    justifyContent: "center",
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#1976d2",
    marginHorizontal: 2,
  },
  circleLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f7fbff",
    borderWidth: 2,
    borderColor: "#1976d2",
    marginRight: -9,
    zIndex: 1,
  },
  circleRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f7fbff",
    borderWidth: 2,
    borderColor: "#1976d2",
    marginLeft: -9,
    zIndex: 1,
  },
  buyButton: {
    backgroundColor: "#1976d2",
    borderRadius: 22,
    width: "96%",
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 2,
    elevation: 2,
    shadowColor: "#1976d2",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default BuyTurnTicket;
