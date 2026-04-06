import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { WorkshopSession } from "@/features/workshop/types/types";

export type UpdateWorkshopSessionBody = Partial<{
  title: string;
  description: string;
  startTime: string;
}>;

export const updateWorkshopSessionRequest = async (
  workshopId: string,
  sessionId: string,
  body: UpdateWorkshopSessionBody,
): Promise<ApiResponseWithData<WorkshopSession>> => {
  return api.patch(`/workshops/${workshopId}/sessions/${sessionId}`, body);
};
