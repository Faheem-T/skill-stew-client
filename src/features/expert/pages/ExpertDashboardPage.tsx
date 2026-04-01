import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { RoutePath } from "@/shared/config/routes";
import { Calendar, LayoutDashboard, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export const ExpertDashboardPage = () => {
  const { data: userProfile } = useCurrentUserProfile();
  const expertName = userProfile?.email?.split("@")[0] ?? "Expert";

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:px-8 md:py-16">
        <section className="space-y-4">
          <Badge
            variant="secondary"
            className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
          >
            Expert Space
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Expert dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Welcome back, {expertName}. This is a minimal placeholder dashboard for
              expert accounts while workshop management is being built.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <DashboardStat
            icon={<LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.5} />}
            label="Status"
            value="Ready"
            description="Your expert account is active."
          />
          <DashboardStat
            icon={<Calendar className="h-4 w-4 text-primary" strokeWidth={1.5} />}
            label="Upcoming Sessions"
            value="0"
            description="No live cohorts scheduled yet."
          />
          <DashboardStat
            icon={<Users className="h-4 w-4 text-primary" strokeWidth={1.5} />}
            label="Active Learners"
            value="0"
            description="Learner management will appear here."
          />
        </section>

        <Card className="border-border/80 shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold text-foreground">
              Next steps
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              This page is intentionally minimal. It gives expert accounts a stable
              destination inside the new app shell until the full workshop experience is
              implemented.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 border-t border-border/70 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Future expert tools will live here.
            </p>
            <Button asChild>
              <Link to={RoutePath.ExpertWorkshopCreate}>Create workshop</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

type DashboardStatProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
};

const DashboardStat = ({ icon, label, value, description }: DashboardStatProps) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <CardTitle className="text-2xl font-semibold text-foreground">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-sm border border-border/80 bg-secondary/50 p-2">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
