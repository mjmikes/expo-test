import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

const BluetoothScanScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const bleManager = useRef(new BleManager()).current;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      bleManager.stopDeviceScan();
      bleManager.destroy();
    };
  }, [bleManager]);

  const startScan = () => {
    setDevices([]); // Clear previous results
    setScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error.message);
        setScanning(false);
        return;
      }

      if (device?.name?.includes("AquaSpec")) {
        setDevices((prev) => {
          const alreadyFound = prev.some((d) => d.id === device.id);
          return alreadyFound ? prev : [...prev, device];
        });
      }
    });
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setScanning(false);
  };

  const handleConnect = async (device: Device) => {
    try {
      stopScan();
      console.log("Connecting to:", device.name || device.id);
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("Connected successfully");
      // Handle post-connection logic
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Device Scan</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={scanning ? stopScan : startScan}
      >
        <Text style={styles.buttonText}>
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => handleConnect(item)}
          >
            <Text style={styles.deviceText}>
              {item.name || "Unnamed Device"}
            </Text>
            <Text style={styles.deviceText}>ID: {item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deviceItem: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  deviceText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default BluetoothScanScreen;
