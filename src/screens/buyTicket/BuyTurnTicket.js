import React, { useEffect, useState } from "react";
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
import TicketConfirmModal from "../../components/modal/TicketConfirmModal";
import { readEndStationByLineIdStationIdAPI } from "../../apis";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const BuyTurnTicket = ({ route }) => {
  const { lineId, stationId, stationName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigation = useNavigation();
  const [endStations, setEndStations] = useState([]);

  const fetchEndStations = async (lineId, StationId) => {
    try {
      const response = await readEndStationByLineIdStationIdAPI(
        lineId,
        StationId
      );
      if (!response || !response.result) {
        console.log("No data recieved from API");
        return;
      }
      setEndStations(response.result);
    } catch (error) {
      console.error("Error fetching endStaions:", error);
    }
  };

  useEffect(() => {
    if (lineId && stationId) {
      fetchEndStations(lineId, stationId);
    }
  }, [lineId, stationId]);

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
        <FontAwesome5
          name="ticket-alt"
          size={30}
          color="#1976d2"
          style={{ marginRight: 30 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.stationName}>Đến ga {item.name}</Text>
          <Text style={styles.price}>{item.fare} đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const fareTicket = selectedStation?.fare + " đ";
  return (
    <View style={styles.container}>
      <Header name={`Vé lượt - Đi từ ga ${stationName}`} />

      <FlatList // dùng FlatList thì đã có thuộc tính data, nếu muốn .map ra từng đối tượng thì dùng ScrollView hoặc View
        data={endStations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {selectedStation && (
        <TicketConfirmModal
          visible={modalVisible}
          onClose={closeModal}
          title={selectedStation.name}
          infoRows={[
            { label: "Loại vé: ", value: "Vé lượt" },
            { label: "HSD: ", value: "24h kể từ thời điểm kích hoạt" },
            {
              label: "Lưu ý: ",
              value: "Vé sử dụng một lần",
              isWarning: true,
            },
            {
              label: "Mô tả: ",
              value: `${stationName} - ${selectedStation.name}`,
            },
          ]}
          price={`${selectedStation.fare.toLocaleString("vi-VN")} đ`}
          onBuy={() => {
            setModalVisible(false);
            navigation.navigate("Invoice", {
              ticketTypeId: 1, // vé lượt fix cứng
              lineId: lineId,
              startStationId: stationId,
              endStationId: selectedStation.id,
              productName: `${stationName} - ${selectedStation.name}`,
              price: `${selectedStation.fare.toLocaleString("vi-VN")} đ`,
              quantity: 1,
              isDurationTicket: false,
            });
          }}
        />
      )}
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
