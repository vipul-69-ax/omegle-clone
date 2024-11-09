import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { height, width } from "@/constants/Screen";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedButton from "@/components/AnimatedButton";
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import AnimatedInput from "@/components/AnimatedInput";
import AuthPage from "./auth";

export default function LandingPage() {
  const scrollY = useSharedValue(0);
  const ref = useRef<Animated.ScrollView>(null);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, height / 2],
            [0, -height / 2],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, height],
            [1, 0.5],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(scrollY.value, [0, height / 4], [1, 0]),
    };
  });

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, height / 2],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });
  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      <Animated.View style={[styles.header, headerAnimatedStyles]}>
        <Text style={{ fontSize: 28, color: "white", fontWeight: 700 }}>
          ConnectEd
        </Text>
      </Animated.View>
      <Animated.ScrollView
        ref={ref}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <View style={{ flex: 1, backgroundColor: "black", height }}>
          <View>
            <Image
              source={require("@/assets/images/image.webp")}
              style={styles.image}
            />
            <LinearGradient
              colors={["transparent", "transparent", "black"]}
              style={styles.imageGradient}
            />
          </View>
          <View style={styles.contentContainer}>
            <Animated.Text style={[titleAnimatedStyle, styles.title]}>
              ConnectEd
            </Animated.Text>
            <Text style={[styles.subtitle, { marginTop: "4%" }]}>
              Collaborate, Create, Achieve Together
            </Text>
          </View>
          <View>
            <AnimatedButton
              onPress={() => {
                scrollY.value = height;
                ref.current?.scrollTo({ y: height, animated: true });
              }}
              title="Explore"
              style={{ width: width * 0.5, marginTop: "4%" }}
            />
          </View>
        </View>
        <View style={styles.authContainer}>
          <AuthPage />
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: height * 0.8,
    width,
  },
  imageGradient: {
    zIndex: 10,
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    width,
    height: 300,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 60,
    alignItems: "center",
    padding: "4%",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "white",
  },
  subtitle: {
    color: "white",
    fontSize: 30,
    maxWidth: width * 0.7,
    textAlign: "center",
    fontWeight: "600",
  },
  header: {
    width,
    height: 100,
    // backgroundColor: "black",
    justifyContent: "flex-end",
    paddingBottom: "4%",
    alignItems: "center",
    position: "absolute",
    top: 0,
    zIndex: 100,
  },
  authContainer: {
    height,
    width,
  },
});
