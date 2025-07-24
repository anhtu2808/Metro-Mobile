import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { readTransactionAPI, readTicketOrderByIdAPI, createPaymentAPI } from "../../apis";
import Header from "../../components/header/Header";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const statusVNMap = {
  PENDING: "Đang chờ thanh toán",
  CANCELED: "Đã hủy",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  EXPIRED: "Hết hạn",
};

const HistoryTransaction = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal chi tiết vé
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal thanh toán VNPay
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Lấy danh sách giao dịch (tickets)
  const fetchTransactions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await readTransactionAPI(user.id);
      if (res?.result?.data) setTransactions(res.result.data);
      else setTransactions([]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  // Mở modal chi tiết vé và gọi API lấy chi tiết vé theo orderTicketId
  const openDetailModal = async (orderTicketId) => {
    setDetailLoading(true);
    setDetailModalVisible(true);
    try {
      const res = await readTicketOrderByIdAPI(orderTicketId);
      if (res?.code === 200 && res?.result) {
        setSelectedTicket(res.result);
      } else {
        Alert.alert("Lỗi", res?.message || "Không lấy được chi tiết vé.");
        setDetailModalVisible(false);
      }
    } catch (error) {
      console.error("Error loading ticket detail:", error);
      Alert.alert("Lỗi", "Không lấy được chi tiết vé. Vui lòng thử lại.");
      setDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Gọi API lấy link thanh toán
  const handlePayment = async () => {
    if (!selectedTicket) return;
    setPaymentLoading(true);
    try {
      // Dùng selectedTicket.id làm orderTicketId
      const url = await createPaymentAPI(selectedTicket.id);
      if (url) {
        setPaymentUrl(url);
        setPaymentModalVisible(true);
      } else {
        Alert.alert("Lỗi", "Không lấy được link thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment url:", error);
      Alert.alert("Lỗi", "Không thể tạo đường dẫn thanh toán. Vui lòng thử lại.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Theo dõi url WebView để phát hiện trạng thái thanh toán
  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url;
    // Sửa lại điều kiện so với callback thực tế backend trả về!
    if (url.includes("payment-success")) {
      setPaymentModalVisible(false);
      setDetailModalVisible(false);
      Alert.alert("Thanh toán thành công", "Bạn đã thanh toán thành công.", [
        {
          text: "Đồng ý",
          onPress: () => navigation.navigate("PaymentSuccessScreen"),
        },
      ]);
    } else if (url.includes("payment-failure")) {
      setPaymentModalVisible(false);
      Alert.alert("Thanh toán thất bại", "Thanh toán không thành công, vui lòng thử lại.");
    }
  };

  // Format ngày theo dd/mm/yyyy hh:mm
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header name="Lịch sử giao dịch" />

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : transactions.length === 0 ? (
        <Text style={styles.noTransaction}>Bạn chưa có giao dịch nào.</Text>
      ) : (
        <ScrollView>
          {transactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => openDetailModal(tx.orderTicketId)} // ĐIỀU CHỈNH đúng orderTicketId
            >
              <View style={styles.cardRow}>
                <Text style={styles.transactionCode}>{tx.transactionCode}</Text>
                <Text style={{ color: "#1976d2" }}>
                  {statusVNMap[tx.status] || tx.status}
                </Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.ticketTypeText}>
                  {/* Có thể sửa nếu có tên vé trong api */}
                  Vé số {tx.orderTicketId}
                </Text>
                <Text style={styles.priceText}>
                  {tx.amount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || ""}{" "}
                  đ
                </Text>
              </View>

              <View style={styles.cardRow}>
                <Text>{tx.paymentMethod || "Phương thức thanh toán"}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal Chi tiết vé */}
      <Modal visible={detailModalVisible} animationType="slide" onRequestClose={() => setDetailModalVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDetailModalVisible(false)}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
              Đóng
            </Text>
          </TouchableOpacity>

          {detailLoading ? (
            <ActivityIndicator size="large" color="#1976d2" style={{ flex: 1, justifyContent: "center" }} />
          ) : selectedTicket ? (
            <View style={styles.detailContainer}>
              <Text style={styles.title}>{selectedTicket.ticketCode}</Text>
              <Text>Loại vé: {selectedTicket.ticketType?.name || "N/A"}</Text>
              <Text>Trạng thái: {statusVNMap[selectedTicket.status] || selectedTicket.status}</Text>
              <Text>Giá vé: {selectedTicket.price?.toLocaleString("vi-VN")} đ</Text>
              <Text>Ga xuất phát: {selectedTicket.startStation?.name || "N/A"}</Text>
              <Text>Ga đến: {selectedTicket.endStation?.name || "N/A"}</Text>
              <Text>Ngày mua: {formatDate(selectedTicket.purchaseDate)}</Text>
              <Text>Hạn vé: {formatDate(selectedTicket.validUntil)}</Text>

              <TouchableOpacity
                style={[styles.button, paymentLoading && { opacity: 0.5 }]}
                onPress={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Thanh toán</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ padding: 20 }}>Không có dữ liệu vé</Text>
          )}
        </SafeAreaView>
      </Modal>

      {/* Modal Thanh toán */}
      <Modal visible={paymentModalVisible} animationType="slide" onRequestClose={() => setPaymentModalVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPaymentModalVisible(false)}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
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

export default HistoryTransaction;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ebf7fa" },
  noTransaction: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
  card: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  transactionCode: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ticketTypeText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#1976d2",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
    color: "#1976d2",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
