import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import { createTicketOrderAPI } from "../../apis";

const { width } = Dimensions.get("window");
// Hiển thị thông tin vé giống TicketConfirmModal
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

  const handlePay = async () => {
    try {
      const data = {
        ticketTypeId,
      };
      if (!isDurationTicket) {
        data.lineId = lineId;
        data.startStationId = startStationId;
        data.endStationId = endStationId;
      }
      // Gọi API tạo đơn hàng
      const response = await createTicketOrderAPI(data);
      console.log("Order responseeeeeeeeeeeeeeee:", response);
      if (response && response.result) {
        // Xử lý thành công, ví dụ chuyển trang hoặc thông báo
        alert("Đặt vé thành công!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Thanh toán thất bại, vui lòng thử lại.");
    }
  };

  const infoRows = isDurationTicket
    ? [
        {
          label: "Loại vé: ",
          value: productName,
        },
        {
          label: "HSD: ",
          value: ticketInfoByType[productName]?.hsd || "",
        },
        {
          label: "Lưu ý: ",
          value: ticketInfoByType[productName]?.note || "",
          isWarning: true,
        },
        {
          label: "Mô tả: ",
          value: productName,
        },
      ]
    : [
        { label: "Loại vé: ", value: "Vé lượt" },
        { label: "HSD: ", value: "24h kể từ thời điểm kích hoạt" },
        {
          label: "Lưu ý: ",
          value: "Vé sử dụng một lần",
          isWarning: true,
        },
        {
          label: "Mô tả: ",
          value: productName,
        },
      ];

  return (
    <View style={styles.container}>
      <Header name="Thông tin đơn hàng" />

      {/* Phương thức thanh toán */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={styles.paymentBox}
          onPress={() => setPaymentModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.paymentRow}>
            {paymentMethod ? (
              <View style={styles.vnpayIcon}>
                <Text style={styles.vnpayIconText}>VN</Text>
              </View>
            ) : (
              <Ionicons name="card-outline" size={24} color="#2D2E82" />
            )}
            <Text style={styles.paymentText}>
              {paymentMethod ? "Ví VNPay" : "Phương thức thanh toán"}
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thành tiền:</Text>
            <Text style={styles.infoValue}>{price}</Text>
          </View>
        </View>

        {/* Thông tin vé */}
        <Text style={styles.sectionTitle}>
          Thông tin Vé lượt: {productName}
        </Text>
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
      </ScrollView>

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={[
          styles.payButton,
          { backgroundColor: paymentMethod ? "#2D2E82" : "#B0B0B0" },
        ]}
        disabled={!paymentMethod}
        onPress={handlePay}
      >
        <Text style={styles.payButtonText}>Thanh toán: {price}</Text>
      </TouchableOpacity>

      {/* Modal chọn phương thức thanh toán */}
      <Modal
        visible={paymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPaymentModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
              <TouchableOpacity onPress={() => setPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#2D2E82" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "vnpay" && styles.paymentOptionSelected,
              ]}
              onPress={() => {
                setPaymentMethod("vnpay");
                setPaymentModal(false);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.vnpayIcon}>
                <Text style={styles.vnpayIconText}>VN</Text>
              </View>
              <View>
                <Text style={styles.paymentOptionTitle}>Ví VNPay</Text>
                <Text style={styles.paymentOptionDesc}>
                  Thanh toán qua VNPay
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ebf7fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2E82",
    textAlign: "center",
    flex: 1,
  },
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
  termsText: {
    textAlign: "center",
    color: "#2D2E82",
    fontSize: 13,
    marginBottom: 4,
    marginTop: 2,
  },
  termsLink: {
    color: "#1976d2",
    textDecorationLine: "underline",
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2E82",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  paymentOptionSelected: {
    borderColor: "#2D2E82",
    backgroundColor: "#E3F0FF",
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
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  paymentOptionDesc: {
    fontSize: 14,
    color: "#7B7B7B",
  },
});

export default Invoice;
