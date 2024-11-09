import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/hooks/useAuth";

export default function index() {
  const {deleteToken} = useAuthStore()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        padding: "4%",
        paddingTop: 60,
      }}
    >
      <Text onPress={()=>{
        deleteToken()
        router.push("/landing")
      }} style={{ color: "white", fontSize: 28, fontWeight: "700" }}>
        Logout
      </Text>
      <View style={{ marginTop: "8%" }} />
    </View>
  );
}

const styles = StyleSheet.create({});
