import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const MyTicket = () => {
  const [selectedTab, setSelectedTab] = useState("using");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          {/* Icon home giả lập bằng emoji, có thể dùng icon thực tế */}
          <Text style={styles.icon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Vé của tôi</Text>
        <TouchableOpacity>
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

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn không có vé nào</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  icon: {
    fontSize: 22,
    color: "#1a237e",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
  },
  expired: {
    fontSize: 15,
    color: "#1a237e",
    textDecorationLine: "underline",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#eaf0fa",
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#1976d2",
  },
  tabText: {
    fontSize: 15,
    color: "#1a237e",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#b0b0b0",
    fontSize: 16,
  },
});

export default MyTicket;
