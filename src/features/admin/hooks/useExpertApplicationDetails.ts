import { getExpertApplicationDetails } from "@/features/admin/api/experts/GetExpertApplicationDetails";
import { useQuery } from "@tanstack/react-query";

export function useExpertApplicationDetails(id?: string) {
  return useQuery({
    queryKey: ["expert-application", id],
    queryFn: async () => getExpertApplicationDetails(id!),
    enabled: Boolean(id),
  });
}

