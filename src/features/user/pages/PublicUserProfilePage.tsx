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
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
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
import { useUserSkillProfile } from "../hooks/useUserSkillProfile";
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
import {
  useConnectedUsersCount,
  CONNECTED_USERS_COUNT_QUERY_KEY,
} from "@/features/user/hooks/useConnectedUsersCount";
import { CONNECTED_USERS_QUERY_KEY } from "@/features/user/hooks/useConnectedUsers";
import { ConnectedUsersModal } from "@/features/user/components/ConnectedUsersModal";

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
          className="bg-warning-muted border-border px-6 font-medium cursor-default"
        >
          <Clock className="w-4 h-4" strokeWidth={1.5} />
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
          className="bg-success-muted border-border px-6 font-semibold cursor-default"
        >
          <UserCheck className="w-4 h-4" strokeWidth={1.5} />
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
    <div className="bg-info-muted border-border flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:p-5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="bg-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <UserPlus className="text-info w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Connection Request
          </p>
          <p className="text-muted-foreground text-sm">
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
          className="font-medium"
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
          className="font-medium"
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
  const { data: userSkillProfileRes } = useUserSkillProfile(profile?.userId);
  const skillProfile = userSkillProfileRes?.data;

  const connectionStatus = connectionRes?.data?.status ?? "NONE";
  const connectionId = connectionRes?.data?.connectionId;

  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const { data: connectionsCountData } = useConnectedUsersCount(
    profile?.userId,
  );
  const connectionsCount = connectionsCountData?.data.count || 0;

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

      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_COUNT_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_QUERY_KEY, id],
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
      queryClient.setQueryData<
        ApiResponseWithData<ConnectionStatusToUserResponse>
      >([CONNECTION_STATUS_QUERY_KEY, id], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            status: "CONNECTED",
            connectionId: connectionId!,
          },
        };
      });
      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_COUNT_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_QUERY_KEY, id],
      });
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
      queryClient.setQueryData<
        ApiResponseWithData<ConnectionStatusToUserResponse>
      >([CONNECTION_STATUS_QUERY_KEY, id], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, status: "NONE", connectionId: null },
        };
      });
      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_COUNT_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [CONNECTED_USERS_QUERY_KEY, id],
      });
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
      <div className="bg-background min-h-screen">
        <AppNavbar />
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-10">
          <div className="animate-pulse space-y-8">
            <div className="bg-secondary h-48 rounded-lg" />
            <div className="bg-secondary h-32 rounded-lg" />
            <div className="bg-secondary h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background min-h-screen">
        <AppNavbar />
        <div className="mx-auto max-w-[1200px] px-4 py-40 md:px-10">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            User not found
          </h2>
          <p className="text-muted-foreground mb-6">
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
    <div className="bg-background min-h-screen">
      <AppNavbar />

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-10 md:py-16">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner */}
          <div className="bg-card border-border relative h-32 overflow-hidden rounded-lg border md:h-48">
            {profile.bannerUrl ? (
              <img
                src={profile.bannerUrl}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="bg-secondary absolute top-0 right-0 h-64 w-64 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" />
                <div className="bg-accent absolute bottom-0 left-0 h-48 w-48 rounded-full -translate-x-1/2 translate-y-1/2 opacity-45" />
              </>
            )}
          </div>

          {/* Avatar and Basic Info */}
          <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-8">
            <Avatar className="border-background -mt-16 h-28 w-28 shrink-0 border-4 md:-mt-12 md:h-32 md:w-32">
              <AvatarImage src={profile.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-accent/30 text-primary text-3xl font-semibold">
                {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                      {profile.name || profile.username || "User"}
                    </h1>
                    {profile.isVerified && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldCheck className="w-5 h-5 cursor-help text-primary" strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent>Verified User</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {profile.username && profile.name && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                  {profile.userId && (
                    <button
                      onClick={() => setIsConnectionsModalOpen(true)}
                      className="text-muted-foreground mt-1 flex cursor-pointer items-center gap-1 text-sm transition-colors hover:text-foreground"
                    >
                      <span className="font-semibold text-foreground">
                        {connectionsCount}
                      </span>{" "}
                      connections
                    </button>
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
                  <div className="bg-secondary h-10 w-32 animate-pulse rounded-lg" />
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
              <section className="bg-card border-border rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </section>
            )}

            {/* No additional content placeholder */}
            {!profile.about && (
              <section className="bg-card border-border rounded-lg border p-6">
                <p className="text-muted-foreground text-sm">
                  This user hasn't added a bio yet.
                </p>
              </section>
            )}

            {/* Skills I Offer to Teach */}
            <section className="bg-card border-border rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">
                  Skills I Offer to Teach
                </h2>
              </div>
              {skillProfile?.offered && skillProfile.offered.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {skillProfile.offered.map((item) => (
                    <div
                      key={item.skill.id}
                      className="bg-background border-border group flex cursor-default flex-col rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-foreground">
                          {item.skill.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className=""
                        >
                          {item.proficiency}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span>{item.hoursTaught}h taught</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  This user has not listed any teaching skills.
                </p>
              )}
            </section>

            {/* Skills I Want to Learn */}
            <section className="bg-card border-border rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">
                  Skills I Want to Learn
                </h2>
              </div>
              {skillProfile?.wanted && skillProfile.wanted.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skillProfile.wanted.map((item) => (
                    <div
                      key={item.skill.id}
                      className="bg-background border-border flex cursor-default items-center gap-2 rounded-lg border px-4 py-2"
                    >
                      <span className="font-medium text-foreground">
                        {item.skill.name}
                      </span>
                      <span className="text-muted-foreground text-xs font-medium">
                        {item.hoursLearned}h learned
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  This user has no listed learning goals.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
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
                  <p className="text-muted-foreground text-sm">
                    No details available.
                  </p>
                )}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="bg-card border-border rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-foreground">
                    Languages
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="text-sm font-medium"
                    >
                      {getLanguageName(lang)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="bg-card border-border rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-foreground">
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
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
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
              <div className="bg-success-muted border-border rounded-lg border p-6">
                <div className="flex items-center gap-3">
                  <Check className="text-success w-5 h-5" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      You're Connected
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You and {profile.name || profile.username} are connected.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {profile?.userId && (
        <ConnectedUsersModal
          userId={profile.userId}
          open={isConnectionsModalOpen}
          onOpenChange={setIsConnectionsModalOpen}
        />
      )}
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
      <div className="bg-secondary text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
};
