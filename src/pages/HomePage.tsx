import { useAppStore } from "@/store";

export const HomePage = () => {
  const accessToken = useAppStore((state) => state.accessToken);
  const user = useAppStore((state) => state.user);
  return (
    <div>
      Home {accessToken} {user?.username}
    </div>
  );
};

