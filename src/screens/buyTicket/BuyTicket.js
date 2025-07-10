import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import { Picker } from "@react-native-picker/picker";
import {
  readLinesAPI,
  readStartStationsByLineIdAPI,
  readTicketTypeAPI,
} from "../../apis";
import { useSelector } from "react-redux";
import TicketConfirmModal from "../../components/modal/TicketConfirmModal";

const ticketInfoByType = {
  "Vé ngày": {
    hsd: "24h kể từ thời điểm kích hoạt",
    note: "Tự động kích hoạt sau 30 ngày kể từ ngày mua vé",
  },
  "Vé tuần": {
    hsd: "7 ngày kể từ thời điểm kích hoạt",
    note: "Tự động kích hoạt sau 60 ngày kể từ ngày mua vé",
  },
  "Vé tháng": {
    hsd: "30 ngày kể từ thời điểm kích hoạt",
    note: "Tự động kích hoạt sau 180 ngày kể từ ngày mua vé",
  },
  "Vé năm": {
    hsd: "365 ngày kể từ thời điểm kích hoạt",
    note: "Tự động kích hoạt sau 360 ngày kể từ ngày mua vé",
  },
  "Vé tháng học sinh": {
    hsd: "30 ngày kể từ thời điểm kích hoạt",
    note: "Tự động kích hoạt sau 180 ngày kể từ ngày mua vé",
  },
};

const BuyTicket = () => {
  const navigation = useNavigation();
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(""); // khai báo để lấy được lineId để mà truyền xuống lấy station.
  const selectedLine = lines.find((line) => line.id === selectedLineId);
  // const sortedStations = [...stations].sort((a, b) => b.id - a.id); // sắp xếp lại id vì BE đặt id sai thứ tự
  const [ticketTypes, setTicketTypes] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const openConfirmModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const closeConfirmModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  const fetchTicketTypes = async () => {
    try {
      const response = await readTicketTypeAPI();
      if (!response || !response.result.data) {
        console.error("No data received from API");
        return;
      }
      setTicketTypes(response.result.data);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
    }
  };

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const featuredTicketNames = ["Vé ngày", "Vé tuần", "Vé tháng", "Vé năm"];
  const featuredTickets = ticketTypes.filter((ticket) =>
    featuredTicketNames.includes(ticket.name)
  );

  const studentTicket = ticketTypes.find(
    (ticket) => ticket.name === "Vé tháng học sinh"
  );

  const fetchLines = async () => {
    try {
      const response = await readLinesAPI();
      if (!response || !response.result.data) {
        console.error("No data received from API");
        return;
      }
      setLines(response.result.data);
    } catch (error) {
      console.error("Error fetching lines:", error);
    }
  };

  const fetchStations = async (lineId) => {
    try {
      const response = await readStartStationsByLineIdAPI(lineId);
      if (!response || !response.result) {
        console.error("No data received from API");
        return;
      }
      setStations(response.result);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  useEffect(() => {
    // Khi lines có dữ liệu, set selectedLineId và fetch stations
    if (lines.length > 0) {
      setSelectedLineId(lines[0].id);
    }
  }, [lines]);

  useEffect(() => {
    // Kiểm tra nếu có lineId r thì truyền tham số zô để lấy station
    if (selectedLineId) {
      fetchStations(selectedLineId);
    }
  }, [selectedLineId]);
  return (
    <>
      <ScrollView style={styles.container}>
        <Header name="Mua vé" />

        {/* Welcome */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>
            Chào mừng, {user?.username || "Người dùng"}!
          </Text>
          <Text style={styles.subWelcome}>
            Bắt đầu các trải nghiệm mới cùng Metro nhé!
          </Text>
        </View>

        {/* Nổi bật */}
        <Text style={styles.sectionTitle}>🔥 Nổi bật 🔥</Text>
        <View style={styles.ticketList}>
          {featuredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              onPress={() => openConfirmModal(ticket)}
            >
              <View style={styles.ticketItem}>
                <Text style={styles.ticketLabel}>{ticket.name}</Text>
                <Text style={styles.ticketPrice}>
                  {ticket.price.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ưu đãi Học sinh Sinh viên */}
        {studentTicket && (
          <>
            <Text style={styles.sectionTitle}>
              Ưu đãi Học sinh 🎒 Sinh viên 🎓
            </Text>
            <TouchableOpacity onPress={() => openConfirmModal(studentTicket)}>
              <View style={styles.ticketItem}>
                <Text style={styles.ticketLabel}>{studentTicket.name}</Text>
                <Text style={styles.ticketPrice}>
                  {studentTicket.price.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.sectionTitle}>Chọn tuyến đường:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLineId}
            onValueChange={(itemValue) => setSelectedLineId(itemValue)}
            style={styles.picker}
          >
            {lines.map((line) => (
              <Picker.Item key={line.id} label={line.name} value={line.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>
          Đã chọn: {selectedLine ? selectedLine.name : "Chưa chọn"}
        </Text>

        {/* Danh sách ga */}
        <View style={{ marginTop: 24, marginBottom: 50 }}>
          {stations.map((station) => (
            <View key={station.id} style={styles.stationRow}>
              <Text style={styles.stationText}>Đi từ ga {station.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BuyTurnTicket", {
                    // Truyền params ở đây
                    lineId: selectedLineId,
                    stationId: station.id,
                    stationName: station.name, // Truyền thêm tên ga để hiển thị trên header
                  })
                }
              >
                <Text style={styles.detailText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedTicket && (
        <TicketConfirmModal
          visible={modalVisible}
          onClose={closeConfirmModal}
          title={selectedTicket.name}
          infoRows={
            ticketInfoByType[selectedTicket.name]
              ? [
                  { label: "Loại vé: ", value: selectedTicket.name },
                  {
                    label: "HSD: ",
                    value: ticketInfoByType[selectedTicket.name].hsd,
                  },
                  {
                    label: "Lưu ý: ",
                    value: ticketInfoByType[selectedTicket.name].note,
                    isWarning: true,
                  },
                  {
                    label: "Mô tả: ",
                    value: selectedTicket.description,
                  },
                ]
              : []
          }
          price={`${selectedTicket.price.toLocaleString("vi-VN")} đ`}
          onBuy={() => {
            setModalVisible(false);
            navigation.navigate("Invoice", {
              ticketTypeId: selectedTicket.id,
              productName: selectedTicket.name,
              price: `${selectedTicket.price.toLocaleString("vi-VN")} đ`,
              quantity: 1,
              isDurationTicket: true,
            });
          }}
        />
      )}
    </>
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
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  pickerWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default BuyTicket;
