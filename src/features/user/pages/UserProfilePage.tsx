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

  if (isProfileLoading || isSkillProfileLoading) {
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

  return (
    <div className="min-h-screen bg-stone-50">
      <AppNavbar />

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner */}
          <div className="h-32 md:h-48 rounded-lg overflow-hidden bg-primary relative">
            {profile?.bannerUrl ? (
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
                  <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                    {profile?.name || profile?.username || "User"}
                  </h1>
                  {profile?.username && profile?.name && (
                    <p className="text-stone-500">@{profile.username}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-primary rounded-lg px-6 h-10 font-medium"
                    onClick={() => setIsEditUsernameOpen(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Username
                  </Button>
                  <Button
                    variant="outline"
                    className="border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-primary rounded-lg px-6 h-10 font-medium"
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
              <section className="bg-white rounded-lg border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  About
                </h2>
                <p className="text-stone-600 leading-relaxed">
                  {profile.about}
                </p>
              </section>
            )}

            {/* Skills I Offer */}
            <section className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-stone-900">
                  Skills I Can Teach
                </h2>
              </div>
              {skillProfile?.offered && skillProfile.offered.length > 0 ? (
                <div className="space-y-4">
                  {skillProfile.offered.map((item) => (
                    <div
                      key={item.skill.id}
                      className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900">
                            {item.skill.name}
                          </h3>
                          <p className="text-sm text-stone-500">
                            {item.hoursTaught} hours taught
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/20 text-primary border-0 text-xs">
                        {item.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm">
                  No skills added yet. Add skills you can teach to start
                  exchanging!
                </p>
              )}
            </section>

            {/* Skills I Want to Learn */}
            <section className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-stone-900">
                  Skills I Want to Learn
                </h2>
              </div>
              {skillProfile?.wanted && skillProfile.wanted.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skillProfile.wanted.map((item) => (
                    <div
                      key={item.skill.id}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-lg border border-stone-100"
                    >
                      <span className="font-medium text-stone-700">
                        {item.skill.name}
                      </span>
                      <span className="text-xs text-stone-400">
                        {item.hoursLearned}h learned
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm">
                  No learning goals added yet. Add skills you want to learn!
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Info */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
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
            {profile?.socialLinks && profile.socialLinks.length > 0 && (
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

            {/* Quick Stats */}
            <div className="bg-primary rounded-lg p-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {skillProfile?.offered?.length || 0}
                    </div>
                    <div className="text-xs text-white/70">
                      {pluralize(
                        skillProfile?.offered?.length || 0,
                        "Skill",
                        "Skills",
                      )}{" "}
                      Teaching
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {skillProfile?.wanted?.length || 0}
                    </div>
                    <div className="text-xs text-white/70">
                      {pluralize(
                        skillProfile?.wanted?.length || 0,
                        "Skill",
                        "Skills",
                      )}{" "}
                      Learning
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {skillProfile?.offered?.reduce(
                        (sum, s) => sum + s.hoursTaught,
                        0,
                      ) || 0}
                    </div>
                    <div className="text-xs text-white/70">Hours Taught</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {skillProfile?.wanted?.reduce(
                        (sum, s) => sum + s.hoursLearned,
                        0,
                      ) || 0}
                    </div>
                    <div className="text-xs text-white/70">Hours Learned</div>
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
      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-stone-400">{label}</p>
        <p className="text-sm text-stone-700">{value}</p>
      </div>
    </div>
  );
};
