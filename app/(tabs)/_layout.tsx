import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a", // dark slate (change to any color you want)
          height: 65, // increase header height
        },
        headerTintColor: "#06b6d4", // text & icon color
        headerTitleStyle: {
          fontSize: 24, // change text size
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "#1e293b", // tab bar color
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: "#06b6d4", // active icon/text
        tabBarInactiveTintColor: "#94a3b8", // inactive icon/text
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
