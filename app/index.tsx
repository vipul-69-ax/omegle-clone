import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";

export default function index() {
  return <Redirect href="/landing" />;
}

