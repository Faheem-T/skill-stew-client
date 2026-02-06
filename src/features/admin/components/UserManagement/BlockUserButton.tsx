import type {
  ApiErrorResponseType,
  ApiResponseWithMessage,
  PaginatedApiResponse,
} from "@/shared/api/baseApi";
import { updateUserBlockStatus } from "@/features/admin/api/users/UpdateUserBlockStatus";
import type { User } from "@/features/admin/api/users/GetUsers";
import { Button } from "@/shared/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import toast from "react-hot-toast";
import type { UserQueryFilters } from "@/features/admin/types/UserQueryFilters";

export const BlockUserButton: React.FC<{
  userId: string;
  currentlyBlocked: boolean;
  filters: UserQueryFilters;
}> = ({ userId, currentlyBlocked, filters }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    { id: string; newBlockStatus: boolean },
    any
  >({
    mutationFn: ({ id, newBlockStatus }) =>
      updateUserBlockStatus(id, newBlockStatus),
    onMutate() {
      const previousUserData: { pages: PaginatedApiResponse<User[]>[] } =
        queryClient.getQueryData(["users", filters])!;
      queryClient.setQueryData(
        ["users", filters],
        produce(previousUserData, (draft) => {
          draft.pages.forEach(({ data }) =>
            data.forEach((user) => {
              if (user.id === userId) {
                user.is_blocked = !currentlyBlocked;
              }
            }),
          );
        }),
      );
      return { previousUserData };
    },
    onError(_err, _vars, context) {
      queryClient.setQueryData(["users", filters], context?.previousUserData);
    },
  });

  const handleClick = () => {
    mutate(
      { id: userId, newBlockStatus: !currentlyBlocked },
      {
        onSuccess(data) {
          toast.success(data.message);
        },
        onError(err) {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <Button
      variant={currentlyBlocked ? "default" : "destructive"}
      type="button"
      disabled={isPending}
      onClick={handleClick}
    >
      {currentlyBlocked ? "Unblock" : "Block"}
    </Button>
  );
};
