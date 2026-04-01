import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type {
  WorkshopListItem,
  WorkshopStatus,
} from "@/features/workshop/types/types";

export const getWorkshopsRequest = async (status?: WorkshopStatus) => {
  return api.get<
    string,
    ApiResponseWithData<WorkshopListItem[]>
  >("/workshops", {
    params: status ? { status } : undefined,
  });
};
