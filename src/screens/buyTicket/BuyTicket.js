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
  readStationsAPI,
} from "../../apis";

const ticketOptions = [
  { label: "Vé 1 ngày", price: "40.000 đ" },
  { label: "Vé 3 ngày", price: "90.000 đ" },
  { label: "Vé tháng", price: "300.000 đ" },
];

const studentTicket = { label: "Vé tháng HSSV", price: "150.000 đ" };

const BuyTicket = () => {
  const navigation = useNavigation();
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(""); // khai báo để lấy được lineId để mà truyền xuống lấy station.
  const selectedLine = lines.find((line) => line.id === selectedLineId);
  const sortedStations = [...stations].sort((a, b) => b.id - a.id); // sắp xếp lại id vì BE đặt id sai thứ tự

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
      console.log("API station response:", response.result); // Thêm dòng này
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
    if (selectedLineId) {
      fetchStations(selectedLineId);
    }
  }, [selectedLineId]);

  console.log("linessssssssssssssssssssssssss:", selectedLine);
  console.log("stationsssssssssssssssssssssss:", stations);
  return (
    <ScrollView style={styles.container}>
      <Header name="Mua vé" />

      {/* Welcome */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcome}>Chào mừng, Nguyễn Sĩ Vạn Hào!</Text>
        <Text style={styles.subWelcome}>
          Bắt đầu các trải nghiệm mới cùng Metro nhé!
        </Text>
      </View>

      <Text style={styles.label}>Chọn tuyến đường:</Text>
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
        {sortedStations.map((station) => (
          <View key={station.id} style={styles.stationRow}>
            <Text style={styles.stationText}>Đi từ ga {station.name}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("BuyTurnTicket")}
            >
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
