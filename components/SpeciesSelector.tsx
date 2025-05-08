import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

// Define the shape of one fish entry
type FishEntry = {
  name: string;
  quantity: number;
};

// Define props type
type SpeciesSelectorProps = {
  onSpeciesChange: (species: FishEntry[]) => void;
};

const FISH_OPTIONS = [
  { label: "Angelfish", value: "Angelfish" },
  { label: "Betta", value: "Betta" },
  { label: "Cherry Barb", value: "Cherry Barb" },
  { label: "Corydoras", value: "Corydoras" },
  { label: "Danio", value: "Danio" },
  { label: "Dwarf Gourami", value: "Dwarf Gourami" },
  { label: "GloFish", value: "GloFish" },
  { label: "Goldfish", value: "Goldfish" },
  { label: "Guppy", value: "Guppy" },
  { label: "Kuhli Loach", value: "Kuhli Loach" },
  { label: "Molly", value: "Molly" },
  { label: "Neon Tetra", value: "Neon Tetra" },
  { label: "Platy", value: "Platy" },
  { label: "Pleco", value: "Pleco" },
  { label: "Swordtail", value: "Swordtail" },
];


export default function SpeciesSelector({
  onSpeciesChange,
}: SpeciesSelectorProps) {
  const [speciesList, setSpeciesList] = useState<FishEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [fish, setFish] = useState<string | null>(null);
  const [fishOptions, setFishOptions] = useState(FISH_OPTIONS);
  const [count, setCount] = useState<string>("");

  const addFish = () => {
    if (!fish || !count || isNaN(Number(count))) {
      Alert.alert(
        "Error",
        "Please select a species and enter a valid quantity."
      );
      return;
    }

    const newEntry: FishEntry = { name: fish, quantity: parseInt(count) };
    const newList = [...speciesList, newEntry];

    setSpeciesList(newList);
    setFish(null);
    setCount("");
    onSpeciesChange(newList);
  };

  const removeFish = (index: number) => {
    const newList = speciesList.filter((_, i) => i !== index);
    setSpeciesList(newList);
    onSpeciesChange(newList);
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={fish}
        items={fishOptions}
        setOpen={setOpen}
        setValue={setFish}
        setItems={setFishOptions}
        placeholder="Select a species"
        placeholderStyle={{ color: "#9ca3af" }}
        style={styles.dropdown}
        dropDownContainerStyle={{ backgroundColor: "#1f2937" }}
        textStyle={{ color: "#f9fafb" }}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        placeholderTextColor="#9ca3af"
        keyboardType="numeric"
        value={count}
        onChangeText={setCount}
      />

      <TouchableOpacity style={styles.addButton} onPress={addFish}>
        <Text style={styles.addButtonText}>➕ Add Fish</Text>
      </TouchableOpacity>

      {speciesList.map((item, index) => (
        <View key={index} style={styles.fishRow}>
            <Text style={styles.fishText}>
            {item.name} x{item.quantity}
            </Text>
            <TouchableOpacity onPress={() => removeFish(index)}>
            <Text style={styles.removeButton}>✖</Text>
            </TouchableOpacity>
        </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  dropdown: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderColor: "#374151",
    borderWidth: 1,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#06b6d4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fishRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fishText: {
    color: "#f9fafb",
  },
  removeButton: {
    color: "#ef4444",
    fontWeight: "bold",
  },
});
