import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Canvas, Circle, Path, RoundedRect } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Video, AVPlaybackStatus } from "expo-av";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface ProjectData {
  name: string;
  description: string;
  tech: string[];
  owner: string;
  status: string;
  startDate: string;
  endDate: string;
  links: { title: string; url: string }[];
  collaborators: { name: string; role: string; avatar: string }[];
  media: { type: "image" | "video"; url: string; thumbnail?: string }[];
}

const projectData: ProjectData = {
  name: "AI Ethics Research",
  description:
    "Our project investigates the ethical implications of AI in healthcare, focusing on patient privacy, algorithmic bias, and decision-making transparency. We aim to develop guidelines for responsible AI implementation in medical settings.",
  tech: ["Python", "TensorFlow", "Ethical AI", "Healthcare Informatics"],
  owner: "Dr. Emily Chen",
  status: "In Progress",
  startDate: "2023-03-15",
  endDate: "2024-03-14",
  links: [
    {
      title: "GitHub Repository",
      url: "https://github.com/example/ai-ethics-research",
    },
    { title: "Project Website", url: "https://ai-ethics-healthcare.edu" },
    {
      title: "Latest Publication",
      url: "https://journal.ai/our-latest-findings",
    },
  ],
  collaborators: [
    {
      name: "Dr. Emily Chen",
      role: "Principal Investigator",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "John Doe",
      role: "Data Scientist",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Jane Smith",
      role: "Ethical AI Specialist",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Alex Johnson",
      role: "Healthcare Consultant",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ],
  media: [
    { type: "image", url: "/placeholder.svg?height=200&width=300" },
    { type: "image", url: "/placeholder.svg?height=200&width=300" },
    {
      type: "video",
      url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
  ],
};

interface MediaItemProps {
  item: ProjectData["media"][0];
}

function MediaItem({ item }: MediaItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (item.type === "image") {
    return (
      <View style={styles.mediaItem}>
        <Image
          source={{ uri: item.url }}
          style={styles.mediaImage}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    );
  } else if (item.type === "video") {
    return (
      <View style={styles.mediaItem}>
        <Video
          source={{ uri: item.url }}
          style={styles.mediaVideo}
          useNativeControls
          isLooping
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
            }
          }}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    );
  }

  return null;
}

interface DetailItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Ionicons
        name={icon}
        size={20}
        color="#007AFF"
        style={styles.detailIcon}
      />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

interface LinkItemProps {
  title: string;
  url: string;
}

function LinkItem({ title, url }: LinkItemProps) {
  const openLink = () => {
    Linking.openURL(url);
  };

  return (
    <Pressable onPress={openLink} style={styles.linkItem}>
      <Ionicons name="link" size={20} color="#007AFF" style={styles.linkIcon} />
      <Text style={styles.linkText}>{title}</Text>
    </Pressable>
  );
}

interface CollaboratorItemProps {
  collaborator: ProjectData["collaborators"][0];
}

function CollaboratorItem({ collaborator }: CollaboratorItemProps) {
  return (
    <View style={styles.collaboratorItem}>
      <Image
        source={{ uri: collaborator.avatar }}
        style={styles.collaboratorAvatar}
      />
      <View style={styles.collaboratorInfo}>
        <Text style={styles.collaboratorName}>{collaborator.name}</Text>
        <Text style={styles.collaboratorRole}>{collaborator.role}</Text>
      </View>
    </View>
  );
}

export default function ProjectDetailScreen({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#001F3F", "#000000"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Entypo
              name="cross"
              size={24}
              style={{ marginRight: 8 }}
              onPress={onClose}
              color={"white"}
            />
            <Text style={styles.title}>{projectData.name}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{projectData.status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media</Text>
            <FlatList
              horizontal
              data={projectData.media}
              renderItem={({ item }) => <MediaItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              style={styles.mediaList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{projectData.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technologies</Text>
            <View style={styles.techContainer}>
              {projectData.tech.map((tech, index) => (
                <View key={index} style={styles.techBadge}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            <DetailItem icon="person" label="Owner" value={projectData.owner} />
            <DetailItem
              icon="calendar"
              label="Start Date"
              value={projectData.startDate}
            />
            <DetailItem
              icon="calendar"
              label="End Date"
              value={projectData.endDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            {projectData.links.map((link, index) => (
              <LinkItem key={index} title={link.title} url={link.url} />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collaborators</Text>
            {projectData.collaborators.map((collaborator, index) => (
              <CollaboratorItem key={index} collaborator={collaborator} />
            ))}
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
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF00",
    marginRight: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
  },
  mediaList: {
    marginHorizontal: -20,
  },
  mediaItem: {
    width: 200,
    height: 150,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  mediaVideo: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  techContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    color: "#999999",
    fontSize: 16,
    marginRight: 8,
  },
  detailValue: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  linkIcon: {
    marginRight: 8,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
  },
  collaboratorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  collaboratorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  collaboratorRole: {
    color: "#999999",
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
