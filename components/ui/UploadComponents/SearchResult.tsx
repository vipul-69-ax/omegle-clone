import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface UserItem {
  id: string;
  name: string;
  role: string;
  studying: string;
  university: string;
}

interface UserSearchResultProps {
  item: UserItem;
  handleUserSelect: (user: UserItem) => void;
}

export default function UserSearchResult({ item, handleUserSelect }: UserSearchResultProps) {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout}>
      <Pressable
        style={styles.searchResult}
        onPress={() => handleUserSelect(item)}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
        <View style={styles.educationInfo}>
          <Text style={styles.studyingText}>{item.studying}</Text>
          <Text style={styles.universityText}>{item.university}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchResult: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  educationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studyingText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  universityText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
});