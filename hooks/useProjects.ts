import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "@/constants/Server";
import { queryClient } from "@/app/_layout";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";

interface Skill {
  id: string;
  name: string;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  avatar: string;
  tags: string[];
}

interface ProjectsStore {
  skills: Skill[];
  projects: Project[];
}

// Dummy data
const initialState: ProjectsStore = {
  skills: [
    { id: "1", name: "Sarah F.", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "David R.", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Anna K.", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Peter F.", avatar: "https://i.pravatar.cc/150?img=4" },
  ],
  projects: [
    {
      id: "1",
      name: "Carousel Work koller",
      description: "Interactive design implementation and review",
      progress: 75,
      avatar: "https://i.pravatar.cc/150?img=5",
      tags: ["DESIGN", "RESEARCH"],
    },
    {
      id: "2",
      name: "Dashboard Analytics",
      description: "Data visualization and analytics dashboard",
      progress: 45,
      avatar: "https://i.pravatar.cc/150?img=6",
      tags: ["DEVELOPMENT", "UI/UX"],
    },
  ],
};

export const useProjectsStore = create<ProjectsStore>()(
  persist(() => initialState, {
    name: "projects-storage",
    storage: createJSONStorage(() => AsyncStorage),
  })
);

interface TeamMember {
  name: string;
  role: string;
  id: string;
}

export interface ProjectData {
  owner: string;
  project_data: {
    basicinfo: {
      name: string;
      description: string;
    };
    details: {
      startDate: string; // ISO 8601 formatted date string
      endDate: string; // ISO 8601 formatted date string
      technologies: string[];
    };
    links: {
      title: string;
      link: string;
    }[];
    team: {
      team: TeamMember[];
    };
    newMember: {
      name: string;
      id: string;
    };
  };
  verified: boolean;
}

export const useCreateProject = () => {
  const toast = useToast();
  return useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (data: ProjectData) => {
      const request = await axios.post(`${SERVER_URL}/project/create`, data);
      return request.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["create-project"],
      });
      if (response.success) {
        router.back()
        // yehh
      } else {
        toast.show(response.message);
      }
    },
    onError: (err) => {
      queryClient.cancelQueries({
        queryKey: ["create-project"],
      });
      toast.show(err.message);
    },
  });
};
