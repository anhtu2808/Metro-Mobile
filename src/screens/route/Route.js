import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
  const [selectedLineId, setSelectedLineId] = useState(null);
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
      console.error("Error fetching stations:", error);
    }
  };

  const fetchStationsByLineId = async (lineId) => {
    try {
      const response = await readStartStationsByLineIdAPI(lineId);
      if (!response || !response.result) {
        console.error("No data received from API");
        return;
      }
      setStations(response.result);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const fetchBusByStationId = async (stationId) => {
    try {
      const response = await readBusByStationAPI(stationId);
      if (!response || !response.result.data) {
        console.error("No data received from API");
        return;
      }
      setBuses(response.result.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
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
    // Khi selectedLineId thay đổi, fetch stations và set mapRegion
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
    console.log("station iddddddddddddddddddddđ", station.id);
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
          <Text style={styles.stationName}>{selectedStation.name}</Text>
          {buses.length > 0 ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Các tuyến bus:</Text>
              {buses.map((bus) => (
                <Text key={bus.id} style={{ marginTop: 4 }}>
                  {bus.name} {bus.code ? `(${bus.code})` : ""}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={{ marginTop: 8, fontStyle: "italic" }}>
              Không có tuyến bus nào.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 10,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
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
});
