/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import { useSocket } from "@/shared/hooks/useSocket";
import {
  NotificationType,
  type Notification,
} from "@/features/notification/types/types";
import { NotificationToast } from "@/features/notification/components/NotificationToast";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  ApiResponseWithData,
  PaginatedApiResponse,
} from "@/shared/api/baseApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";

const SocketContext = createContext<React.RefObject<Socket | null> | null>(
  null,
);

const APPROVAL_LOGOUT_DELAY_MS = 1500;

export function useSocketContext() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socketRef = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useCurrentUserProfile();
  const { mutate: logout } = useLogout();
  const approvalLogoutTimerRef = useRef<number | null>(null);
  const approvalLogoutTriggeredRef = useRef(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      // Show custom toast in top-right
      toast.custom(
        (t) => (
          <NotificationToast
            notification={notification}
            toastId={t.id}
            onNavigate={(path) => navigate(path)}
          />
        ),
        {
          position: "top-right",
          duration: 5000,
        },
      );

      // Increment the unread count in the query cache
      queryClient.setQueryData<ApiResponseWithData<{ count: number }>>(
        ["notifications-unread-count"],
        (old) => {
          if (!old) return { success: true, data: { count: 1 } };
          return {
            ...old,
            data: { count: old.data.count + 1 },
          };
        },
      );

      // Prepend the notification to the infinite query cache
      queryClient.setQueryData<
        InfiniteData<PaginatedApiResponse<Notification[]>>
      >(["notifications"], (old) => {
        if (!old) return old;
        const [firstPage, ...restPages] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: [notification, ...firstPage.data],
            },
            ...restPages,
          ],
        };
      });

      if (
        notification.data.type === NotificationType.EXPERT_APPLICATION_APPROVED &&
        userProfile?.role === "EXPERT_APPLICANT" &&
        !approvalLogoutTriggeredRef.current
      ) {
        approvalLogoutTriggeredRef.current = true;
        approvalLogoutTimerRef.current = window.setTimeout(() => {
          logout();
        }, APPROVAL_LOGOUT_DELAY_MS);
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socketRef, queryClient, navigate, logout, userProfile?.role]);

  useEffect(() => {
    return () => {
      if (approvalLogoutTimerRef.current !== null) {
        window.clearTimeout(approvalLogoutTimerRef.current);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}
