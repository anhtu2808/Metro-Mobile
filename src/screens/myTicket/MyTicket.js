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
import TicketModal from "./TicketModal";

const StatusTicket = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  UNPAID: "UNPAID",
  USING: "USING"
};

const MyTicket = () => {
  const [selectedTab, setSelectedTab] = useState("using");
  const navigation = useNavigation();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [ticketOrders, setTicketOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // const fetchTicketOrders = async (tab) => {
  //   if (!user?.id) return;
  //   setLoading(true);
  //   try {
  //     const data = {
  //       page: 1,
  //       size: 10,
  //       userId: user.id,
  //       status:
  //         selectedTab === "using" ? StatusTicket.ACTIVE : StatusTicket.INACTIVE,
  //     };
  //     const response = await getTicketOrdersAPI(data);
  //     if (response && response.result.data) {
  //       setTicketOrders(response.result.data);
  //     } else {
  //       setTicketOrders([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching ticket orders:", error);
  //     setTicketOrders([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTicketOrders = async (tab) => {
  if (!user?.id) return;
  setLoading(true);
  try {
    let data = {
      page: 1,
      size: 10,
      userId: user.id,
      // Không truyền status trường hợp selectedTab === "using"
    };
    if (selectedTab !== "using") data.status = "INACTIVE";

    const response = await getTicketOrdersAPI(data);
    let list = response?.result?.data || [];
    if (selectedTab === "using") {
      list = list.filter(x => x.status === "ACTIVE" || x.status === "USING"); // hiện ra danh sách vé active và using
    }
    setTicketOrders(list);
  } catch (error) {
    console.log("Error fetching ticket orders:", error);
    setTicketOrders([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTicketOrders(selectedTab);
  }, [selectedTab, user?.id]);

  const renderTicketItem = ({ item }) => {
  // Hiển thị trạng thái đẹp, mỗi loại khác màu/text
  let statusText = "";
  let statusStyle = {};
  if (item.status === StatusTicket.ACTIVE) {
    statusText = "Đã kích hoạt";
    statusStyle = styles.statusActive;
  }
  else if (item.status === StatusTicket.USING) {
    statusText = "Đang sử dụng";
    statusStyle = styles.statusUsing;
  }
  else if (item.status === StatusTicket.INACTIVE) {
    statusText = "Chưa sử dụng";
    statusStyle = styles.statusInactive;
  }
  else if (item.status === "CANCELLED") {
    statusText = "Đã hủy";
    statusStyle = styles.statusCancelled;
  } else statusText = item.status;

  return (
    <TouchableOpacity
      style={styles.ticketBox}
      onPress={() => handleTicketPress(item)}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
        <Text style={styles.ticketTitle}>{item.ticketType?.name || "Vé 1 ngày"}</Text>
        <Text style={[styles.statusBase, statusStyle]}>{statusText}</Text>
      </View>
      <Text style={styles.ticketTime}>
        {new Date(item.purchaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {" "}
        {new Date(item.purchaseDate).toLocaleDateString()}
      </Text>
      <View style={{ height: 18 }} />
      <Text style={styles.ticketPrice}>
        {item.price?.toLocaleString("vi-VN")} đ
      </Text>
    </TouchableOpacity>
  );
};


  const handleTicketPress = (item) => {
    if (
      item.status === StatusTicket.INACTIVE ||
      item.status === StatusTicket.ACTIVE   ||
      item.status === StatusTicket.USING
    ) {
      setSelectedTicketId(item.id);
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTicketId(null);
    fetchTicketOrders(selectedTab); // reload lại list vé
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

      <TicketModal
        visible={modalVisible}
        onClose={handleModalClose}
        ticketId={selectedTicketId}
        ticketInfo={ticketOrders.find(item => item.id === selectedTicketId)}
        onActivated={handleModalClose}
      />
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
statusCancelled: {
  backgroundColor: "#fedbe2",
  color: "#eb5864",
  // Giống màu trong ảnh của bạn
},
ticketTime: {
  fontSize: 13,
  color: "#8b909a",
  marginTop: 4,
},
ticketPrice: {
  position: 'absolute',
  right: 14,
  bottom: 12,
  fontWeight: 'bold',
  fontSize: 16,
  color: "#1a1a1a",
},
});

export default MyTicket;
