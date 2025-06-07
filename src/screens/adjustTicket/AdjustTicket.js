import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import TicketConfirmModal from "../../components/modal/TicketConfirmModal";

const metroLines = [
  {
    id: "1",
    name: "Tuyến 1: Bến Thành - Suối Tiên",
    stations: [
      "Bến Thành",
      "Nhà hát Thành phố",
      "Ba Son",
      "Văn Thánh",
      "Tân Cảng",
      "Thảo Điền",
      "An Phú",
      "Rạch Chiếc",
      "Phước Long",
      "Bình Thái",
      "Suối Tiên",
    ],
  },
  {
    id: "2",
    name: "Tuyến 2: Bến Thành - Tham Lương",
    stations: [
      "Bến Thành",
      "Dân Chủ",
      "Hòa Hưng",
      "Lê Thị Riêng",
      "Phạm Văn Bạch",
      "Tân Bình",
      "Tân Phú",
      "Tham Lương",
    ],
  },
];

const windowWidth = Dimensions.get("window").width;

const AdjustTicket = () => {
  const [selectedLine, setSelectedLine] = useState(metroLines[0].id);
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const currentLine = metroLines.find((line) => line.id === selectedLine);
  const stations = currentLine ? currentLine.stations : [];
  const endStations = stations.filter((s) => s !== startStation);

  const onChangeLine = (lineId) => {
    setSelectedLine(lineId);
    setStartStation("");
    setEndStation("");
  };

  // Tính giá vé mẫu (bạn có thể thay logic tính giá theo thực tế)
  const getPrice = () => {
    if (!startStation || !endStation) return "";
    const startIdx = stations.indexOf(startStation);
    const endIdx = stations.indexOf(endStation);
    const numStations = Math.abs(endIdx - startIdx);
    if (numStations <= 3) return "6.000 đ";
    if (numStations <= 6) return "8.000 đ";
    return "10.000 đ";
  };

  return (
    <View style={styles.container}>
      <Header name="Điều chỉnh giá vé" />

      {/* Select tuyến metro */}
      <Text style={styles.label}>Chọn tuyến đường metro</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedLine}
          onValueChange={onChangeLine}
          style={styles.picker}
        >
          {metroLines.map((line) => (
            <Picker.Item label={line.name} value={line.id} key={line.id} />
          ))}
        </Picker>
      </View>

      {/* Select ga đầu */}
      <Text style={styles.label}>Chọn trạm ga điểm đầu</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={startStation}
          onValueChange={(val) => {
            setStartStation(val);
            if (val === endStation) setEndStation("");
          }}
          style={styles.picker}
        >
          <Picker.Item label="Chọn ga điểm đầu" value="" />
          {stations.map((station) => (
            <Picker.Item label={station} value={station} key={station} />
          ))}
        </Picker>
      </View>

      {/* Select ga cuối */}
      <Text style={styles.label}>Chọn trạm ga điểm cuối</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={endStation}
          onValueChange={setEndStation}
          style={styles.picker}
          enabled={!!startStation}
        >
          <Picker.Item label="Chọn ga điểm cuối" value="" />
          {endStations.map((station) => (
            <Picker.Item label={station} value={station} key={station} />
          ))}
        </Picker>
      </View>

      {/* Hiển thị kết quả chọn */}
      {startStation && endStation ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Bạn chọn: {startStation} → {endStation} ({currentLine.name})
          </Text>
        </View>
      ) : null}

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={[
          styles.payButton,
          !(startStation && endStation) && { backgroundColor: "#B0B0B0" },
        ]}
        disabled={!(startStation && endStation)}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.payButtonText}>Thanh toán</Text>
      </TouchableOpacity>

      <TicketConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`${startStation} → ${endStation}`}
        infoRows={[
          { label: "Tuyến: ", value: currentLine.name },
          { label: "Loại vé: ", value: `${startStation} → ${endStation}` },
          { label: "Giá vé: ", value: getPrice() },
          {
            label: "Lưu ý: ",
            value: "Vé có hiệu lực 24h kể từ khi kích hoạt",
            isWarning: true,
          },
        ]}
        price={getPrice()}
        onBuy={() => {
          setModalVisible(false);
          navigation.navigate("Invoice", {
            ticket: {
              name: `${startStation} → ${endStation}`,
              price: getPrice(),
              line: currentLine.name,
            },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ebf7fa", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D2E82",
    marginBottom: 20,
  },
  label: { fontSize: 16, color: "#222", marginTop: 16, marginBottom: 4 },
  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 4,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  payButton: {
    backgroundColor: "#1976d2",
    borderRadius: 22,
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 28,
    elevation: 2,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
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
  labelInfo: {
    fontWeight: "bold",
    color: "#1976d2",
    fontSize: 16,
    minWidth: 78,
  },
  valueInfo: {
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
  resultBox: {
    backgroundColor: "#E3F0FF",
    borderRadius: 12,
    marginTop: 28,
    padding: 16,
    alignItems: "center",
  },
  resultText: { color: "#2D2E82", fontSize: 16, fontWeight: "500" },
});

export default AdjustTicket;
