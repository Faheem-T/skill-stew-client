import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { Socket } from "socket.io-client";
import { useSocket } from "@/shared/hooks/useSocket";
import type { Notification } from "@/features/notification/types/types";
import { NotificationToast } from "@/features/notification/components/NotificationToast";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  ApiResponseWithData,
  PaginatedApiResponse,
} from "@/shared/api/baseApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const SocketContext = createContext<React.RefObject<Socket | null> | null>(
  null,
);

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
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socketRef, queryClient, navigate]);

  return (
    <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>
  );
}
