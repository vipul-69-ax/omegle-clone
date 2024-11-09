import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

export default function Profile() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="my_projects"  />
      <Stack.Screen name="new_project" options={{presentation:"containedModal"}}  />
    </Stack>
  );
}

const styles = StyleSheet.create({});
