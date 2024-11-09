import { queryClient } from "@/app/_layout";
import { SERVER_URL } from "@/constants/Server";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";

export const useUserSearch = () => {
  const toast = useToast();
  return useMutation({
    mutationKey: ["user-search"],
    mutationFn: async (searchQuery: string) => {
      const request = await axios.post(`${SERVER_URL}/search/users`, {
        searchQuery,
      });
      return request.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["user-search"],
      });
      if (response?.success) {
        return response?.data;
      } else {
        toast.show(response.message);
        return [];
      }
    },
    onError: () => {
      queryClient.cancelQueries({
        queryKey: ["user-search"],
      });
      return []
    },
  });
};
