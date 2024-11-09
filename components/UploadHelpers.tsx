import React, { ReactNode } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface InputProps {
  placeholder: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  value: string;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

export function Input({
  placeholder,
  onBlur,
  onChangeText,
  value,
  multiline,
  numberOfLines,
  error,
}: InputProps) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        onBlur={onBlur}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}


export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <View style={styles.cardHeader}>{children}</View>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.cardTitle}>{children}</Text>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.cardDescription}>{children}</Text>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <View style={styles.cardContent}>{children}</View>;
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

import Animated, { useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';

interface ProgressStepProps {
  label: string;
  progress: Animated.SharedValue<number>;
  index: number;
  total: number;
}

export function ProgressStep({ label, progress, index, total }: ProgressStepProps) {
  const stepProgress = useAnimatedStyle(() => {
    const stepValue = interpolate(
      progress.value,
      [index / total, (index + 1) / total],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: withTiming(stepValue === 1 ? '#007AFF' : 'rgba(255, 255, 255, 0.2)'),
      width: withTiming(stepValue > 0 ? 40 : 20),
      height: withTiming(stepValue > 0 ? 40 : 20),
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
    color: withTiming(progress.value > index / total ? '#FFFFFF' : '#999'),
    fontWeight: progress.value > index / total ? 'bold' : 'normal',
  }));

  return (
    <View style={styles.progressStep}>
      <Animated.View style={[styles.progressDot, stepProgress]} />
      <Animated.Text style={[styles.progressLabel, labelStyle]}>{label}</Animated.Text>
    </View>
  );
}


const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF4136",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF4136",
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#999",
  },
  cardContent: {
    padding: 16,
  },
  badge: {
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#007AFF",
    fontSize: 12,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#999',
    fontSize: 12,
  }
});