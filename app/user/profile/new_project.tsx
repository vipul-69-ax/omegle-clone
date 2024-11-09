import React, { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Canvas, Circle, Path, RoundedRect } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BottomSheet from "@gorhom/bottom-sheet";

import { BasicInfoStep } from "@/components/ui/UploadComponents/BasicInfo";
import { DetailsStep } from "@/components/ui/UploadComponents/Details";
import { MediaStep } from "@/components/ui/UploadComponents/MediaStep";
import { TeamStep } from "@/components/ui/UploadComponents/TeamStep";
import { ReviewStep } from "@/components/ui/UploadComponents/ReviewStep";
import { ProgressStep } from "@/components/UploadHelpers";
import { RoleSelector } from "@/components/ui/UploadComponents/RoleSelector";
import { ProjectData, useCreateProject } from "@/hooks/useProjects";
import { useAuthStore } from "@/hooks/useAuth";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedScrollView = Animated.createAnimatedComponent(
  Animated.ScrollView
);

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const steps = ["Basic Info", "Details", "Links", "Team", "Review"];

// Zod schema for the entire form
const projectSchema = z
  .object({
    basicinfo: z.object({
      name: z.string().min(1, "Project name is required"),
      description: z
        .string()
        .min(10, "Description must be at least 10 characters long"),
    }),
    details: z.object({
      startDate: z.date(),
      endDate: z.date(),
      technologies: z
        .array(z.string())
        .min(1, "At least one technology is required"),
    }),
    links: z
      .array(
        z.object({
          title: z.string().min(1, "Link title is required"),
          link: z.string().url("Invalid URL"),
        })
      )
      .min(1, "At least one link is required"),
    team: z.object({
      team: z
        .array(
          z.object({
            name: z.string().min(1, "Team member name is required"),
            role: z.string().min(1, "Team member role is required"),
            id: z.string().min(1, "Team member id is required"),
          })
        )
        .min(1, "At least one team member is required"),
    }),
    newMember: z
      .object({
        name: z.string(),
        id: z.string(),
      })
      .optional(),
  })
  .refine((data) => data.details.startDate < data.details.endDate, {
    message: "End date must be after start date",
    path: ["details", "endDate"],
  });

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectUploadScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { token } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { mutateAsync: create_project, isPending: isLoading } =
    useCreateProject();
  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      basicinfo: {
        name: "",
        description: "",
      },
      details: {
        startDate: new Date(),
        endDate: new Date(),
        technologies: [],
      },
      links: [],
      team: {
        team: [],
      },
      newMember: {
        name: "",
        id: "",
      },
    },
  });

  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const progress = useDerivedValue(() => {
    return interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH * (steps.length - 1)],
      [0, 1],
      Extrapolate.CLAMP
    );
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = async () => {
    const currentStepName = steps[currentStep]
      .toLowerCase()
      .replace(" ", "") as keyof ProjectFormData;
    const isValid = await methods.trigger(currentStepName);

    console.log(currentStepName, isValid);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentStep + 1),
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentStep - 1),
        animated: true,
      });
    }
  };

  const onSubmit = (data: ProjectFormData) => {
    delete data["newMember"];
    console.log("Submitting project:", data);
    const projectData = {
      owner: token as string,
      project_data: data,
      verified: false,
    };
    create_project(projectData as any);
    // Here you would typically send the data to your backend
  };

  const handleRoleSelect = useCallback(
    (role: string) => {
      const { setValue, getValues } = methods;
      const currentTeam = getValues("team.team");
      const newMember = getValues("newMember");
      if (newMember) {
        setValue("team.team", [
          ...currentTeam,
          { name: newMember.name, role, id: newMember.id },
        ]);
        setValue("newMember", {
          name: "",
          id: "",
        });
      }
      bottomSheetRef.current?.close();
    },
    [methods]
  );

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <LinearGradient colors={["#001F3F", "#000000"]} style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Project</Text>
            <Text style={styles.subtitle}>
              Share your work with the community
            </Text>
          </View>

          <View style={styles.progressContainer}>
            {steps.map((step, index) => (
              <ProgressStep
                key={index}
                label={step}
                progress={progress}
                index={index}
                total={steps.length}
              />
            ))}
          </View>

          <AnimatedScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            style={styles.formContainer}
          >
            <BasicInfoStep />
            <DetailsStep />
            <MediaStep />
            <TeamStep
              setShowRolePicker={() => bottomSheetRef.current?.expand()}
            />
            <ReviewStep />
          </AnimatedScrollView>

          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <AnimatedPressable style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </AnimatedPressable>
            )}
            {isLoading ? (
              <AnimatedPressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <ActivityIndicator
                  size={16}
                  color={"white"}
                />
              </AnimatedPressable>
            ) : currentStep < steps.length - 1 ? (
              <AnimatedPressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Next
                </Text>
              </AnimatedPressable>
            ) : (
              <AnimatedPressable
                style={[styles.button, styles.primaryButton]}
                onPress={methods.handleSubmit(onSubmit)}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Submit
                </Text>
              </AnimatedPressable>
            )}
          </View>

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

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["60%"]}
          enablePanDownToClose={true}
          keyboardBehavior="interactive"
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
        >
          <RoleSelector onSelectRole={handleRoleSelect} />
        </BottomSheet>
      </View>
    </FormProvider>
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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  bottomSheetBackground: {
    backgroundColor: "#001F3F",
  },
  bottomSheetIndicator: {
    backgroundColor: "#FFFFFF",
  },
});
