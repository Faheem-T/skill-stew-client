import { useAppStore } from "@/app/store";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://ws.stew.stew";
const WS_PATH = "/socket.io";

/**
 * Manages a singleton Socket.IO connection that is active while mounted.
 * Authenticates with the access token from the app store.
 */
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAppStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(WS_URL, {
      path: WS_PATH,
      autoConnect: false,
      auth: {
        token: `Bearer ${accessToken}`,
      },
    });

    socket.on("connect", () => {
      console.log("[socket] connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] connection error:", err.message);
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  return socketRef;
}
