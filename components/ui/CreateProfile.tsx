import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateUserProfile,
  useUserProfileStore,
} from "@/hooks/useUserProfile";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import InterestsBottomSheet from "@/components/ui/InterestBottomSheet";
import { useToast } from "react-native-toast-notifications";

const userProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().optional(),
  studying: z.string().min(1, "Studying field is required"),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  university: z.string().min(1, "University is required"),
  role: z.string().min(1, "Role is required"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export default function ProfileForm() {
  const profile = useUserProfileStore((state) => state.profile);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const toast = useToast();
  const { mutateAsync: create, isPending: creating } = useCreateUserProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: profile,
  });

  const interests = watch("interests") || [];

  const onSubmit = (data: UserProfileFormData) => {
    create(data);
  };

  const handleSelectInterest = useCallback(
    (interest: string) => {
      const currentInterests = getValues("interests") || [];
      if (currentInterests.includes(interest)) {
        const updatedInterests = currentInterests.filter((i) => i !== interest);
        setValue("interests", updatedInterests, { shouldValidate: true });
        return;
      }
      if (getValues("interests")?.length > 5) {
        toast.show("Select upto five only.");
        return;
      }
      const updatedInterests = interests.includes(interest)
        ? interests.filter((i) => i !== interest)
        : [...interests, interest];
      setValue("interests", updatedInterests, { shouldValidate: true });
    },
    [interests, setValue]
  );

  const openInterestsBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                <Text style={styles.header}>User Profile</Text>
                <Text style={styles.subheader}>
                  Please provide your details for project collaboration.
                </Text>
              </Animated.View>
              
              {["name", "studying", "university", "role", "bio"].map(
                (field, index) => (
                  <Animated.View
                    key={field}
                    entering={FadeInUp.duration(600).delay(200 + index * 100)}
                    style={styles.inputContainer}
                  >
                    <Text style={styles.label}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            field === "bio" ? styles.textArea : styles.input,
                            errors[field] && styles.inputError,
                          ]}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          placeholder={`Enter your ${field}`}
                          placeholderTextColor="#666"
                          multiline={field === "bio"}
                          numberOfLines={field === "bio" ? 4 : 1}
                        />
                      )}
                      name={field as keyof UserProfileFormData}
                    />
                    {errors[field] && (
                      <Text style={styles.errorText}>
                        {errors[field]?.message}
                      </Text>
                    )}
                  </Animated.View>
                )
              )}

              <Animated.View
                entering={FadeInUp.duration(600).delay(600)}
                style={styles.inputContainer}
              >
                <Text style={styles.label}>Interests</Text>
                <TouchableOpacity
                  style={styles.interestsContainer}
                  onPress={openInterestsBottomSheet}
                >
                  {interests.length > 0 ? (
                    <View style={styles.badgeContainer}>
                      {interests.map((interest) => (
                        <View key={interest} style={styles.badge}>
                          <Text style={styles.badgeText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Select your interests
                    </Text>
                  )}
                </TouchableOpacity>
                {errors.interests && (
                  <Text style={styles.errorText}>
                    {errors.interests.message}
                  </Text>
                )}
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(600).delay(700)}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <InterestsBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          onSelectInterest={handleSelectInterest}
          selectedInterests={interests}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007AFF",
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#CCC",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#1E1E1E",
    color: "#FFF",
  },
  inputError: {
    borderColor: "#FF4444",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  interestsContainer: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#1E1E1E",
    minHeight: 48,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 14,
  },
  placeholderText: {
    color: "#666",
  },
});
