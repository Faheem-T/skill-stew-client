import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { useAppStore } from "@/store";

export const HomePage = () => {
  const accessToken = useAppStore((state) => state.accessToken);
  const user = useAppStore((state) => state.user);

  const { mutate, isPending } = useLogout();

  return (
    <div>
      <div>
        Home {accessToken} {user?.username}
      </div>
      {user && (
        <Button disabled={isPending} onClick={() => mutate()}>
          Log out
        </Button>
      )}
    </div>
  );
};
