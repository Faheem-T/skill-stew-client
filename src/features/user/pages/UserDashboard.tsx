import {
  Calendar,
  TrendingUp,
  Users,
  Activity,
  BookOpen,
  Award,
  ArrowRight,
  Plus,
  BadgeAlertIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { SkillExchangeCard } from "../components/SkillExchangeCard";
import { ActivityFeed } from "../components/ActivityFeed";
import { PersonCard } from "../components/PersonCard";
import { useAppStore } from "@/app/store";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedUsersRequest } from "@/features/user/api/GetRecommendedUsers";

export const UserDashboard = () => {
  const { data } = useUserProfile();
  const setIsOnboardingModalOpen = useAppStore(
    (state) => state.setIsOnboardingModalOpen,
  );

  const {
    data: recommendedUsersData,
    isLoading: isLoadingRecommended,
    error: recommendedError,
  } = useQuery({
    queryKey: ["recommended-users"],
    queryFn: getRecommendedUsersRequest,
  });

  const recommendedUsers = recommendedUsersData?.data || [];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <AppNavbar />

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/30 text-primary text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                Welcome back, {data?.name || data?.username || "there"}! 👋
              </h1>
              <p className="mt-3 text-lg text-stone-600">
                You have 3 upcoming skill exchanges this week
              </p>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 h-11 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                New Exchange
              </Button>
              <Button
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-primary rounded-lg px-6 h-11 font-medium"
              >
                Browse Skills
              </Button>
            </div>
          </div>

          {/* Onboarding completion indicator */}
          {data && !data.isOnboardingComplete && (
            <Alert
              variant="default"
              className="bg-accent/20 border-accent/40 mb-8"
            >
              <BadgeAlertIcon className="text-primary" />
              <AlertTitle className="text-stone-900 font-semibold">
                Complete your onboarding
              </AlertTitle>
              <AlertDescription className="text-stone-600">
                <span
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="underline cursor-pointer hover:text-primary transition-colors"
                >
                  Click here to complete onboarding
                </span>{" "}
                and unlock all features.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard value="12" label="Skills Learned" />
            <StatCard value="8" label="Skills Taught" />
            <StatCard value="4.9" label="Avg Rating" />
            <StatCard value="47" label="Hours Exchanged" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Upcoming Skill Exchanges */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Skill Exchanges
                </h2>
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-primary text-sm"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-3">
                <SkillExchangeCard
                  title="Spanish Lesson with Maria"
                  teaching="Web Design"
                  learning="Spanish"
                  time="Today, 3:00 PM - 4:00 PM"
                  avatarFallback="MR"
                  avatarBgClass="bg-primary text-white"
                  bgClass="bg-white"
                  borderClass="border-stone-200 hover:border-primary/30"
                  primaryAction="join"
                />

                <SkillExchangeCard
                  title="Guitar Session with David"
                  teaching="Photography"
                  learning="Guitar"
                  time="Tomorrow, 7:00 PM - 8:30 PM"
                  avatarFallback="DC"
                  avatarBgClass="bg-primary text-white"
                  bgClass="bg-white"
                  borderClass="border-stone-200 hover:border-primary/30"
                  primaryAction="reschedule"
                />

                <SkillExchangeCard
                  title="Cooking Class with Sarah"
                  teaching="Digital Marketing"
                  learning="Cooking"
                  time="Friday, 6:00 PM - 7:30 PM"
                  avatarFallback="SJ"
                  avatarBgClass="bg-primary text-white"
                  bgClass="bg-white"
                  borderClass="border-stone-200 hover:border-primary/30"
                  primaryAction="confirm"
                />
              </div>
            </section>

            {/* People You Might Be Interested In */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  People You Might Be Interested In
                </h2>
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-primary text-sm"
                >
                  Discover More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {isLoadingRecommended ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : recommendedError ? (
                <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
                  <p className="text-stone-600">
                    Failed to load recommendations
                  </p>
                </div>
              ) : recommendedUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
                  <p className="text-stone-600">No users found yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedUsers.map((user) => (
                    <PersonCard key={user.id} {...user} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <ActivityFeed
                activities={[
                  {
                    id: "1",
                    person: "Maria",
                    action: "rated your web design session",
                    time: "2 hours ago",
                    colorClass: "bg-accent",
                  },
                  {
                    id: "2",
                    person: "New skill match found:",
                    action: "Photography",
                    time: "5 hours ago",
                    colorClass: "bg-primary",
                  },
                  {
                    id: "3",
                    person: "David",
                    action: "confirmed guitar session",
                    time: "1 day ago",
                    colorClass: "bg-stone-400",
                  },
                ]}
              />
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                Trending Skills
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    AI/Machine Learning
                  </span>
                  <Badge className="bg-accent/20 text-primary border-0 text-xs">
                    Hot
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    Sustainable Living
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-stone-100 text-stone-600 border-0 text-xs"
                  >
                    Rising
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Digital Art</span>
                  <Badge
                    variant="outline"
                    className="border-stone-200 text-stone-500 text-xs"
                  >
                    Popular
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Mindfulness</span>
                  <Badge
                    variant="outline"
                    className="border-stone-200 text-stone-500 text-xs"
                  >
                    Growing
                  </Badge>
                </div>
              </div>
            </div>

            {/* Your Skills */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                Your Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-stone-500 mb-2">
                    Teaching
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="bg-accent/20 text-primary border-0 text-xs font-normal">
                      Web Design
                    </Badge>
                    <Badge className="bg-accent/20 text-primary border-0 text-xs font-normal">
                      Photography
                    </Badge>
                    <Badge className="bg-accent/20 text-primary border-0 text-xs font-normal">
                      Digital Marketing
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-500 mb-2">
                    Learning
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="border-stone-200 text-stone-600 text-xs font-normal"
                    >
                      Spanish
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-stone-200 text-stone-600 text-xs font-normal"
                    >
                      Guitar
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-stone-200 text-stone-600 text-xs font-normal"
                    >
                      Cooking
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-stone-600 hover:text-primary hover:bg-stone-50 mt-2"
                >
                  Edit Skills
                </Button>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-primary rounded-lg p-6 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-white mb-2">Skill Mentor</h3>
                <p className="text-sm text-white/70 mb-4">
                  You've successfully taught 5+ people new skills!
                </p>
                <Badge className="bg-accent text-primary border-0 font-medium">
                  Achievement Unlocked
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified stat card matching homepage design language
const StatCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5 text-center hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-stone-500 mt-1">{label}</div>
    </div>
  );
};
