import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const TicketConfirmModal = ({
  visible,
  onClose,
  title,
  infoRows = [],
  price,
  onBuy,
  buyButtonText = "Mua ngay",
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={styles.ticketInfo}>
          {infoRows.map((row, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={row.isWarning ? styles.labelRed : styles.label}>
                {row.label}
              </Text>
              <Text style={row.isWarning ? styles.valueRed : styles.value}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.dashedLineContainer}>
          <View style={styles.circleLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.circleRight} />
        </View>
        <TouchableOpacity style={styles.buyButton} onPress={onBuy}>
          <Text style={styles.buyButtonText}>
            {buyButtonText}: {price}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: windowWidth * 0.92,
    backgroundColor: "#f7fbff",
    borderRadius: 28,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 18,
    shadowColor: "#1976d2",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    borderWidth: 1.5,
    borderColor: "#1976d2",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: "center",
  },
  ticketInfo: {
    width: "100%",
    backgroundColor: "#eaf6ff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    color: "#1976d2",
    fontSize: 16,
    minWidth: 78,
  },
  value: {
    color: "#1a237e",
    fontSize: 16,
    flexShrink: 1,
  },
  labelRed: {
    fontWeight: "bold",
    color: "#e53935",
    fontSize: 16,
    minWidth: 78,
  },
  valueRed: {
    color: "#e53935",
    fontSize: 16,
    flexShrink: 1,
  },
  dashedLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
    justifyContent: "center",
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#1976d2",
    marginHorizontal: 2,
  },
  circleLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f7fbff",
    borderWidth: 2,
    borderColor: "#1976d2",
    marginRight: -9,
    zIndex: 1,
  },
  circleRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f7fbff",
    borderWidth: 2,
    borderColor: "#1976d2",
    marginLeft: -9,
    zIndex: 1,
  },
  buyButton: {
    backgroundColor: "#1976d2",
    borderRadius: 22,
    width: "96%",
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 2,
    elevation: 2,
    shadowColor: "#1976d2",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default TicketConfirmModal;
