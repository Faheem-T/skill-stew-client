import { useEffect } from "react";
import toast from "react-hot-toast";
import { googleAuth } from "@/features/auth/api/googleAuth";
import { useAppStore } from "@/app/store";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { fetchProfile } from "@/features/auth/lib/fetchProfile";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
  throw new Error("VITE_GOOGLE_CLIENT_ID not found. set it in your .env");
}

declare global {
  interface Window {
    googleAuthCallback: (user: any) => void;
  }
}
export const GoogleLoginButton = () => {
  const googleAuthFn = googleAuth;
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google's authentication script dynamically
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Define the callback function
    window.googleAuthCallback = async (payload: any) => {
      try {
        const { data } = await googleAuthFn(payload.credential);
        const { accessToken } = data;
        setAccessToken(accessToken);

        await fetchProfile();

        toast.success("Logged in successfully");
        navigate("/");
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
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="1034130598395-dlkao983u8emgg5c0ti72qpega3m0pg7.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="googleAuthCallback"
        data-auto_select="false"
        data-itp_support="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};
