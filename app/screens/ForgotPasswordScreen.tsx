import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Your auth context with Supabase

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth(); // Get resetPassword from AuthContext

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      await resetPassword(email); // Call the resetPassword function in AuthContext
      Alert.alert(
        "Success",
        "A password reset link has been sent to your email."
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message); // Show error if something goes wrong
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Send Reset Link" onPress={handleForgotPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 24,
  },
  title: {
    fontSize: 26,
    color: "#06b6d4",
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    borderColor: "#374151",
    borderWidth: 1,
  },
});