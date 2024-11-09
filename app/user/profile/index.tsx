import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Canvas, Circle, Path, RoundedRect } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { useUserProfileStore } from "@/hooks/useUserProfile";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function MenuItem({ icon, title, subtitle, onPress }: MenuItemProps) {
  return (
    <AnimatedTouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuText}>{title}</Text>
        <Text style={styles.menuSubtext}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </AnimatedTouchableOpacity>
  );
}

export default function ProfileScreen() {
  const scale = useSharedValue(1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileData = useUserProfileStore((s) => s.profile);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.05 : 1);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#001F3F", "#000000"]} style={styles.gradient}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: "https://png.pngtree.com/png-vector/20240204/ourlarge/pngtree-avatar-job-student-flat-portrait-of-man-png-image_11606889.png" }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.role}>{profileData.role}, {profileData.studying}</Text>
                <Text style={styles.university}>{profileData.university}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statLabel}>Collaborators</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3.9k</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>

            <View style={styles.projectsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Projects</Text>
                <Text style={styles.seeAll}>See all</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.projectsScroll}
              >
                {["AI Ethics", "Quantum Computing", "Green Tech"].map(
                  (project, index) => (
                    <View key={index} style={styles.projectPreview}>
                      <View style={styles.projectIcon}>
                        <Ionicons
                          name="bulb-outline"
                          size={24}
                          color="#007AFF"
                        />
                      </View>
                      <Text style={styles.projectName}>{project}</Text>
                      <Text style={styles.projectMembers}>5 members</Text>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
            
            <View style={styles.menuContainer}>
              <AnimatedBlurView
                intensity={20}
                tint="dark"
                style={[styles.blurView, animatedStyle]}
              >
                <MenuItem
                  icon="folder"
                  title="My Projects"
                  subtitle="12 active projects"
                  onPress={() => {
                    router.push("/user/profile/my_projects");
                  }}
                />
                <MenuItem
                  icon="people"
                  title="New Project"
                  subtitle="Start a fresh project"
                  onPress={() => {
                    router.push("/user/profile/new_project");
                  }}
                />
                <MenuItem
                  icon="school"
                  title="Academic Profile"
                  subtitle="Publications & Research"
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                  }}
                />
                <MenuItem
                  icon="settings-sharp"
                  title="Settings"
                  subtitle="App preferences"
                  onPress={handlePress}
                />
              </AnimatedBlurView>
            </View>
          </View>
        </ScrollView>

        <Canvas style={styles.canvas}>
          <RoundedRect
            x={300}
            y={100}
            width={100}
            height={100}
            r={20}
            color="rgba(0, 122, 255, 0.1)"
          />
          <Circle cx={50} cy={200} r={30} color="rgba(0, 122, 255, 0.1)" />
          <Path
            path="M10,30 Q50,10 90,30 T170,30"
            color="rgba(0, 122, 255, 0.2)"
            style="stroke"
            strokeWidth={5}
          />
        </Canvas>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  bottomSheetBackground: {
    backgroundColor: '#001F3F',
  },
  bottomSheetIndicator: {
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#999",
    marginBottom: 2,
  },
  university: {
    fontSize: 14,
    color: "#007AFF",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  projectsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
  },
  projectsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  projectPreview: {
    marginRight: 16,
    alignItems: "center",
    width: 100,
  },
  projectIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  projectName: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  projectMembers: {
    fontSize: 12,
    color: "#999",
  },
  menuContainer: {
    marginTop: 8,
  },
  blurView: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  menuSubtext: {
    fontSize: 14,
    color: "#999",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});