import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Track if it's a login or signup screen
  const { login, signup } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      console.log("Logged in successfully");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Login Error", error.message);
      } else {
        Alert.alert("Login Error", "An unknown error occurred.");
      }
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await signup(email, password);
      console.log("Signed up successfully");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Signup Error", error.message);
      } else {
        Alert.alert("Signup Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignup ? "Create an Account" : "AquaSpec"}
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={"#999"}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={"#999"}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isSignup ? handleSignup : handleLogin}
      >
        <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Log In"}</Text>
      </TouchableOpacity>

      <View style={styles.switchAuthContainer}>
        <Text style={styles.switchAuthText}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
        </Text>
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.switchAuthLink}>
            {isSignup ? "Log In" : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={async () => {
          if (!email) {
            Alert.alert(
              "Reset Password",
              "Please enter your email above first."
            );
            return;
          }
          try {
            await setPassword(email);
            Alert.alert(
              "Reset Link Sent",
              "Check your email to reset your password."
            );
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert("Reset Error", error.message);
            } else {
              Alert.alert("Reset Error", "An unknown error occurred.");
            }
          }
        }}
      >
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
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
    fontSize: 40,
    fontFamily: "Lobster",
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
  button: {
    backgroundColor: "#06b6d4", // Cyan color for primary action
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  switchAuthContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  switchAuthText: {
    color: "#9ca3af", // Gray color for the text
    fontSize: 14,
  },
  switchAuthLink: {
    color: "#06b6d4", // Cyan color for the link
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
