import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header/Header";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getTicketOrdersAPI } from "../../apis";

const Expired = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [expiredTickets, setExpiredTickets] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <View style={styles.ticketItem}>
      <Text style={styles.ticketCode}>Mã vé: {item.ticketCode || "N/A"}</Text>
      <Text>{item.price?.toLocaleString("vi-VN")} đ</Text>
      <Text>{new Date(item.purchaseDate).toLocaleDateString()}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
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
});

export default Expired;
