import { SERVER_URL } from "@/constants/Server";
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfileFormData } from "@/components/ui/CreateProfile";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/_layout";
import { useToast } from "react-native-toast-notifications";
import { useAuthStore } from "./useAuth";

export const useProfileExists = (token: string | null) => {
  const [hasMadeProfile, setHasMadeProfile] = useState<boolean | null>(null);
  if (token == null) return false;
  useEffect(() => {
    async function fetchProfile() {
      const res = await axios.post(
        `${SERVER_URL}/profile/exists`,
        {
          token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHasMadeProfile(res.data.success);
    }
    fetchProfile();
  }, []);

  return hasMadeProfile;
};

export const useCreateUserProfile = () => {
  const toast = useToast();
  const updateProfile = useUserProfileStore((state) => state.updateProfile);
  const { token } = useAuthStore();
  return useMutation({
    mutationKey: ["create-profile"],
    mutationFn: async (data: UserProfileFormData) => {
      const request = await axios.post(`${SERVER_URL}/profile/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return request.data;
    },
    onSuccess: (response, variables) => {
      console.log("succeeded");
      queryClient.invalidateQueries({
        queryKey: ["create-profile"],
      });
      if (response?.success) {
        updateProfile(variables);
      } else {
        console.log(response);
        toast.show(response?.message, {
          duration: 2000,
          textStyle: { fontWeight: "normal" },
        });
      }
    },
    onError: (error) => {
      console.log(error.message);
      queryClient.cancelQueries({
        queryKey: ["create-profile"],
      });
    },
  });
};

interface UserProfile {
  name: string;
  bio: string;
  studying: string;
  interests: string[];
  university: string;
  role: string;
}

interface UserProfileStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const initialProfile: UserProfile = {
  name: "",
  bio: "",
  studying: "",
  interests: [],
  university: "",
  role: "",
};

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set) => ({
      profile: initialProfile,
      resetProfile: () => set({ profile: initialProfile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
