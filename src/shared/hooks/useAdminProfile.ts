import useCurrentUserProfile from "./useCurrentUserProfile";

export const useAdminProfile = () => {
  const { data, ...rest } = useCurrentUserProfile();
  if (rest.isLoading) {
    return { data: undefined, ...rest };
  }
  if (data?.role !== "ADMIN") {
    throw new Error("useAdminProfile can only be used for ADMIN profiles");
  }
  return { data, ...rest };
};
