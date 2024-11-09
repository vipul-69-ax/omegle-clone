import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { width } from "@/constants/Screen";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedInput() {
  const scaleValue = useSharedValue(1);
  const animatedInput = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scaleValue.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={animatedInput}>
      <TextInput
        onFocus={()=>{
            scaleValue.value = withTiming(1.02)
        }}
        onBlur={()=>{
            scaleValue.value = withTiming(1)
        }}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="white"
        keyboardType="email-address"
        inputMode="email"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: width * 0.8,
    padding: "5%",
    backgroundColor: "#222",
    borderRadius: 40,
    fontSize: 18,
    color: "white",
  },
});
