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
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { TopBar } from "@/features/marketing/home/components/TopBar";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { StatsCard } from "../components/StatsCard";
import { SkillExchangeCard } from "../components/SkillExchangeCard";
import { PersonCard } from "../components/PersonCard";
import { ActivityFeed } from "../components/ActivityFeed";
import { useAppStore } from "@/app/store";

export const UserDashboard = () => {
  const { data } = useUserProfile();
  const setIsOnboardingModalOpen = useAppStore(
    (state) => state.setIsOnboardingModalOpen,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <TopBar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                Welcome back {data?.name || data?.username || ""}! 👋
              </h1>
              <p className="text-text/70 text-lg">
                You have 3 upcoming skill exchanges this week
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button className="bg-accent hover:bg-accent/90 text-background">
                <Plus className="w-4 h-4 mr-2" />
                New Exchange
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background"
              >
                Browse Skills
              </Button>
            </div>
          </div>

          {/* Onboarding completion indicator */}
          {data && !data.isOnboardingComplete && (
            <Alert
              variant="default"
              className="bg-yellow-100 border-yellow-300 my-10"
            >
              <BadgeAlertIcon className="text-yellow-500" size={300} />
              <AlertTitle>
                You have not completed the onboarding process
              </AlertTitle>
              <AlertDescription>
                <div
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="underline cursor-pointer"
                >
                  Click here to complete onboarding.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              value="12"
              label="Skills Learned"
              variant="primary"
              className="transition-all duration-300 hover:scale-105"
            />
            <StatsCard
              value="8"
              label="Skills Taught"
              variant="primary"
              className="transition-all duration-300 hover:scale-105"
            />
            <StatsCard
              value="4.9"
              label="Avg Rating"
              variant="primary"
              className="transition-all duration-300 hover:scale-105"
            />
            <StatsCard
              value="47"
              label="Hours Exchanged"
              variant="primary"
              className="transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Skill Exchanges */}
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Skill Exchanges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SkillExchangeCard
                  title="Spanish Lesson with Maria"
                  teaching="Web Design"
                  learning="Spanish"
                  time="Today, 3:00 PM - 4:00 PM"
                  avatarFallback="MR"
                  avatarBgClass="bg-primary text-background"
                  bgClass="bg-secondary/10"
                  borderClass="border-secondary/30"
                  primaryAction="join"
                />

                <SkillExchangeCard
                  title="Guitar Session with David"
                  teaching="Photography"
                  learning="Guitar"
                  time="Tomorrow, 7:00 PM - 8:30 PM"
                  avatarFallback="DC"
                  avatarBgClass="bg-primary text-background"
                  bgClass="bg-secondary/10"
                  borderClass="border-secondary/30"
                  primaryAction="reschedule"
                />

                <SkillExchangeCard
                  title="Cooking Class with Sarah"
                  teaching="Digital Marketing"
                  learning="Cooking"
                  time="Friday, 6:00 PM - 7:30 PM"
                  avatarFallback="SJ"
                  avatarBgClass="bg-primary text-background"
                  bgClass="bg-secondary/10"
                  borderClass="border-secondary/30"
                  primaryAction="confirm"
                />

                <Button
                  variant="ghost"
                  className="w-full hover:text-accent hover:bg-accent/10 transition-all duration-200"
                >
                  View All Exchanges
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* People You Might Be Interested In */}
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Users className="w-5 h-5 mr-2" />
                  People You Might Be Interested In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <PersonCard
                    name="Alex Thompson"
                    rating={4.8}
                    exchanges={23}
                    canTeach={["React", "Node.js"]}
                    wantsToLearn={["UI/UX Design"]}
                    avatarFallback="AL"
                    avatarBgClass="bg-primary text-background"
                    bgClass="bg-gradient-to-br from-primary/5 to-accent/5"
                    borderClass="border-primary/20"
                    buttonVariant="primary"
                  />

                  <PersonCard
                    name="Lisa Martinez"
                    rating={4.9}
                    exchanges={31}
                    canTeach={["French", "Piano"]}
                    wantsToLearn={["Data Science"]}
                    avatarFallback="LM"
                    avatarBgClass="bg-primary text-background"
                    bgClass="bg-gradient-to-br from-primary/5 to-accent/5"
                    borderClass="border-primary/20"
                    buttonVariant="primary"
                  />

                  <PersonCard
                    name="Raj Kumar"
                    rating={4.7}
                    exchanges={18}
                    canTeach={["Python", "Machine Learning"]}
                    wantsToLearn={["Public Speaking"]}
                    avatarFallback="RK"
                    avatarBgClass="bg-primary text-background"
                    bgClass="bg-gradient-to-br from-primary/5 to-accent/5"
                    borderClass="border-primary/20"
                    buttonVariant="primary"
                  />

                  <PersonCard
                    name="Emma Wilson"
                    rating={5.0}
                    exchanges={12}
                    canTeach={["Yoga", "Meditation"]}
                    wantsToLearn={["Photography"]}
                    avatarFallback="EM"
                    avatarBgClass="bg-primary text-background"
                    bgClass="bg-gradient-to-br from-primary/5 to-accent/5"
                    borderClass="border-primary/20"
                    buttonVariant="primary"
                  />
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 text-accent hover:text-accent hover:bg-accent/10 transition-all duration-200"
                >
                  Discover More People
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      colorClass: "bg-secondary",
                    },
                    {
                      id: "3",
                      person: "David",
                      action: "confirmed guitar session",
                      time: "1 day ago",
                      colorClass: "bg-primary",
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Trending Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">AI/Machine Learning</span>
                  <Badge className="bg-accent text-background">Hot</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Sustainable Living</span>
                  <Badge variant="secondary">Rising</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Digital Art</span>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Mindfulness</span>
                  <Badge variant="outline">Growing</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Your Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-accent mb-2">
                    Teaching
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Web Design
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Photography
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Digital Marketing
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary mb-2">
                    Learning
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Spanish
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Guitar
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Cooking
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-accent hover:text-accent hover:bg-accent/10 transition-all duration-200"
                >
                  Edit Skills
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">
                  Skill Mentor
                </h3>
                <p className="text-sm text-text/70 mb-3">
                  You've successfully taught 5+ people new skills!
                </p>
                <Badge className="bg-accent text-background">
                  Achievement Unlocked
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
