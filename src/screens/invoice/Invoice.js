import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import { createTicketOrderAPI, createPaymentAPI } from "../../apis";
import { WebView } from "react-native-webview";

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

const Invoice = ({ route }) => {
  const navigation = useNavigation();
  const {
    ticketTypeId,
    lineId,
    startStationId,
    endStationId,
    productName,
    price,
    quantity,
    isDurationTicket,
  } = route.params;

  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentMethodModalVisible, setPaymentMethodModalVisible] =
    useState(false);
  const webviewRef = useRef(null);

  // Xử lý thanh toán
  const handlePay = async () => {
    if (!paymentMethod) {
      Alert.alert("Vui lòng chọn phương thức thanh toán");
      return;
    }
    setLoadingPay(true);
    try {
      // 1. Tạo đơn hàng
      const data = { ticketTypeId };
      if (!isDurationTicket) {
        data.lineId = lineId;
        data.startStationId = startStationId;
        data.endStationId = endStationId;
      }
      const response = await createTicketOrderAPI(data);
      if (!response?.result?.id) {
        Alert.alert("Lỗi tạo đơn hàng");
        setLoadingPay(false);
        return;
      }
      const ticketOrderId = response.result.id;

      // 2. Gọi API lấy paymentUrl
      const url = await createPaymentAPI(ticketOrderId);
      if (!url) {
        Alert.alert("Không lấy được link thanh toán VNPay");
        setLoadingPay(false);
        return;
      }
      setPaymentUrl(url);
      setPaymentModal(true);
    } catch (error) {
      Alert.alert("Thanh toán thất bại, vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoadingPay(false);
    }
  };

  // Theo dõi URL trong WebView để biết khi nào thanh toán thành công
  const onWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    // Nếu backend redirect về URL thành công, bạn cần thay đổi điều kiện dưới đây cho đúng
    if (url.includes("vnpay-callback") || url.includes("payment-success")) {
      setPaymentModal(false);

      // Alert.alert("Thanh toán thành công!", "", [
      //   { text: "Xác nhận", onPress: () => navigation.navigate("Home") },
      // ]);
      navigation.navigate("PaymentSuccessScreen");
    }
  };

  const infoRows = isDurationTicket
    ? [
        { label: "Loại vé: ", value: productName },
        { label: "HSD: ", value: ticketInfoByType[productName]?.hsd || "" },
        {
          label: "Lưu ý: ",
          value: ticketInfoByType[productName]?.note || "",
          isWarning: true,
        },
        { label: "Mô tả: ", value: productName },
      ]
    : [
        { label: "Loại vé: ", value: "Vé lượt" },
        { label: "HSD: ", value: "24h kể từ thời điểm kích hoạt" },
        { label: "Lưu ý: ", value: "Vé sử dụng một lần", isWarning: true },
        { label: "Mô tả: ", value: productName },
      ];

  return (
    <View style={styles.container}>
      <Header name="Thông tin đơn hàng" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Phương thức thanh toán */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={styles.paymentBox}
          onPress={() => setPaymentMethodModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.paymentRow}>
            {paymentMethod ? (
              <View style={styles.vnpayIcon}>
                <Text style={styles.vnpayIconText}>
                  {paymentMethod === "vnpay"
                    ? "VN"
                    : paymentMethod.toUpperCase()}
                </Text>
              </View>
            ) : (
              <Ionicons name="card-outline" size={24} color="#2D2E82" />
            )}
            <Text style={styles.paymentText}>
              {paymentMethod
                ? `Phương thức: ${paymentMethod.toUpperCase()}`
                : "Chọn phương thức thanh toán"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#2D2E82" />
        </TouchableOpacity>

        {/* Thông tin thanh toán */}
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sản phẩm:</Text>
            <Text style={styles.infoValue}>Vé lượt: {productName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đơn giá:</Text>
            <Text style={styles.infoValue}>{price}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số lượng:</Text>
            <Text style={styles.infoValue}>{quantity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thành tiền:</Text>
            <Text style={styles.infoValue}>{price}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng giá tiền:</Text>
            <Text style={styles.infoValue}>{price}</Text>
          </View>
        </View>

        {/* Thông tin vé */}
        <Text style={styles.sectionTitle}>Thông tin Vé: {productName}</Text>
        <View style={styles.infoBox}>
          {infoRows.map((row, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: row.isWarning ? "#e53935" : "#1976d2",
                  width: 100,
                }}
              >
                {row.label}
              </Text>
              <Text
                style={{
                  color: row.isWarning ? "#e53935" : "#222",
                  flexShrink: 1,
                }}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Nút thanh toán */}
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: paymentMethod ? "#2D2E82" : "#B0B0B0" },
          ]}
          disabled={!paymentMethod || loadingPay}
          onPress={handlePay}
        >
          {loadingPay ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Thanh toán: {price}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal WebView VNPay */}
      <Modal visible={paymentModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "#00000055" }}>
          <View
            style={{
              flex: 1,
              marginTop: 40,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 12,
                backgroundColor: "#2D2E82",
                alignItems: "flex-end",
              }}
              onPress={() => setPaymentModal(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {paymentUrl ? (
              <WebView
                ref={webviewRef}
                source={{ uri: paymentUrl }}
                onNavigationStateChange={onWebViewNavigationStateChange}
                startInLoadingState
                renderLoading={() => (
                  <ActivityIndicator
                    color="#1976d2"
                    size="large"
                    style={{ flex: 1, justifyContent: "center" }}
                  />
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#1976d2" />
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={paymentMethodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentMethodModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setPaymentMethodModalVisible(false)}
        >
          <View style={styles.paymentMethodModal}>
            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => {
                setPaymentMethod("vnpay");
                setPaymentMethodModalVisible(false);
              }}
            >
              <View style={styles.vnpayIcon}>
                <Text style={styles.vnpayIconText}>VN</Text>
              </View>
              <Text style={styles.paymentText}>Ví VNPay</Text>
            </TouchableOpacity>

            {/* Nếu có thêm phương thức khác, thêm tương tự */}
            {/* <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => {
          setPaymentMethod("paypal");
          setPaymentMethodModalVisible(false);
        }}
      >
        <Ionicons name="logo-paypal" size={24} color="#003087" />
        <Text style={styles.paymentText}>PayPal</Text>
      </TouchableOpacity> */}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ...giữ nguyên các style bạn đã dùng...
  container: { flex: 1, backgroundColor: "#ebf7fa" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D2E82",
    marginLeft: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  paymentBox: {
    marginHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 16,
    color: "#2D2E82",
    marginLeft: 12,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  infoLabel: {
    color: "#2D2E82",
    fontSize: 15,
    fontWeight: "500",
    minWidth: 90,
  },
  infoValue: {
    color: "#222",
    fontSize: 15,
    flexShrink: 1,
    textAlign: "right",
  },
  divider: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  payButton: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  vnpayIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1565C0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  vnpayIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  paymentMethodModal: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: "auto", // Đẩy modal xuống dưới cùng màn hình
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    elevation: 10,
    maxHeight: "50%", // Tùy chỉnh chiều cao modal
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Đẩy overlay xuống dưới cùng
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2D2E82",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 15,
    paddingHorizontal: 16,
    
  },
});

export default Invoice;
