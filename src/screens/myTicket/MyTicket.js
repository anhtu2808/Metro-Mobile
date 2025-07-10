import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getTicketOrdersAPI } from "../../apis";
import { useSelector } from "react-redux";

const StatusTicket = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  UNPAID: "UNPAID",
};

const MyTicket = () => {
  const [selectedTab, setSelectedTab] = useState("using");
  const navigation = useNavigation();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [ticketOrders, setTicketOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTicketOrders = async (tab) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = {
        page: 1,
        size: 10,
        userId: user.id,
        status:
          selectedTab === "using" ? StatusTicket.ACTIVE : StatusTicket.INACTIVE,
      };
      console.log("userIdddddddddddddddddddddddddddddddddđ:", user.id);
      const response = await getTicketOrdersAPI(data);
      if (response && response.result.data) {
        setTicketOrders(response.result.data);
      } else {
        setTicketOrders([]);
      }
    } catch (error) {
      console.error("Error fetching ticket orders:", error);
      setTicketOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketOrders(selectedTab);
  }, [selectedTab, user?.id]);

  const renderTicketItem = ({ item }) => {
    const isActive = item.status === StatusTicket.ACTIVE;
    const isInactive = item.status === StatusTicket.INACTIVE;

    return (
      <View style={styles.ticketItem}>
        <Text style={styles.ticketCode}>Mã vé: {item.ticketCode || "N/A"}</Text>
        <Text>{item.price?.toLocaleString("vi-VN")} đ</Text>
        <Text>{new Date(item.purchaseDate).toLocaleDateString()}</Text>
        <Text
          style={[
            styles.status,
            isActive && styles.statusActive,
            isInactive && styles.statusInactive,
          ]}
        >
          {item.status}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          {/* Icon home giả lập bằng emoji, có thể dùng icon thực tế */}
          <Text style={styles.icon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Vé của tôi</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Expired")}>
          <Text style={styles.expired}>Hết hạn</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "using" && styles.tabActive]}
          onPress={() => setSelectedTab("using")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "using" && styles.tabTextActive,
            ]}
          >
            Đang sử dụng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "unused" && styles.tabActive]}
          onPress={() => setSelectedTab("unused")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "unused" && styles.tabTextActive,
            ]}
          >
            Chưa sử dụng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      )}

      {/* List hoặc Empty */}
      {!loading && ticketOrders.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn không có vé nào</Text>
        </View>
      )}

      {!loading && ticketOrders.length > 0 && (
        <FlatList
          data={ticketOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketItem}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // nền sáng nhẹ, dịu mắt
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  icon: {
    fontSize: 24,
    color: "#1976d2",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1976d2",
  },
  expired: {
    fontSize: 16,
    color: "#1976d2",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e3eaf6",
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    padding: 6,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  tabActive: {
    backgroundColor: "#1976d2",
    shadowColor: "#1976d2",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  ticketItem: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  ticketCode: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
    color: "#0d47a1",
  },
  ticketText: {
    fontSize: 15,
    color: "#333",
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
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    textAlign: "center",
    marginTop: 8,
    borderWidth: 1,
  },
  statusActive: {
    color: "#4caf50",
    borderColor: "#4caf50",
    backgroundColor: "#d0f0c0",
  },
  statusInactive: {
    color: "#9e9e9e",
    borderColor: "#9e9e9e",
    backgroundColor: "#e0e0e0",
  },
});

export default MyTicket;
