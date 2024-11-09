import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient as SkiaLinearGradient,
  vec,
} from "@shopify/react-native-skia";
import { useLogin, useSignup } from "@/hooks/useAuth";

const { width, height } = Dimensions.get("window");

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: signup, isPending: signupStatus } = useSignup();
  const { mutateAsync: login, isPending: loginStatus } = useLogin();
  const animation = useSharedValue(0);

  const handleSubmit = async () => {
    if (isLogin) {
      await login({
        email,
        password,
      });
    } else {
      await signup({
        email,
        password,
      });
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      animation.value,
      [0, 0.5, 1],
      [1, 1.1, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <LinearGradient
      colors={["#000", "#222"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Canvas style={styles.canvas}>
          <Group blendMode="softLight">
            <Circle cx={0} cy={0} r={200}>
              <SkiaLinearGradient
                start={vec(0, 0)}
                end={vec(200, 200)}
                colors={["#00C851", "#007AFF"]}
              />
            </Circle>
            <Circle cx={width} cy={height} r={300}>
              <SkiaLinearGradient
                start={vec(width, height)}
                end={vec(width - 300, height - 300)}
                colors={["#007AFF", "#007AFF"]}
              />
            </Circle>
          </Group>
        </Canvas>
        <Animated.View style={[styles.card, animatedStyles]}>
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Join the Journey"}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Log in to your account" : "Create your account"}
          </Text>

          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={24}
              color="#A0A0A0"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={24}
              color="#A0A0A0"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loginStatus || signupStatus}
          >
            {loginStatus || signupStatus ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Log In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: "rgba(25, 25, 25, 0.8)",
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#007AFF",
    marginTop: 20,
  },
});
