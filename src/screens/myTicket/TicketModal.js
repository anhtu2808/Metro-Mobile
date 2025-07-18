import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import qrcodeImg from "../../assets/qrcode.png"; // Đường dẫn tới file qrcode.png
import {
  updateStatusActiveTicketOrderAPI,
  readTicketOrderByIdAPI,
} from "../../apis";
import QRCode from "react-native-qrcode-svg";

const QR_REFRESH_INTERVAL = 60; // giây

const TicketModal = ({ visible, onClose, ticketId, onActivated }) => {
  const [tab, setTab] = useState("QR");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [countdown, setCountdown] = useState(QR_REFRESH_INTERVAL);

  const intervalRef = useRef();

  useEffect(() => {
    if (visible && ticketId) {
      setLoading(true);
      readTicketOrderByIdAPI(ticketId)
        .then((data) => {
          setTicket(data.result);
          setQrToken(data.result.ticketQRToken || "");
          setCountdown(QR_REFRESH_INTERVAL);
        })
        .finally(() => setLoading(false));
    }
    // Reset tab khi mở lại modal
    if (visible) setTab("QR");
  }, [visible, ticketId]);

  // QR countdown & refresh logic cho vé ACTIVE
  useEffect(() => {
    if (ticket?.status === "ACTIVE" && visible) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Call API lấy lại ticket detail để lấy mã QR mới
            readTicketOrderByIdAPI(ticketId).then((data) => {
              setQrToken(data.result.ticketQRToken || "");
              setCountdown(QR_REFRESH_INTERVAL);
            });
            return QR_REFRESH_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
    // Clear interval khi đóng modal hoặc không phải vé active
    return () => clearInterval(intervalRef.current);
  }, [ticket?.status, visible, ticketId]);

  const handleActivate = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const resStatus = await updateStatusActiveTicketOrderAPI(
        ticketId,
        "ACTIVE"
      );

      console.log("API response status:", resStatus);

      if (resStatus === 200) {
        // Thành công
        onActivated && onActivated(); // callback reload list
        onClose();
        // Alert.alert("Thành công", "Vé đã được kích hoạt!");
      } else {
        Alert.alert("Lỗi", "Kích hoạt vé thất bại!");
      }
    } catch (e) {
      console.error("Lỗi kích hoạt vé:", e.response?.data || e.message || e);
      Alert.alert("Lỗi", "Kích hoạt vé thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Tên vé */}
          {/* <Text style={styles.title}>
            Vé lượt: {ticket.ticketType?.name || ticket.ticketCode}
          </Text> */}

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === "QR" && styles.tabActive]}
              onPress={() => setTab("QR")}
            >
              <Text
                style={tab === "QR" ? styles.tabTextActive : styles.tabText}
              >
                Mã QR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === "INFO" && styles.tabActive]}
              onPress={() => setTab("INFO")}
            >
              <Text
                style={tab === "INFO" ? styles.tabTextActive : styles.tabText}
              >
                Thông tin
              </Text>
            </TouchableOpacity>
          </View>

          {/* QR Tab */}
          {tab === "QR" && (
            <View style={styles.qrContainer}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Logo-VNU-HCM.png",
                }}
                style={styles.logo}
                resizeMode="contain"
              />
              {ticket.status === "ACTIVE" ? (
                <>
                  <View style={styles.qrCodeBox}>
                    <QRCode
                      value={qrToken}
                      size={180}
                      logoSize={36}
                      logoBackgroundColor="transparent"
                    />
                  </View>
                  <Text style={styles.qrExpireText}>
                    Mã sẽ hết hạn sau: {countdown}s{" "}
                    <Text style={{ fontSize: 15 }}>🔄</Text>
                  </Text>
                  <Text style={styles.warning}>
                    *Vui lòng không đưa mã cho người khác sử dụng
                  </Text>
                </>
              ) : (
                <>
                  {/* Không hiển thị QR code cho INACTIVE */}
                  <Image
                    source={qrcodeImg}
                    style={styles.qrBg}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.activateBtn}
                    onPress={() => setShowConfirm(true)}
                  >
                    <Text style={styles.activateBtnText}>Kích hoạt vé</Text>
                  </TouchableOpacity>
                  <Text style={styles.note}>
                    *Vui lòng kích hoạt vé để sử dụng
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Info Tab */}
          {tab === "INFO" && (
            <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Loại: {ticket.ticketType.name}</Text>
              <Text style={styles.infoLabel}>Mã vé: {ticket.ticketCode}</Text>
              <Text style={styles.infoLabel}>
                Giá: {ticket.price?.toLocaleString("vi-VN")} đ
              </Text>
              <Text style={styles.infoLabel}>Mô tả: {ticket.ticketType.description}</Text>
              <Text style={styles.infoLabel}>
                Ngày mua: {new Date(ticket.purchaseDate).toLocaleDateString()}
              </Text>
              <Text style={styles.infoLabel}>
                Hiệu lực đến:{" "}
                {ticket.validUntil
                  ? new Date(ticket.validUntil).toLocaleDateString()
                  : "Chưa xác định"}
              </Text>
            </View>
          )}

          {/* Đóng */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: "#1976d2", fontWeight: "bold" }}>Đóng</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1976d2" />
          </View>
        )}

        {/* Popup xác nhận kích hoạt */}
        <Modal visible={showConfirm} transparent animationType="fade">
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Lưu ý</Text>
              <Text style={styles.confirmText}>
                Bạn đang kích hoạt Vé lượt: {ticket.ticketCode}. Vé sau khi kích
                hoạt sẽ được bắt đầu tính thời hạn sử dụng. Tiếp tục?
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text>Trở về</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: "#ff9800" }]}
                  onPress={handleActivate}
                >
                  <Text style={{ color: "#fff" }}>Đồng ý</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "92%",
    backgroundColor: "#f8fbff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 8,
    color: "#222",
    alignSelf: "flex-start",
  },
  tabRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#1976d2",
  },
  tabText: {
    color: "#1976d2",
    fontWeight: "600",
    fontSize: 16,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  logo: {
    width: 110,
    height: 28,
    marginBottom: 8,
    alignSelf: "center",
  },
  qrCodeBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e3eaf6",
  },
  qrBg: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  activateBtn: {
    backgroundColor: "#1976d2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 10,
  },
  activateBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  note: {
    color: "#ec9706",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8,
  },
  warning: {
    color: "#ec9706",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  qrExpireText: {
    fontSize: 15,
    color: "#555",
    marginTop: 6,
    marginBottom: 4,
  },
  infoContainer: {
    width: "100%",
    padding: 10,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  closeBtn: {
    marginTop: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
  },
  confirmTitle: {
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 22,
    textAlign: "center",
  },
  confirmActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  confirmBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 6,
    backgroundColor: "#f5f5f5",
  },
});

export default TicketModal;
