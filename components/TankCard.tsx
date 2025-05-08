import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Or any other icon pack you prefer
import moment from "moment-timezone"; // Import moment-timezone for time zone handling

type TankCardProps = {
  imageUrl: string;
  tankName: string;
  temperature: number;
  pH: number;
  tds: number;
  lastTested: string;
};

// Helper function to format the date into MST (Mountain Standard Time)
const formatDate = (dateString: string) => {
  const date = moment(dateString); // Parse the date string into a moment object
  return date.tz("America/Denver").format("YYYY/MM/DD HH:mm"); // Convert to MST and format
};

export default function TankCard({
  imageUrl,
  tankName,
  temperature,
  pH,
  tds,
  lastTested,
}: TankCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.tankName}>{tankName}</Text>
        <View style={styles.paramContainer}>
          <View style={styles.paramBox}>
            <Icon name="thermometer-half" size={22} color="#06b6d4" />
            <Text style={styles.paramText}>{temperature}°F</Text>
          </View>
          <View style={styles.paramBox}>
            <Icon name="tint" size={22} color="#06b6d4" />
            <Text style={styles.paramText}>{pH}</Text>
          </View>
          <View style={styles.paramBox}>
            <Icon name="filter" size={22} color="#06b6d4" />
            <Text style={styles.paramText}>{tds} ppm</Text>
          </View>
        </View>
        <Text style={styles.lastTested}>
          Last Tested: {formatDate(lastTested)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2d3748", // Darker background for modern feel
    borderRadius: 16, // Rounded corners for a more polished look
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 12,
    borderWidth: 1, // Thin border around card
    borderColor: "#fff", // White border for contrast
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 10,
  },
  info: {
    padding: 14,
    justifyContent: "center",
  },
  tankName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#06b6d4", // cyan-600
    marginBottom: 8,
  },
  paramContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  paramBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  paramText: {
    fontSize: 16,
    color: "#f9fafb", // white text
    marginLeft: 6,
  },
  lastTested: {
    fontSize: 14,
    color: "#9ca3af", // gray-400 for less emphasis
    marginTop: 8,
    fontStyle: "italic",
  },
});
