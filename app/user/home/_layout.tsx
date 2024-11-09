import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

export default function Home() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="place" options={{
        presentation:"transparentModal",
      }} />
    </Stack>
  );
}

const styles = StyleSheet.create({});
