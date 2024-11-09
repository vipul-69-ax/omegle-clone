import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Canvas, Circle, Path, RoundedRect } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ProjectDetailScreen from "@/components/ui/ProjectComponents/DetailScreen";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Project {
  name: string;
  description: string;
  tech: string[];
  role: string;
  owner: string;
  link: string;
}

const currentProjects: Project[] = [
  {
    name: "AI Ethics Research",
    description: "Investigating ethical implications of AI in healthcare",
    tech: ["Python", "TensorFlow", "Ethical AI"],
    role: "Lead Researcher",
    owner: "Dr. Emily Chen",
    link: "https://github.com/example/ai-ethics-research",
  },
  {
    name: "Quantum Computing Simulator",
    description:
      "Building a quantum circuit simulator for educational purposes",
    tech: ["C++", "CUDA", "Quantum Algorithms"],
    role: "Software Developer",
    owner: "Prof. Michael Johnson",
    link: "https://quantumsimulator.edu",
  },
];

const pastProjects: Project[] = [
  {
    name: "Green Energy Optimization",
    description:
      "Developed algorithms to optimize renewable energy distribution",
    tech: ["Python", "Pandas", "Scikit-learn"],
    role: "Data Scientist",
    owner: "Dr. Sarah Williams",
    link: "https://github.com/example/green-energy-opt",
  },
  {
    name: "Smart City Traffic Management",
    description: "Implemented IoT-based traffic management system",
    tech: ["IoT", "Java", "MongoDB"],
    role: "System Architect",
    owner: "Prof. Robert Brown",
    link: "https://smartcity.gov/traffic",
  },
];

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ title, isActive, onPress }: TabButtonProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isActive ? "rgba(0, 122, 255, 0.2)" : "transparent",
        { duration: 300 }
      ),
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.tabButton, animatedStyle]}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.05 : 1);
  };

  const openLink = () => {
    Linking.openURL(project.link);
  };

  const [showModal, setShowModal] = useState(false)


  return (
    <Pressable onPress={() => {setShowModal(true)}}>
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={()=>setShowModal(false)}
      >
        <View style={{flex:1}}>
          <ProjectDetailScreen
            onClose={()=>setShowModal(false)}
          />
        </View>
      </Modal>
      <AnimatedBlurView
        intensity={20}
        tint="dark"
        style={[styles.projectCard, animatedStyle]}
      >
        <View style={styles.projectHeader}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Pressable onPress={openLink} style={styles.linkButton}>
            <Ionicons name="link" size={24} color="#007AFF" />
          </Pressable>
        </View>
        <Text style={styles.projectDescription}>{project.description}</Text>
        <View style={styles.techContainer}>
          {project.tech.map((tech, index) => (
            <View key={index} style={styles.techBadge}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>
        <View style={styles.projectFooter}>
          <View style={styles.roleContainer}>
            <Ionicons name="person" size={16} color="#999" />
            <Text style={styles.roleText}>{project.role}</Text>
          </View>
          <View style={styles.ownerContainer}>
            <Ionicons name="school" size={16} color="#999" />
            <Text style={styles.ownerText}>{project.owner}</Text>
          </View>
        </View>
      </AnimatedBlurView>
    </Pressable>
  );
}

export default function MyProjectsScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const onTabPress = (index: number) => {
    setActiveTab(index);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    if (x === 0) {
      setActiveTab(0);
    }
    if (x === SCREEN_WIDTH) {
      setActiveTab(1);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#001F3F", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>My Projects</Text>
          <Text style={styles.subtitle}>Your collaborations</Text>
        </View>

        <View style={styles.tabContainer}>
          <TabButton
            title="Current"
            isActive={activeTab === 0}
            onPress={() => onTabPress(0)}
          />
          <TabButton
            title="Past"
            isActive={activeTab === 1}
            onPress={() => onTabPress(1)}
          />
        </View>

        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.projectsContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currentProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </ScrollView>
          </View>
          <View style={styles.projectsContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {pastProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </ScrollView>
          </View>
        </Animated.ScrollView>

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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#999",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  activeTabButtonText: {
    color: "#FFFFFF",
  },
  projectsContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  projectCard: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 20,
    marginBottom: 20,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  linkButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  projectDescription: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  techContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  techBadge: {
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  techText: {
    color: "#007AFF",
    fontSize: 14,
  },
  projectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleText: {
    color: "#999",
    marginLeft: 8,
    fontSize: 14,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerText: {
    color: "#999",
    marginLeft: 8,
    fontSize: 14,
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