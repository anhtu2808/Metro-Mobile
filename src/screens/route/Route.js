import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  readBusByStationAPI,
  readLinesAPI,
  readStartStationsByLineIdAPI,
} from "../../apis";

const { width, height } = Dimensions.get("window");

export default function MetroMapScreen() {
  const [selectedStation, setSelectedStation] = useState(null);
  const navigation = useNavigation();
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(null); // phải khai báo để lấy dc lineId
  const selectedLine = lines.find((line) => line.id === selectedLineId);
  const [mapRegion, setMapRegion] = useState(null);
  const [buses, setBuses] = useState([]);

  const fetchLines = async () => {
    try {
      const response = await readLinesAPI();
      if (!response || !response.result.data) {
        console.log("No data recieved from API");
        return;
      }
      setLines(response.result.data);
    } catch (error) {
      console.log("Error fetching stations:", error);
    }
  };

  const fetchStationsByLineId = async (lineId) => {
    try {
      const response = await readStartStationsByLineIdAPI(lineId);
      if (!response || !response.result) {
        console.log("No data received from API");
        return;
      }
      setStations(response.result);
    } catch (error) {
      console.log("Error fetching stations:", error);
    }
  };

  const fetchBusByStationId = async (stationId) => {
    try {
      const response = await readBusByStationAPI(stationId);
      if (!response || !response.result.data) {
        console.log("No data received from API");
        return;
      }
      setBuses(response.result.data);
    } catch (error) {
      console.log("Error fetching buses:", error);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  useEffect(() => {
    // Khi lines có dữ liệu, set selectedLineId và fetch stations
    if (lines.length > 0) {
      setSelectedLineId(lines[0].id);
    }
  }, [lines]);

  useEffect(() => {
    // Kiểm tra nếu có lineId r thì truyền tham số zô để lấy station
    if (selectedLineId) {
      fetchStationsByLineId(selectedLineId);
    }
  }, [selectedLineId]);

  useEffect(() => {
    // Khi stations có dữ liệu, set mapRegion
    if (stations.length > 0) {
      setMapRegion({
        latitude: parseFloat(stations[0].latitude),
        longitude: parseFloat(stations[0].longitude),
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    }
  }, [stations]);

  // Khi chọn line mới, cập nhật cả selectedLine và mapRegion
  const handleSelectLine = (lineId) => {
    setSelectedLineId(lineId);
    setSelectedStation(null);
  };

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    fetchBusByStationId(station.id);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Select Line */}
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.arrowBtn}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Picker
          selectedValue={selectedLineId}
          onValueChange={handleSelectLine}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {lines.map((line) => (
            <Picker.Item
              key={line.id}
              label={line.name}
              value={line.id}
              color={line.color}
            />
          ))}
        </Picker>
      </View>

      {/* MapView focus vào line đang chọn */}
      {mapRegion && stations.length > 0 && (
        <MapView style={{ width, height }} region={mapRegion}>
          {stations.length > 1 && (
            <Polyline
              coordinates={stations
                // .sort((a, b) => a.order - b.order) // Sắp xếp theo order để Polyline nối đúng thứ tự các ga.
                .map((st) => ({
                  latitude: parseFloat(st.latitude),
                  longitude: parseFloat(st.longitude),
                }))}
              strokeColor={selectedLine?.color || "#0057b8"}
              strokeWidth={5}
            />
          )}

          {stations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
              }}
              onPress={() => handleSelectStation(station)}
            />
          ))}
        </MapView>
      )}

      {/* Bảng thông tin ga khi chọn */}
      {selectedStation && (
  <View style={styles.bottomSheet}>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.stationName}>{selectedStation.name}</Text>

      {selectedStation.imageUrl ? (
        <Image
          source={{ uri: selectedStation.imageUrl }}
          style={styles.stationImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontStyle: "italic", color: "#999", marginBottom: 16 }}>
          Không có hình ảnh cho ga này
        </Text>
      )}

      <Text style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>
        Địa chỉ: {selectedStation.address || "Chưa có thông tin"}
      </Text>
      <Text style={{ fontSize: 14, color: "#444", marginBottom: 12 }}>
        Mã trạm: {selectedStation.stationCode || "Chưa có thông tin"}
      </Text>

      {buses.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Các tuyến bus:
          </Text>
          {buses.map((bus) => (
            <View key={bus.id} style={styles.busCard}>
              <Text style={styles.busCode}>{bus.busCode}</Text>
              {bus.startLocation && bus.endLocation && (
                <Text style={styles.busInfo}>
                  {bus.startLocation} ⇄ {bus.endLocation}
                </Text>
              )}
              {typeof bus.distanceToStation === "number" && (
                <Text style={styles.busInfo}>Cách ga: {bus.distanceToStation}m</Text>
              )}
              {bus.headwayMinutes && (
                <Text style={styles.busInfo}>{bus.headwayMinutes} phút/chuyến</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ marginTop: 8, fontStyle: "italic" }}>
          Không có tuyến bus nào.
        </Text>
      )}
    </ScrollView>
  </View>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    position: "absolute",
    top: 40,
    left: 70,
    right: 70,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  bottomSheet: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  maxHeight: "30%", // giới hạn chiều cao tối đa
  backgroundColor: "#f9f9f9",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingVertical: 24,
  paddingHorizontal: 20,
  elevation: 12,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: -5 },
},
 stationName: {
  fontSize: 20,
  fontWeight: "700",
  color: "#111",
  marginBottom: 12,
},
  circleMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stationImage: {
  width: "100%",
  height: 180,
  borderRadius: 12,
  marginBottom: 16,
},
// style cho card bus
busCard: {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
  elevation: 3, // shadow trên Android
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 }, // shadow trên iOS
},
busCode: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 6,
  color: "#1976d2",
},
busInfo: {
  fontSize: 14,
  color: "#444",
  marginBottom: 2,
},

});
