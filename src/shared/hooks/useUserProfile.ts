import useCurrentUserProfile from "./useCurrentUserProfile";
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";

export type UserProfile = Extract<CurrentUserProfile, { role: "USER" }>;

export const useUserProfile = () => {
  const { data, ...rest } = useCurrentUserProfile();
  if (rest.isLoading) {
    return { data: undefined, ...rest };
  }
  if (data?.role !== "USER") {
    console.log("DATA:", data);
    throw new Error("useUserProfile can only be used for USER profiles");
  }
  return { data, ...rest };
};
