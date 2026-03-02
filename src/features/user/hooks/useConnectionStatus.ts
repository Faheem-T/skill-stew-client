import { useQuery } from "@tanstack/react-query";
import {
  getUserConnectionStatusToUser,
  type ConnectionStatusToUserResponse,
} from "@/features/user/api/GetConnectionStatusToUser";
import type {
  ApiErrorResponseType,
  ApiResponseWithData,
} from "@/shared/api/baseApi";

export const CONNECTION_STATUS_QUERY_KEY = "connectionStatus";

export const useConnectionStatus = (
  targetId: string,
  enabled: boolean = true,
) => {
  return useQuery<
    ApiResponseWithData<ConnectionStatusToUserResponse>,
    ApiErrorResponseType
  >({
    queryKey: [CONNECTION_STATUS_QUERY_KEY, targetId],
    queryFn: () => getUserConnectionStatusToUser({ targetId }),
    enabled: !!targetId && enabled,
  });
};
