import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router"; // Only expo-router needed

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Logout Failed", "Something went wrong while signing out.");
    }
  };

  const handleConnectDevice = () => {
    router.push("/screens/BluetoothScanScreen"); // Navigate to the Bluetooth scan screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || "Unknown"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConnectDevice}>
        <Text style={styles.buttonText}>Connect AquaSpec Device</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#06b6d4",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 32,
  },
  label: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
