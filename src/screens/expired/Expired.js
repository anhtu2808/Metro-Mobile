import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/header/Header";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getTicketOrdersAPI, readTicketOrderByIdAPI } from "../../apis";

const Expired = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [expiredTickets, setExpiredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [selectedTicket, setSelectedTicket] = useState(null);
const [loadingDetail, setLoadingDetail] = useState(false);

const handleTicketPress = async (ticketId) => {
  setLoadingDetail(true);
  try {
    const data = await readTicketOrderByIdAPI(ticketId);
    if (data && data.result) {
      setSelectedTicket(data.result);
      setModalVisible(true);
    }
  } catch (error) {
    Alert.alert("Lỗi", "Không lấy được thông tin vé");
  } finally {
    setLoadingDetail(false);
  }
};

  useEffect(() => {
    const fetchExpiredTickets = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getTicketOrdersAPI({
          userId: user.id,
          status: "EXPIRED",
          page: 1,
          size: 10,
        });
        if (response && response.result.data) {
          setExpiredTickets(response.result.data);
        } else {
          setExpiredTickets([]);
        }
      } catch (error) {
        console.error("Error fetching expired tickets:", error);
        setExpiredTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpiredTickets();
  }, [user?.id]);

  const renderTicketItem = ({ item }) => (
  <TouchableOpacity
    style={styles.ticketItem}
    onPress={() => handleTicketPress(item.id)}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Text style={styles.ticketTitle}>
        {item.ticketType?.name || "Vé 1 ngày"}
      </Text>
      <Text style={styles.ticketCancelled}>Đã hết hạn</Text>
    </View>

    <Text style={styles.ticketTime}>
      {new Date(item.purchaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(item.purchaseDate).toLocaleDateString()}
    </Text>

    <Text style={styles.ticketPrice}>
      {item.price?.toLocaleString("vi-VN")} đ
    </Text>
  </TouchableOpacity>
);



  return (
    <View style={styles.container}>
      <Header name="Vé đã hết hạn" />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      )}

      {!loading && expiredTickets.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn không có vé nào hết hạn</Text>
        </View>
      )}

      {!loading && expiredTickets.length > 0 && (
        <FlatList
          data={expiredTickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketItem}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}

      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {loadingDetail ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : selectedTicket ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>
            Loại: {selectedTicket.ticketType.name}
          </Text>
          <Text style={styles.infoLabel}>
            Mã vé: {selectedTicket.ticketCode}
          </Text>
          <Text style={styles.infoLabel}>
            Giá: {selectedTicket.price?.toLocaleString("vi-VN")} đ
          </Text>
          <Text style={styles.infoLabel}>
            Mô tả: {selectedTicket.ticketType.description}
          </Text>
          <Text style={styles.infoLabel}>
            Ngày mua: {" "}
            {new Date(selectedTicket.purchaseDate).toLocaleDateString()}
          </Text>
          <Text style={styles.infoLabel}>
            Hiệu lực đến: {" "}
            {selectedTicket.validUntil
              ? new Date(selectedTicket.validUntil).toLocaleDateString()
              : "Chưa xác định"}
          </Text>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#1976d2", fontWeight: "bold" }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ticketItem: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 16,
  marginVertical: 10,
  marginHorizontal: 8,
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.07,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  position: "relative",
  minHeight: 90,
},
ticketTitle: {
  fontWeight: "bold",
  fontSize: 15,
  color: "#19191c",
},
ticketCancelled: {
  backgroundColor: "#fad6d4",
  color: "#eb5864",
  fontWeight: "500",
  borderRadius: 12,
  overflow: "hidden",
  paddingHorizontal: 10,
  paddingVertical: 2,
  fontSize: 13,
},
ticketTime: {
  fontSize: 13,
  color: "#8b909a",
  marginTop: 6,
},

ticketPrice: {
  position: 'absolute',
  bottom: 18,
  right: 16,
  fontWeight: 'bold',
  fontSize: 16,
  color: "#19191c",
},
  ticketCode: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
    color: "#0d47a1",
  },
  ticketText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#999",
    fontSize: 18,
    fontStyle: "italic",
  },
  loadingContainer: {
    marginTop: 30,
  },
  status: {
    fontSize: 14,
    color: "red",
    fontWeight: "500",
    marginTop: 8,
    backgroundColor: "#fad6d4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderColor: "red",
    borderWidth: 1,
    alignSelf: "flex-start",
    textAlign: "center",
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},
modalContent: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 20,
  elevation: 10,
},
infoContainer: {
  width: "100%",
},
infoLabel: {
  fontSize: 16,
  marginBottom: 8,
  color: "#333",
},
closeBtn: {
  marginTop: 20,
  alignSelf: "center",
},

});

export default Expired;
