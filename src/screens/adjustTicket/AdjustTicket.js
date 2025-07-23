import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getTicketOrdersAPI, readEndStationByLineIdStationIdAPI, createAdjustmentFare } from "../../apis";
import { Picker } from "@react-native-picker/picker";
import { WebView } from "react-native-webview";
import Header from "../../components/header/Header";

const AdjustTicket = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedEndStationId, setSelectedEndStationId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State hiển thị WebView thanh toán
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Lấy vé lượt hợp lệ
  const fetchTickets = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = {
        page: 1,
        size: 20,
        userId: user.id,
      };
      const res = await getTicketOrdersAPI(data);
      if (res?.result?.data) {
        const filteredTickets = res.result.data.filter(
          (t) =>
            ["INACTIVE", "ACTIVE", "USING"].includes(t.status) &&
            t.ticketType?.name?.toLowerCase().includes("vé lượt")
        );
        setTickets(filteredTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy các trạm kết thúc hợp lệ cho vé đã chọn
  const fetchEndStations = async (lineId, startStationId) => {
    if (!lineId || !startStationId) {
      setStations([]);
      return;
    }
    try {
      const res = await readEndStationByLineIdStationIdAPI(lineId, startStationId);
      if (Array.isArray(res?.result) && res.result.length > 0) {
        setStations(res.result);
      } else {
        setStations([]);
      }
    } catch (error) {
      console.error("Error fetching end stations:", error);
      setStations([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.id]);

  useEffect(() => {
    if (selectedTicket) {
      const lineId = selectedTicket.lineId;
      const startStationId = selectedTicket.startStation?.id;
      if (!lineId) {
        Alert.alert(
          "Không xác định được tuyến (line) của vé này.",
          "Dữ liệu vé của bạn thiếu thông tin tuyến. Vui lòng liên hệ hỗ trợ hoặc chọn vé khác."
        );
        setStations([]);
        setSelectedEndStationId(null);
        return;
      }
      if (!startStationId) {
        Alert.alert(
          "Không xác định được ga xuất phát của vé này.",
          "Dữ liệu vé của bạn thiếu thông tin ga xuất phát. Vui lòng liên hệ hỗ trợ hoặc chọn vé khác."
        );
        setStations([]);
        setSelectedEndStationId(null);
        return;
      }
      fetchEndStations(lineId, startStationId);
      setSelectedEndStationId(null);
    } else {
      setStations([]);
      setSelectedEndStationId(null);
    }
  }, [selectedTicket]);

  // Xử lý điều chỉnh vé và hiển thị WebView thanh toán
  const handleAdjustFare = async () => {
    if (!selectedTicket) {
      Alert.alert("Lỗi", "Bạn chưa chọn vé.");
      return;
    }
    if (!selectedEndStationId) {
      Alert.alert("Lỗi", "Vui lòng chọn trạm kết thúc mới.");
      return;
    }

    if (!stations.find((s) => s.id === selectedEndStationId)) {
      Alert.alert("Lỗi", "Trạm kết thúc chọn không hợp lệ");
      return;
    }

    setSubmitting(true);
    try {
      const ticketOrderId = selectedTicket.id;
      const newEndStationId = selectedEndStationId;
      const res = await createAdjustmentFare(ticketOrderId, newEndStationId);

      if (res?.code === 200) {
        if (res?.result?.vnPayResponse?.paymentUrl) {
          // Mở WebView thanh toán thông thường
          setPaymentUrl(res.result.vnPayResponse.paymentUrl);
          setShowPaymentModal(true);
        } else {
          fetchTickets();
          setSelectedTicket(null);
          setSelectedEndStationId(null);
          navigation.navigate("PaymentSuccessScreen");
        }
      } else {
        Alert.alert("Lỗi", res?.message || "Không thể tạo đơn điều chỉnh vé.");
      }
    } catch (error) {
      console.error("Error adjust fare:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi2",
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle điều hướng WebView theo url
  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url;
    // TODO: Thay chuỗi này theo callback url backend báo thành công/thất bại thực tế của VNPay
    if (url.includes("payment-success")) {
      setShowPaymentModal(false);
      navigation.navigate("PaymentSuccessScreen");
      // Reload vé sau khi thanh toán thành công
      fetchTickets();
      setSelectedTicket(null);
      setSelectedEndStationId(null);
    } else if (url.includes("payment-failure")) {
      setShowPaymentModal(false);
      Alert.alert("Thanh toán thất bại", "Vui lòng thử lại.");
    }
  };

  // Render từng vé trong FlatList
  const renderItem = ({ item }) => {
    let statusText = "";
    let statusStyle = {};
    switch (item.status) {
      case "ACTIVE":
        statusText = "Đã kích hoạt";
        statusStyle = styles.statusActive;
        break;
      case "USING":
        statusText = "Đang sử dụng";
        statusStyle = styles.statusUsing;
        break;
      case "INACTIVE":
        statusText = "Chưa sử dụng";
        statusStyle = styles.statusInactive;
        break;
      default:
        statusText = item.status;
        statusStyle = {};
    }

    return (
      <TouchableOpacity
        style={[
          styles.ticketBox,
          selectedTicket?.id === item.id && styles.ticketBoxSelected,
        ]}
        onPress={() => setSelectedTicket(item)}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.ticketTitle}>{item.ticketType?.name || "Vé 1 ngày"}</Text>
          <Text style={[styles.statusBase, statusStyle]}>{statusText}</Text>
        </View>
        <Text style={styles.ticketTime}>
          {new Date(item.purchaseDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
          {new Date(item.purchaseDate).toLocaleDateString()}
        </Text>
        <View>
        <Text>
              {item.startStation?.name} → {item.endStation?.name}
          </Text>
        <View style={{ height: 10 }} />
        <Text style={styles.ticketPrice}>{item.price?.toLocaleString("vi-VN")} đ</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header name="Điều chỉnh vé" />
      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : tickets.length === 0 ? (
        <Text style={styles.emptyText}>Bạn không có vé lượt nào phù hợp.</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {selectedTicket && (
        <>
          <Text style={styles.title}>Chọn trạm kết thúc mới</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEndStationId}
              onValueChange={(val) => setSelectedEndStationId(val)}
              style={styles.picker}
            >
              <Picker.Item label="-- Chọn trạm --" value={null} />
              {stations.map((station) => (
                <Picker.Item key={station.id} label={station.name} value={station.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleAdjustFare}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Điều chỉnh vé & Thanh toán</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <Modal visible={showPaymentModal} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPaymentModal(false)}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontSize: 16 }}
            >
              Đóng
            </Text>
          </TouchableOpacity>
          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              startInLoadingState
              style={{ flex: 1 }}
            />
          ) : (
            <ActivityIndicator size="large" style={{ flex: 1 }} />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1976d2",
    marginVertical: 8,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  ticketBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 6,
    marginHorizontal: 0,
    minHeight: 65,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#dfe8ef",
  },
  ticketBoxSelected: {
    borderWidth: 2,
    borderColor: "#1976d2",
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  statusBase: {
    fontSize: 13,
    fontWeight: "600",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: "hidden", // fix border radius
    marginLeft: 6,
    minWidth: 56,
    textAlign: "center",
  },
  statusUsing: {
    backgroundColor: "#e8f5e9",
    color: "#388e3c",
  },
  statusActive: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  },
  statusInactive: {
    backgroundColor: "#dedfe0",
    color: "#97999c",
  },
  ticketTime: {
    fontSize: 13,
    color: "#8b909a",
    marginTop: 4,
  },
  ticketPrice: {
    position: "absolute",
    right: 14,
    bottom: 12,
    fontWeight: "bold",
    fontSize: 16,
    color: "#1a1a1a",
  },
  pickerContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0a7d6",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  closeButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    margin: 12,
    borderRadius: 10,
  },
});

export default AdjustTicket;
