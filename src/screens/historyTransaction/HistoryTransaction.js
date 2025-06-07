import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import Header from "../../components/header/Header";

const HistoryTransaction = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Ví dụ dữ liệu giao dịch, lọc theo ngày
  const transactions = [
    {
      id: 1,
      type: "Vé 1 ngày",
      time: "19:02 07/06/2025",
      price: "40.000 đ",
      status: "Đã huỷ",
      date: "2025-06-07",
    },
    // ... thêm giao dịch khác nếu cần
  ];

  // Lọc giao dịch theo ngày chọn
  const filteredTransactions = selectedDate
    ? transactions.filter((t) => t.date === selectedDate)
    : transactions;

  // Đánh dấu ngày có giao dịch trên lịch
  const markedDates = {};
  transactions.forEach((t) => {
    markedDates[t.date] = {
      marked: true,
      dotColor: "#2D2E82",
      ...(selectedDate === t.date && {
        selected: true,
        selectedColor: "#2D2E82",
        selectedTextColor: "#fff",
      }),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.rowHeader}>
        <Header name="Lịch sử giao dịch" />
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          style={{ paddingTop: 30 }}
        >
          <Ionicons name="calendar-outline" size={28} color="#2D2E82" />
        </TouchableOpacity>
      </View>

      {/* Bộ lọc */}
      <Text style={styles.filterText}>
        {selectedDate
          ? `Lọc: ${selectedDate.split("-").reverse().join("/")} - ${
              filteredTransactions.length
            } kết quả`
          : `Tất cả giao dịch - ${transactions.length} kết quả`}
      </Text>

      {/* Danh sách giao dịch */}
      {filteredTransactions.length === 0 ? (
        <Text style={styles.noTransaction}>Không có giao dịch nào</Text>
      ) : (
        filteredTransactions.map((transaction) => (
          <View style={styles.card} key={transaction.id}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{transaction.type}</Text>
              <View
                style={[
                  styles.statusBadge,
                  transaction.status === "Đã huỷ"
                    ? styles.statusCancelled
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    transaction.status === "Đã huỷ"
                      ? styles.statusCancelledText
                      : styles.statusPendingText,
                  ]}
                >
                  {transaction.status}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardTime}>{transaction.time}</Text>
              <Text style={styles.cardPrice}>{transaction.price}</Text>
            </View>
          </View>
        ))
      )}

      {/* Modal Lịch */}
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngày</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#2D2E82" />
              </TouchableOpacity>
            </View>
            {/* Calendar */}
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: "#2D2E82",
                selectedDayTextColor: "#fff",
                todayTextColor: "#2D2E82",
                arrowColor: "#2D2E82",
                dotColor: "#2D2E82",
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "500",
              }}
              enableSwipeMonths={true}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7fa",
    paddingHorizontal: 16,
  },
  rowHeader: {
    flexDirection: "row", // 👈 nằm ngang
    alignItems: "center", // căn giữa theo chiều dọc
    justifyContent: "space-between", // căn đều hai bên
    paddingHorizontal: 16,
    marginTop: 16,
  },
  filterText: {
    marginBottom: 12,
    color: "#222",
    fontSize: 16,
  },
  noTransaction: {
    color: "#b0b0b0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusCancelled: {
    backgroundColor: "#FFE5EA",
  },
  statusPending: {
    backgroundColor: "#FFF5E5",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  statusCancelledText: {
    color: "#F36C7F",
  },
  statusPendingText: {
    color: "#F4A300",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTime: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  cardPrice: {
    color: "#222",
    fontWeight: "600",
    fontSize: 15,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 350,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2E82",
  },
});

export default HistoryTransaction;
