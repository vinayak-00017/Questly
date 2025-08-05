import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { toast } from "sonner";

export const useQuestTemplates = () => {
  const queryClient = useQueryClient();

  // Fetch quest templates
  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["questTemplates"],
    queryFn: questTemplateApi.fetchQuestTemplates,
    select: (data) => data.questTemplates || [],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: questTemplateApi.deleteQuestTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete quest template");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      questTemplateApi.toggleQuestTemplateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template status updated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  return {
    templatesData,
    isLoadingTemplates,
    deleteMutation,
    toggleStatusMutation,
  };
};
