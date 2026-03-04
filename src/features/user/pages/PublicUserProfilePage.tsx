import {
  MapPin,
  Globe,
  Clock,
  Languages,
  Link as LinkIcon,
  UserPlus,
  Check,
  Loader2,
  UserCheck,
  ArrowLeft,
  ShieldCheck,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { usePublicUserProfile } from "@/features/user/hooks/usePublicUserProfile";
import {
  useConnectionStatus,
  CONNECTION_STATUS_QUERY_KEY,
} from "@/features/user/hooks/useConnectionStatus";
import { useAppStore } from "@/app/store";
import { sendConnectionRequest } from "@/features/user/api/SendConnectionRequest";
import { acceptConnectionRequest } from "@/features/user/api/AcceptConnectionRequest";
import { rejectConnectionRequest } from "@/features/user/api/RejectConnectionRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApiResponseWithData,
  type ApiErrorResponseType,
  type ApiResponseWithMessage,
} from "@/shared/api/baseApi";
import toast from "react-hot-toast";
import ISO6391 from "iso-639-1";
import type { ConnectionStatusToUserResponse } from "@/features/user/api/GetConnectionStatusToUser";

const getLanguageName = (code: string): string => {
  return ISO6391.getName(code) || code;
};

type ConnectionStatus = ConnectionStatusToUserResponse["status"];

const ConnectButton = ({
  status,
  onConnect,
  isConnecting,
}: {
  status: ConnectionStatus;
  onConnect: () => void;
  isConnecting: boolean;
}) => {
  switch (status) {
    case "NONE":
      return (
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="rounded-lg px-6 h-10 font-medium"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {isConnecting ? "Sending..." : "Connect"}
        </Button>
      );

    case "PENDING_SENT":
      return (
        <Button
          variant="outline"
          disabled
          className="border-yellow-300 bg-yellow-50 text-yellow-800 rounded-lg px-6 h-10 font-medium cursor-default"
        >
          <Clock className="w-4 h-4" />
          Request Sent
        </Button>
      );

    case "PENDING_RECEIVED":
      // Handled separately via IncomingRequestBanner
      return null;

    case "CONNECTED":
      return (
        <Button
          variant="outline"
          disabled
          className="border-green-500 bg-green-100 text-green-800 rounded-lg px-6 h-10 font-semibold cursor-default"
        >
          <UserCheck className="w-4 h-4" />
          Connected
        </Button>
      );

    default:
      return null;
  }
};

const IncomingRequestBanner = ({
  userName,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: {
  userName: string;
  onAccept: () => void;
  onReject: () => void;
  isAccepting: boolean;
  isRejecting: boolean;
}) => {
  const isBusy = isAccepting || isRejecting;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <UserPlus className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900 text-sm">
            Connection Request
          </p>
          <p className="text-blue-700 text-sm">
            <span className="font-medium">{userName}</span> wants to connect
            with you
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          onClick={onAccept}
          disabled={isBusy}
          size="sm"
          className="rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAccepting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
        <Button
          onClick={onReject}
          disabled={isBusy}
          size="sm"
          variant="outline"
          className="rounded-lg font-medium border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          {isRejecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          {isRejecting ? "Declining..." : "Decline"}
        </Button>
      </div>
    </div>
  );
};

export const PublicUserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useAppStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const queryClient = useQueryClient();

  const { data: profileRes, isLoading: isProfileLoading } =
    usePublicUserProfile(id!);
  const { data: connectionRes, isLoading: isConnectionLoading } =
    useConnectionStatus(id!, isAuthenticated);

  const profile = profileRes?.data;
  const connectionStatus = connectionRes?.data?.status ?? "NONE";
  const connectionId = connectionRes?.data?.connectionId;

  const { mutate: connect, isPending: isConnecting } = useMutation<
    ApiResponseWithData<{ connectionStatus: "PENDING" | "ACCEPTED" }>,
    ApiErrorResponseType,
    { userId: string }
  >({
    mutationFn: sendConnectionRequest,
    onSuccess: (response) => {
      queryClient.setQueryData<
        ApiResponseWithData<ConnectionStatusToUserResponse>
      >([CONNECTION_STATUS_QUERY_KEY, id], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            status:
              response.data.connectionStatus === "PENDING"
                ? "PENDING_SENT"
                : "CONNECTED",
            connectionId: old.data.connectionId!,
          },
        };
      });

      if (response.message) toast.success(response.message);
    },
    onError: (error) => {
      error.response?.data.errors.forEach(({ message }) =>
        toast.error(message),
      );
    },
  });

  const { mutate: accept, isPending: isAccepting } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    { connectionId: string }
  >({
    mutationFn: acceptConnectionRequest,
    onSuccess: () => {
      queryClient.setQueryData(
        [CONNECTION_STATUS_QUERY_KEY, id],
        (old: any) => ({
          ...old,
          data: { ...old?.data, status: "CONNECTED" },
        }),
      );
      toast.success("Connection accepted!");
    },
    onError: (error) => {
      error.response?.data.errors.forEach(({ message }) =>
        toast.error(message),
      );
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    { connectionId: string }
  >({
    mutationFn: rejectConnectionRequest,
    onSuccess: () => {
      queryClient.setQueryData(
        [CONNECTION_STATUS_QUERY_KEY, id],
        (old: any) => ({
          ...old,
          data: { ...old?.data, status: "NONE" },
        }),
      );
      toast.success("Connection request declined.");
    },
    onError: (error) => {
      error.response?.data.errors.forEach(({ message }) =>
        toast.error(message),
      );
    },
  });

  const handleConnect = () => {
    if (id) connect({ userId: id });
  };

  const handleAccept = () => {
    if (connectionId) accept({ connectionId });
  };

  const handleReject = () => {
    if (connectionId) reject({ connectionId });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <AppNavbar />
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-stone-200 rounded-lg" />
            <div className="h-32 bg-stone-200 rounded-lg" />
            <div className="h-64 bg-stone-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-stone-50">
        <AppNavbar />
        <div className="container mx-auto px-6 md:px-12 py-40 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            User not found
          </h2>
          <p className="text-stone-500 mb-6">
            This profile doesn't exist or has been removed.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <AppNavbar />

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner */}
          <div className="h-32 md:h-48 rounded-lg overflow-hidden bg-primary relative">
            {profile.bannerUrl ? (
              <img
                src={profile.bannerUrl}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              </>
            )}
          </div>

          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-16 md:-mt-12 px-4 md:px-8">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-stone-50 shadow-lg">
              <AvatarImage src={profile.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-accent/30 text-primary text-3xl font-semibold">
                {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                      {profile.name || profile.username || "User"}
                    </h1>
                    {profile.isVerified && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldCheck className="w-5 h-5 text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Verified User</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {profile.username && profile.name && (
                    <p className="text-stone-500">@{profile.username}</p>
                  )}
                </div>

                {/* Connect Button (auth users only, not shown for PENDING) */}
                {isAuthenticated &&
                  !isConnectionLoading &&
                  connectionStatus !== "PENDING_RECEIVED" && (
                    <ConnectButton
                      status={connectionStatus}
                      onConnect={handleConnect}
                      isConnecting={isConnecting}
                    />
                  )}
                {isAuthenticated && isConnectionLoading && (
                  <div className="h-10 w-32 animate-pulse bg-stone-200 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Connection Request Banner */}
        {isAuthenticated && connectionStatus === "PENDING_RECEIVED" && (
          <div className="mb-8">
            <IncomingRequestBanner
              userName={profile.name || profile.username || "This user"}
              onAccept={handleAccept}
              onReject={handleReject}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {profile.about && (
              <section className="bg-white rounded-lg border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  About
                </h2>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </section>
            )}

            {/* No additional content placeholder */}
            {!profile.about && (
              <section className="bg-white rounded-lg border border-stone-200 p-6 text-center">
                <p className="text-stone-400 text-sm">
                  This user hasn't added a bio yet.
                </p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Details
              </h3>
              <div className="space-y-4">
                {profile.location && (
                  <InfoItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="Location"
                    value={profile.location}
                  />
                )}
                {profile.timezone && (
                  <InfoItem
                    icon={<Clock className="w-4 h-4" />}
                    label="Timezone"
                    value={profile.timezone}
                  />
                )}
                {!profile.location && !profile.timezone && (
                  <p className="text-stone-400 text-sm">
                    No details available.
                  </p>
                )}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-stone-900">
                    Languages
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="border-stone-200 text-stone-600 text-sm font-normal"
                    >
                      {getLanguageName(lang)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-stone-900">
                    Links
                  </h3>
                </div>
                <div className="space-y-2">
                  {profile.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-stone-600 hover:text-primary transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="truncate">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Status Card (for authenticated users) */}
            {isAuthenticated && connectionStatus === "CONNECTED" && (
              <div className="bg-primary rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="font-semibold text-white">
                      You're Connected
                    </h3>
                    <p className="text-white/70 text-sm">
                      You and {profile.name || profile.username} are connected.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-stone-400">{label}</p>
        <p className="text-sm text-stone-700">{value}</p>
      </div>
    </div>
  );
};
