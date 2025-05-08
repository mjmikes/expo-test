import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { supabase } from "../../utils/supabase"; // Import the Supabase client
import TankCard from "@/components/TankCard"; // Your TankCard component
import moment from "moment-timezone"; // Import moment-timezone
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // 👈 or Feather, MaterialIcons etc.


// Helper function to format the date into MST (Mountain Standard Time) with 6-hour adjustment
const formatDateToMST = (dateString: string) => {
  const date = moment(dateString); // Parse the date string into a moment object
  return date.add(6, "hours").format("YYYY-MM-DD HH:mm:ss"); // Add 6 hours and format
};

export default function HomeScreen() {
  const [tanks, setTanks] = useState<any[]>([]); // State to hold the tank data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useAuth();

  // Function to fetch the tanks and their readings
  const getTanksWithReadings = async () => {
    setLoading(true); // Set loading to true when data is being fetched
    try {
      // Fetch tanks from the 'tanks' table
      const { data: tanksData, error: tanksError } = await supabase
        .from("tanks")
        .select("id, name, image_url")
        .eq("user_id", userId); // ✅ Filter by logged-in user

      if (tanksError) {
        console.error("Error fetching tanks:", tanksError.message);
        return;
      }

      if (tanksData && tanksData.length > 0) {
        // Fetch the most recent sensor readings for each tank
        const tanksWithReadings = await Promise.all(
          tanksData.map(async (tank: { id: any }) => {
            const { data: readings, error: readingsError } = await supabase
              .from("sensor_readings")
              .select("temperature, ph, tds, recorded_at")
              .eq("tank_id", tank.id)
              .order("recorded_at", { ascending: false }) // Order by latest recorded_at
              .limit(1); // Get the most recent reading

            if (readingsError) {
              console.error(
                `Error fetching readings for tank ${tank.id}:`,
                readingsError.message
              );
            }

            return {
              ...tank,
              sensor_readings: readings ? readings[0] : null, // Add the latest readings
            };
          })
        );

        setTanks(tanksWithReadings); // Update state with merged data
      }
    } catch (error) {
      console.error("Unexpected error fetching tanks with readings:", error);
      Alert.alert("Error", "An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    getTanksWithReadings();
  }, []);

  // Function to handle the refresh button press
  const handleRefresh = () => {
    getTanksWithReadings(); // Fetch the data again
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={28} color="#06b6d4" />
        </TouchableOpacity>

        <Text style={styles.title}>Your Tanks</Text>

        <TouchableOpacity onPress={() => router.push("../screens/AddTank")}>
          <Ionicons name="add-circle-outline" size={28} color="#10b981" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tanks..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {tanks
            .filter((tank) =>
              tank.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((tank) => (
              // eslint-disable-next-line react/jsx-key
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "../screens/TankDetailScreen",
                    params: { id: tank.id },
                  })
                }
              >
                <TankCard
                  key={tank.id}
                  imageUrl={tank.image_url}
                  tankName={tank.name}
                  temperature={tank.sensor_readings?.temperature || "N/A"}
                  pH={tank.sensor_readings?.ph || "N/A"}
                  tds={tank.sensor_readings?.tds || "N/A"}
                  lastTested={
                    tank.sensor_readings?.recorded_at
                      ? formatDateToMST(tank.sensor_readings.recorded_at)
                      : "N/A"
                  }
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827", // Dark background
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    color: "#06b6d4",
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  refreshButton: {
    backgroundColor: "#05a6d4",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderColor: "#374151",
    borderWidth: 1,
    marginBottom: 16,
  },
});
