import { useAppStore } from "@/store";
import type React from "react";

export const UserDashboard: React.FC = () => {
  const user = useAppStore((state) => state.user)!;

  return <div>{user.role === "USER" && user.email}</div>;
};
