import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Circle, Path } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface UserProfile {
  bio: string;
  studying: string;
  interests: string[];
  university: string;
  role: string;
}

interface UserProfileCardProps {
  profile: UserProfile;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 500;

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  const [expandedSection, setExpandedSection] = useState<keyof UserProfile | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        {
          rotate: `${interpolate(
            translateX.value,
            [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
            [-10, 0, 10]
          )}deg`,
        },
      ],
    };
  });

  const renderSection = (key: keyof UserProfile, title: string) => {
    const isExpanded = expandedSection === key;
    return (
      <Pressable
        style={[styles.section, isExpanded && styles.expandedSection]}
        onPress={() => setExpandedSection(isExpanded ? null : key)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {isExpanded && (
          <Animated.Text
            style={[styles.sectionContent, { opacity: withSpring(1) }]}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {Array.isArray(profile[key])
              ? (profile[key] as string[]).join(', ')
              : profile[key]}
          </Animated.Text>
        )}
      </Pressable>
    );
  };

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={['#001F3F', '#000000']}
          style={styles.gradient}
        >
          <Canvas style={styles.canvas}>
            <Circle cx={CARD_WIDTH * 0.8} cy={CARD_HEIGHT * 0.2} r={50} color="rgba(0, 122, 255, 0.1)" />
            <Path
              path="M10,30 Q50,10 90,30 T170,30"
              color="rgba(0, 122, 255, 0.2)"
              style="stroke"
              strokeWidth={5}
            />
          </Canvas>
          <View style={styles.content}>
            <Text style={styles.role}>{profile.role}</Text>
            <Text style={styles.university}>{profile.university}</Text>
            {renderSection('bio', 'Bio')}
            {renderSection('studying', 'Studying')}
            {renderSection('interests', 'Interests')}
          </View>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  role: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  university: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  expandedSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 22,
  },
});