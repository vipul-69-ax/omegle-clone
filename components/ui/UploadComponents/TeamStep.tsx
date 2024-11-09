import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/UploadHelpers";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useUserSearch } from "@/hooks/useSearch";
import UserSearchResult from "./SearchResult";

interface TeamStepProps {
  setShowRolePicker: (show: boolean) => void;
}

interface UserItem {
  id: string;
  name: string;
  role: string;
  studying: string;
  university: string;
}

interface TeamMember {
  name: string;
  role: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TeamStep({ setShowRolePicker }: TeamStepProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 600);
  const { mutateAsync: search, isPending: isSearching } = useUserSearch();
  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await search(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, searchUsers]);

  const handleUserSelect = useCallback(
    (user: UserItem) => {
      console.log(user);
      setSelectedUser(user);
      setShowRolePicker(true);
    },
    [setShowRolePicker]
  );

  return (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Project Team</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Team Member Name"
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              setSearchTerm(text);
            }}
            value={value}
          />
        )}
        name="newMemberName"
      />
      <Animated.View style={styles.searchResultsContainer}>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserSearchResult
              item={item}
              handleUserSelect={(user) => {
                setValue("newMember", {
                  name: item.name,
                  id: item.id,
                });
                handleUserSelect(user);
              }}
            />
          )}
        />
      </Animated.View>
      {errors.team?.team && (
        <Text style={styles.errorText}>{errors.team.team.message}</Text>
      )}
      <ScrollView style={{marginBottom:100}}>
      {watch("team.team")?.map((member: TeamMember, index: number) => (
        <Animated.View
          key={index}
          style={styles.teamMember}
          entering={FadeIn}
          layout={Layout}
        >
          <Text style={styles.teamMemberName}>{member.name}</Text>
          <Text style={styles.teamMemberRole}>{member.role}</Text>
        </Animated.View>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    width: Dimensions.get("window").width,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  errorText: {
    color: "#FF4136",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  teamMember: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  teamMemberName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  teamMemberRole: {
    color: "#999",
    fontSize: 14,
  },
  searchResultsContainer: {
    marginBottom: 12,
  },
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  searchResultText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
