import useCurrentUserProfile from "./useCurrentUserProfile";

export const useUserProfile = () => {
  const { data, ...rest } = useCurrentUserProfile();
  if (rest.isLoading) {
    return { data: undefined, ...rest };
  }
  if (data?.role !== "EXPERT") {
    throw new Error("useExpertProfile can only be used for EXPERT profiles");
  }
  return { data, ...rest };
};
