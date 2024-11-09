import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { width } from "@/constants/Screen";
import { Octicons } from "@expo/vector-icons";
import { useProfileExists } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/hooks/useAuth";
import CreateProfileForm from "@/components/ui/CreateProfile";

export default function TabsLayout() {
  const { token } = useAuthStore();
  const has_profile = useProfileExists(token);
  if (!has_profile) {
    return <CreateProfileForm/>
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="location" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
