import { queryClient } from "@/app/_layout";
import { SERVER_URL } from "@/constants/Server";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import { router } from "expo-router";

const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const useSignup = () => {
  const toast = useToast();
  const {saveToken} = useAuthStore()
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: Record<string, string>) => {
      await authSchema.parseAsync(data);
      const request = await axios.post(`${SERVER_URL}/auth/signup`, data);
      return request.data;
    },
    onSuccess: (response) => {
      console.log("succeeded");
      queryClient.invalidateQueries({
        queryKey: ["signup"],
      });
      if (response?.success) {
        console.log(response);
        saveToken(response.token)
        router.replace("/user/home")
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
        queryKey: ["signup"],
      });
    },
  });
};

export const useLogin = () => {
  const toast = useToast();
  const {saveToken} = useAuthStore()
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: Record<string, string>) => {
      await authSchema.parseAsync(data);
      const request = await axios.post(`${SERVER_URL}/auth/login`, data);
      return request.data;
    },
    onSuccess: (response) => {
      console.log("succeeded");
      queryClient.invalidateQueries({
        queryKey: ["login"],
      });
      if (response?.success) {
        console.log(response);
        saveToken(response.token)
        router.replace("/user/home")
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
        queryKey: ["login"],
      });
    },
  });
};

interface AuthState {
  token: string | null;
  saveToken: (token: string) => void;
  deleteToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      saveToken: (token) => set({ token }),

      // Remove token from state
      deleteToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
