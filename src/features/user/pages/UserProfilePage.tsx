import {
  MapPin,
  Globe,
  Clock,
  Mail,
  Phone,
  Edit2,
  BookOpen,
  GraduationCap,
  Languages,
  Link as LinkIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { useCurrentUserSkillProfile } from "@/shared/hooks/useCurrentUserSkillProfile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import ISO6391 from "iso-639-1";
import { EditProfileModal } from "../components/EditProfileModal";
import { EditUsernameModal } from "../components/EditUsernameModal";
import { useConnectedUsersCount } from "@/features/user/hooks/useConnectedUsersCount";
import { ConnectedUsersModal } from "@/features/user/components/ConnectedUsersModal";

// Helper to pluralize words
const pluralize = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

const getLanguageName = (code: string): string => {
  return ISO6391.getName(code) || code;
};

export const UserProfilePage = () => {
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: skillProfile, isLoading: isSkillProfileLoading } =
    useCurrentUserSkillProfile();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditUsernameOpen, setIsEditUsernameOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);

  const { data: connectionsCountData, isLoading: isConnectionsLoading } =
    useConnectedUsersCount(profile?.id);
  const connectionsCount = connectionsCountData?.data.count || 0;

  if (isProfileLoading || isSkillProfileLoading) {
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

  return (
    <div className="bg-background min-h-screen">
      <AppNavbar />

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-10 md:py-16">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner */}
          <div className="bg-card border-border relative h-32 overflow-hidden rounded-lg border md:h-48">
            {profile?.bannerUrl ? (
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
              <AvatarImage src={profile?.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-accent/30 text-primary text-3xl font-semibold">
                {profile?.name?.charAt(0) ||
                  profile?.username?.charAt(0) ||
                  profile?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                    {profile?.name || profile?.username || "User"}
                  </h1>
                  {profile?.username && profile?.name && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                  {isConnectionsLoading ? (
                    <div className="bg-secondary mt-2 h-4 w-24 animate-pulse rounded" />
                  ) : (
                    connectionsCount >= 0 && (
                      <button
                        onClick={() => setIsConnectionsModalOpen(true)}
                        className="text-muted-foreground mt-1 flex cursor-pointer items-center gap-1 text-sm transition-colors hover:text-foreground"
                      >
                        <span className="font-semibold text-foreground">
                          {connectionsCount}
                        </span>{" "}
                        connections
                      </button>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="px-6"
                    onClick={() => setIsEditUsernameOpen(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Username
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {profile?.about && (
              <section className="bg-card border-border rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </section>
            )}

            {/* Skills I Offer */}
            <section className="bg-card border-border rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">
                  Skills I Can Teach
                </h2>
              </div>
              {skillProfile?.offered && skillProfile.offered.length > 0 ? (
                <div className="space-y-4">
                  {skillProfile.offered.map((item) => (
                    <div
                      key={item.skill.id}
                      className="bg-background border-border flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {item.skill.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {item.hoursTaught} hours taught
                          </p>
                        </div>
                      </div>
                      <Badge className="text-xs">
                        {item.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No skills added yet. Add skills you can teach to start
                  exchanging!
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
                      className="bg-background border-border flex items-center gap-2 rounded-lg border px-4 py-2"
                    >
                      <span className="font-medium text-foreground">
                        {item.skill.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.hoursLearned}h learned
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No learning goals added yet. Add skills you want to learn!
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Info */}
            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Details
              </h3>
              <div className="space-y-4">
                <InfoItem
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={profile?.email}
                />
                {profile?.phoneNumber && (
                  <InfoItem
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone"
                    value={profile.phoneNumber}
                  />
                )}
                {profile?.location?.formattedAddress && (
                  <InfoItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="Location"
                    value={profile.location.formattedAddress}
                  />
                )}
                {profile?.timezone && (
                  <InfoItem
                    icon={<Clock className="w-4 h-4" />}
                    label="Timezone"
                    value={profile.timezone}
                  />
                )}
              </div>
            </div>

            {/* Languages */}
            {profile?.languages && profile.languages.length > 0 && (
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
            {profile?.socialLinks && profile.socialLinks.length > 0 && (
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

            {/* Quick Stats */}
            <div className="bg-card border-border rounded-lg border p-6">
              <div>
                <h3 className="mb-4 font-semibold text-foreground">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-primary text-2xl font-semibold">
                      {skillProfile?.offered?.length || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {pluralize(
                        skillProfile?.offered?.length || 0,
                        "Skill",
                        "Skills",
                      )}{" "}
                      Teaching
                    </div>
                  </div>
                  <div>
                    <div className="text-primary text-2xl font-semibold">
                      {skillProfile?.wanted?.length || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {pluralize(
                        skillProfile?.wanted?.length || 0,
                        "Skill",
                        "Skills",
                      )}{" "}
                      Learning
                    </div>
                  </div>
                  <div>
                    <div className="text-primary text-2xl font-semibold">
                      {skillProfile?.offered?.reduce(
                        (sum, s) => sum + s.hoursTaught,
                        0,
                      ) || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Hours Taught</div>
                  </div>
                  <div>
                    <div className="text-primary text-2xl font-semibold">
                      {skillProfile?.wanted?.reduce(
                        (sum, s) => sum + s.hoursLearned,
                        0,
                      ) || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Hours Learned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {profile?.role === "USER" && (
        <>
          <EditProfileModal
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            profile={profile}
          />
          <EditUsernameModal
            open={isEditUsernameOpen}
            onOpenChange={setIsEditUsernameOpen}
            currentUsername={profile.username}
          />
        </>
      )}

      {profile?.id && (
        <ConnectedUsersModal
          userId={profile.id}
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
