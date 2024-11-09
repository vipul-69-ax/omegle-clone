import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  ChevronLeft,
  Share2,
  Info,
  MapPin,
  Star,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { router, Tabs } from 'expo-router';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

interface LocationDetailProps {
  onBack?: () => void;
  onShare?: () => void;
  onInfo?: () => void;
  onBook?: () => void;
}

const images = [
  "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=3270&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=3270&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=3270&auto=format&fit=crop",
];

export default function LocationDetail({
  onBack,
  onShare,
  onInfo,
  onBook,
}: LocationDetailProps = {}) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const scrollY = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(scrollY.value > 100 ? 1 : 0),
    };
  });

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map((image) => Image.prefetch(image));
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };
    loadImages();
  }, []);

  if (!imagesLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#787F6A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()} style={styles.headerButton}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Animated.View style={[styles.headerTitle, headerStyle]}>
          <Text style={styles.headerText}>Bromo Tengger Semeru</Text>
        </Animated.View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onShare} style={styles.headerButton}>
            <Share2 color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onInfo} style={styles.headerButton}>
            <Info color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Horizontal Image FlatList */}
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.heroImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />

        {/* Content */}
        <View style={styles.content}>
          <Animated.View entering={FadeIn.delay(200)}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Bromo Tengger Semeru</Text>
              <Text style={styles.price}>$12k<Text style={styles.priceUnit}>/mo</Text></Text>
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <MapPin size={16} color="#fff" />
                <Text style={styles.locationText}>Probolinggo East Java</Text>
              </View>
              <View style={styles.locationItem}>
                <Star size={16} color="#fff" />
                <Text style={styles.reviewText}>4.9</Text>
                <Text style={styles.reviewCount}>(137 Review)</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Users size={20} color="#fff" />
              <Text style={styles.infoText}>Max 12 Group Size</Text>
            </View>
            <View style={styles.infoBox}>
              <Clock size={20} color="#fff" />
              <Text style={styles.infoText}>4 Day Trip Duration</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>
                Bromo Tengger Semeru National Park, located in East Java, Indonesia, features dramatic volcanoes, rugged landscapes, and the iconic Mount Bromo. It's a popular destination for hiking, sunrise views, and witnessing volcanic activity.
              </Text>
            </View>

            <TouchableOpacity style={styles.locationLink}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.locationLinkContent}>
                <Text style={styles.locationLinkText}>Open on maps</Text>
                <ChevronRight size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <BlurView intensity={30} tint="dark" style={styles.bottomBar}>
        <TouchableOpacity onPress={onBook} style={styles.bookingButton}>
          <Text style={styles.bookingButtonText}>Booking</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerTitle: {
    position: 'absolute',
    left: 60,
    right: 60,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  heroImage: {
    width,
    height: IMAGE_HEIGHT,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: '#999',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  reviewText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  reviewCount: {
    color: '#999',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  infoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#999',
  },
  locationLink: {
    marginTop: 8,
  },
  locationLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locationLinkText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 32,
  },
  bookingButton: {
    backgroundColor: '#FF69B4',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});