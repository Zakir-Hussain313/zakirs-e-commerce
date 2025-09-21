import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Define API response type
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Define mutation variables
interface DeleteMutationVariables {
  ids: string[];
  deleteType: "PD" | "SD" | "RSD"; // PD = permanent delete, SD = soft delete
}

const useDeleteMutation = (queryKey: string, deleteEndpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, DeleteMutationVariables>({
    // mutationFn gets ONE argument: variables
    mutationFn: async ({ ids, deleteType }: DeleteMutationVariables) => {
      const { data: response } = await axios<ApiResponse>({
        method: deleteType === "PD" ? "DELETE" : "PUT",
        url: deleteEndpoint,
        data: { ids, deleteType },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (data) => {
      showToast("success", data.message);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      showToast("error", error.message);
    },
  });
};

export default useDeleteMutation;
