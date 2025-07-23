import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { readTransactionAPI } from "../../apis";
import Header from "../../components/header/Header";

const statusVNMap = {
  PENDING: "Đang chờ thanh toán",
  CANCELED: "Đã hủy",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
};

const HistoryTransaction = () => {
  const { user } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách transaction user
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

  return (
    <View style={styles.container}>
      <Header name="Lịch sử giao dịch"/>
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
              onPress={() => {
                // Nếu muốn có hành động khi bấm, đặt ở đây
                // Hiện tại không làm gì
              }}
            >
              <View style={styles.cardRow}>
                <Text style={styles.transactionCode}>{tx.transactionCode}</Text>
                <Text style={{ color: "#1976d2" }}>
                  {statusVNMap[tx.status] || tx.status}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text>{tx.paymentMethod}</Text>
                <Text>
                  {tx.amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HistoryTransaction;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ebf7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#1976d2" },
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
});
