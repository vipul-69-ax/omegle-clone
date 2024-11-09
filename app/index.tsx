import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/hooks/useAuth";

export default function index() {
  const { token } = useAuthStore();
  return token === null ? (
    <Redirect href="/landing" />
  ) : (
    <Redirect href="/user/home" />
  );
}
