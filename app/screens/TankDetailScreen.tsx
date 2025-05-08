import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
// eslint-disable-next-line import/no-unresolved
import { supabase } from "@/utils/supabase";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";

export default function TankScreen() {
  const { id } = useLocalSearchParams();
  const [tank, setTank] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (tank?.name) {
      navigation.setOptions({ title: tank.name });
    }
  }, [tank]);


  useEffect(() => {
    const fetchTankData = async () => {
      setLoading(true);
      const { data: tankData } = await supabase
        .from("tanks")
        .select("*")
        .eq("id", id)
        .single();
      const { data: sensorData } = await supabase
        .from("sensor_readings")
        .select("temperature, ph, tds, recorded_at")
        .eq("tank_id", id)
        .order("recorded_at", { ascending: true });

      setTank(tankData);
      setReadings(sensorData ?? []);
      setLoading(false);
    };

    fetchTankData();
  }, [id]);

  if (loading)
    return <ActivityIndicator color="#06b6d4" style={{ marginTop: 32 }} />;

  const formatLabels = (data: any[]) =>
    data.slice(-8).map((d) => moment(d.recorded_at).format("M/DD"));

  const formatData = (key: string) => readings.slice(-8).map((r) => r[key]);


  const handleDeleteTank = async () => {
    Alert.alert(
      "Delete Tank",
      "Are you sure you want to delete this tank and its data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("tanks")
              .delete()
              .eq("id", id);
            if (error) {
              Alert.alert("Error", "Failed to delete tank.");
              return;
            }
            Alert.alert("Deleted", "Tank has been removed.");
            router.back(); // Go back to tank list
          },
        },
      ]
    );
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Details</Text>
      <Text style={styles.subtitle}>Water Type: {tank.water_type}</Text>
      <Text style={styles.subtitle}>Volume: {tank.volume_gallons} gallons</Text>
      <Text style={styles.subtitle}>
        Species:{" "}
        {tank.species?.map((f: any) => `${f.name} x${f.quantity}`).join(", ")}
      </Text>

      <Text style={styles.sectionTitle}>Temperature Over Time</Text>
      <LineChart
        data={{
          labels: formatLabels(readings),
          datasets: [{ data: formatData("temperature") }],
        }}
        width={360}
        height={220}
        yAxisSuffix="°F"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>pH Over Time</Text>
      <LineChart
        data={{
          labels: formatLabels(readings),
          datasets: [{ data: formatData("ph") }],
        }}
        width={360}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>TDS Over Time</Text>
      <LineChart
        data={{
          labels: formatLabels(readings),
          datasets: [{ data: formatData("tds") }],
        }}
        width={360}
        height={220}
        yAxisSuffix="ppm"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTank}>
        <Text style={styles.deleteButtonText}>Delete Tank</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#1f2937",
  backgroundGradientTo: "#1f2937",
  decimalPlaces: 1,
  color: () => "#06b6d4",
  labelColor: () => "#f9fafb",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#06b6d4",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  title: {
    fontSize: 20,
    color: "#06b6d4",
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#f9fafb",
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#06b6d4",
    marginTop: 24,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
  },
  deleteButton: {
    backgroundColor: "#ef4444", // Red
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
