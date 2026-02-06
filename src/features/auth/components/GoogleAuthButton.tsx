import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { googleAuth } from "@/features/auth/api/googleAuth";
import { useAppStore } from "@/app/store";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import { useQueryClient } from "@tanstack/react-query";
import { RoutePath } from "@/shared/config/routes";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
  throw new Error("VITE_GOOGLE_CLIENT_ID not found. set it in your .env");
}

declare global {
  interface Window {
    googleAuthCallback: (user: any) => void;
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (payload: any) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options: Record<string, string>,
          ) => void;
        };
      };
    };
  }
}
export const GoogleLoginButton = () => {
  const googleAuthFn = googleAuth;
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  // Prevent multiple concurrent FedCM requests (Google blocks duplicate credential.get calls)
  const inFlightRef = useRef(false);

  useEffect(() => {
    const handleCredential = async (payload: any) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const { data } = await googleAuthFn(payload.credential);
        const { accessToken } = data;
        setAccessToken(accessToken);
        queryClient.invalidateQueries({
          queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
        });
        navigate(RoutePath.Dashboard, { replace: true });
      } catch (err) {
        if (
          isAxiosError<{
            success: false;
            message: string;
            error: string;
            errors?: { error: string; field?: string }[];
          }>(err) &&
          err.response
        ) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something unexpected occured during Google login");
        }
      } finally {
        inFlightRef.current = false;
      }
    };

    window.googleAuthCallback = handleCredential;

    // Load Google script only once, even if component mounts multiple times
    const existingScript = document.getElementById(
      "google-identity-script",
    ) as HTMLScriptElement | null;

    // Initialize and render button imperatively instead of using HTML nodes
    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
      });
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        shape: "rectangular",
        theme: "outline",
        text: "signin_with",
        size: "large",
        logo_alignment: "left",
      });
    };

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle, {
          once: true,
        });
      }
    } else {
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", initializeGoogle, { once: true });
      document.body.appendChild(script);
    }

    return () => {
      window.googleAuthCallback = () => {};
    };
  }, [googleAuthFn, navigate, queryClient, setAccessToken]);
  return (
    <div>
      <div ref={buttonRef} />
    </div>
  );
};
