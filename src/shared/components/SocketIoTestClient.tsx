import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type LogLevel = "info" | "error" | "event";

type LogEntry = {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: string;
};

const DEFAULT_URL = "http://ws.stew.stew";
const DEFAULT_PATH = "/socket.io";
const MAX_LOGS = 200;

export default function SocketIoTestClient() {
  const socketRef = useRef<Socket | null>(null);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [path, setPath] = useState(DEFAULT_PATH);
  const [status, setStatus] = useState("disconnected");
  const [eventName, setEventName] = useState("ping");
  const [payload, setPayload] = useState('{"message":"hello"}');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const appendLog = (level: LogLevel, message: string) => {
    const entry: LogEntry = {
      id: Date.now() + Math.random(),
      level,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
    });
  };

  const connect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(url, {
      path,
      //   transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect", () => {
      setStatus("connected");
      appendLog("info", `Connected with id ${socket.id ?? "unknown"}`);
    });

    socket.on("disconnect", (reason) => {
      setStatus("disconnected");
      appendLog("info", `Disconnected: ${reason}`);
    });

    socket.on("connect_error", (error) => {
      setStatus("error");
      appendLog("error", `Connect error: ${error.message}`);
    });

    socket.on("error", (error) => {
      appendLog("error", `Error: ${String(error)}`);
    });

    socket.onAny((event, ...args) => {
      appendLog("event", `Event ${event}: ${JSON.stringify(args)}`);
    });

    socket.connect();

    setStatus("connecting");
    appendLog("info", `Connecting to ${url}${path}`);

    socketRef.current = socket;
  };

  const disconnect = () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.disconnect();
    socketRef.current = null;
    setStatus("disconnected");
    appendLog("info", "Disconnected by client");
  };

  const sendEvent = () => {
    if (!socketRef.current || !socketRef.current.connected) {
      appendLog("error", "Not connected");
      return;
    }

    try {
      const parsed = payload.trim() ? JSON.parse(payload) : undefined;
      socketRef.current.emit(eventName, parsed);
      appendLog("info", `Emitted ${eventName} with ${payload || "(empty)"}`);
    } catch (error) {
      appendLog("error", `Invalid JSON payload: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <section className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-stone-900">
          Socket.IO Test Client
        </h2>
        <p className="text-sm text-stone-600">
          Minimal client for validating your Socket.IO server connection.
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Server URL
          <input
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="http://localhost:3000"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Path
          <input
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder="/socket.io"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-stone-700">
          Status: <span className="font-semibold text-stone-900">{status}</span>
        </span>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          onClick={connect}
        >
          Connect
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Event name
          <input
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
            placeholder="ping"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          JSON payload
          <input
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            placeholder='{"message":"hello"}'
          />
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-stone-800 hover:opacity-90"
          onClick={sendEvent}
        >
          Send event
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">
          Logs
        </div>
        <ul className="max-h-64 space-y-2 overflow-auto px-4 py-3 text-xs text-stone-700">
          {logs.length === 0 ? (
            <li className="text-stone-500">No events yet.</li>
          ) : (
            logs.map((entry) => (
              <li key={entry.id} className="flex gap-2">
                <span className="text-stone-400">{entry.timestamp}</span>
                <span
                  className={
                    entry.level === "error"
                      ? "text-red-600"
                      : entry.level === "event"
                        ? "text-emerald-700"
                        : "text-stone-700"
                  }
                >
                  {entry.message}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
