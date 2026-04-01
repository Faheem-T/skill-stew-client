import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { WorkshopSession } from "@/features/workshop/types/types";

export type ReplaceWorkshopSessionsBody = {
  timezone: string;
  sessions: Array<{
    weekNumber: number;
    dayOfWeek: number;
    sessionOrder: number;
    startTime: string;
  }>;
};

export const replaceWorkshopSessionsRequest = async (
  workshopId: string,
  body: ReplaceWorkshopSessionsBody,
): Promise<ApiResponseWithData<WorkshopSession[]>> => {
  return api.post(`/workshops/${workshopId}/sessions`, body);
};
