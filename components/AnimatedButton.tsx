import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { width } from "@/constants/Screen";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ButtonProps = {
  style?: ViewStyle;
  title: string;
  titleStyle?: TextStyle;
};

export default function AnimatedButton({
  style,
  title,
  titleStyle,
}: ButtonProps) {
  const buttonScale = useSharedValue(1);
  const scaleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: buttonScale.value,
        },
      ],
    };
  });
  const tapGesture = Gesture.Tap()
    .onBegin((i) => {

        buttonScale.value = withTiming(0.9)
    })
    .onFinalize((i) => {
        buttonScale.value = withTiming(1)
    });
  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={scaleStyles}>
        <Pressable style={[styles.button, style]}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "pink",
    width: width * 0.7,
    alignSelf: "center",
    padding: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    color: "#222",
  },
});
