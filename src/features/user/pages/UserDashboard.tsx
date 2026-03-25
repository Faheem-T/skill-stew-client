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
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const recommendedUsers = recommendedUsersData?.data || [];

  return (
    <div className="bg-background min-h-screen">
      <AppNavbar />

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-10 md:py-16">
        <div className="mb-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <div className="bg-secondary text-secondary-foreground mb-4 inline-flex items-center gap-2 rounded-sm px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]">
                <span className="bg-live inline-flex h-2 w-2 rounded-full" />
                Dashboard
              </div>
              <h1 className="text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
                Welcome back, {data?.name || data?.username || "there"}.
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                You have 3 upcoming skill exchanges this week
              </p>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <Button className="px-6">
                <Plus className="w-4 h-4 mr-2" />
                New Exchange
              </Button>
              <Button variant="outline" className="px-6">
                Browse Skills
              </Button>
            </div>
          </div>

          {data && !data.isOnboardingComplete && (
            <Alert
              variant="default"
              className="bg-warning-muted border-border mb-8"
            >
              <BadgeAlertIcon className="text-warning" />
              <AlertTitle className="font-semibold text-foreground">
                Complete your onboarding
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                <span
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="cursor-pointer underline underline-offset-4"
                >
                  Click here to complete onboarding
                </span>{" "}
                and unlock all features.
              </AlertDescription>
            </Alert>
          )}

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
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground md:text-2xl">
                  <Calendar className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  Upcoming Skill Exchanges
                </h2>
                <Button variant="ghost" className="text-sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                </Button>
              </div>

              <div className="space-y-3">
                <SkillExchangeCard
                  title="Spanish Lesson with Maria"
                  teaching="Web Design"
                  learning="Spanish"
                  time="Today, 3:00 PM - 4:00 PM"
                  avatarFallback="MR"
                  avatarBgClass="bg-secondary text-foreground"
                  bgClass="bg-card"
                  borderClass="border-border hover:border-primary"
                  primaryAction="join"
                />

                <SkillExchangeCard
                  title="Guitar Session with David"
                  teaching="Photography"
                  learning="Guitar"
                  time="Tomorrow, 7:00 PM - 8:30 PM"
                  avatarFallback="DC"
                  avatarBgClass="bg-secondary text-foreground"
                  bgClass="bg-card"
                  borderClass="border-border hover:border-primary"
                  primaryAction="reschedule"
                />

                <SkillExchangeCard
                  title="Cooking Class with Sarah"
                  teaching="Digital Marketing"
                  learning="Cooking"
                  time="Friday, 6:00 PM - 7:30 PM"
                  avatarFallback="SJ"
                  avatarBgClass="bg-secondary text-foreground"
                  bgClass="bg-card"
                  borderClass="border-border hover:border-primary"
                  primaryAction="confirm"
                />
              </div>
            </section>

            {/* People You Might Be Interested In */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground md:text-2xl">
                  <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  People You Might Be Interested In
                </h2>
                <Button variant="ghost" className="text-sm">
                  Discover More
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                </Button>
              </div>

              {isLoadingRecommended ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={1.5} />
                </div>
              ) : recommendedError ? (
                <div className="bg-card border-border rounded-lg border py-12">
                  <p className="text-muted-foreground">
                    Failed to load recommendations
                  </p>
                </div>
              ) : recommendedUsers.length === 0 ? (
                <div className="bg-card border-border rounded-lg border py-12">
                  <p className="text-muted-foreground">No users found yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedUsers.map((user) => (
                    <PersonCard
                      key={user.id}
                      id={user.id}
                      name={user.name}
                      username={user.username}
                      location={user.location}
                      avatarUrl={user.avatarUrl}
                      offeredSkills={user.offeredSkills}
                      wantedSkills={user.wantedSkills}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Activity className="w-5 h-5 text-primary" strokeWidth={1.5} />
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
            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Trending Skills
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    AI/Machine Learning
                  </span>
                  <Badge className="text-xs">
                    Hot
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Sustainable Living
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Rising
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Digital Art</span>
                  <Badge variant="outline" className="text-xs">
                    Popular
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Mindfulness</span>
                  <Badge variant="outline" className="text-xs">
                    Growing
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Your Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    Teaching
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="text-xs font-medium">
                      Web Design
                    </Badge>
                    <Badge className="text-xs font-medium">
                      Photography
                    </Badge>
                    <Badge className="text-xs font-medium">
                      Digital Marketing
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    Learning
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-xs font-medium">
                      Spanish
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      Guitar
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      Cooking
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  Edit Skills
                </Button>
              </div>
            </div>

            <div className="bg-card border-border rounded-lg border p-6">
              <div>
                <div className="bg-secondary mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Award className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Skill Mentor</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  You've successfully taught 5+ people new skills!
                </p>
                <Badge variant="secondary" className="font-medium">
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
    <div className="bg-card border-border rounded-lg border p-5">
      <div className="text-primary text-2xl font-semibold md:text-3xl">{value}</div>
      <div className="text-muted-foreground mt-1 text-sm">{label}</div>
    </div>
  );
};
