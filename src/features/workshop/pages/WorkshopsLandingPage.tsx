import { ArrowRight, Link2 } from "lucide-react";
import { Link } from "react-router";
import { useAppStore } from "@/app/store";
import { TopBar } from "@/shared/components/layout/TopBar";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { RoutePath } from "@/shared/config/routes";

export const WorkshopsLandingPage = () => {
  const accessToken = useAppStore((state) => state.accessToken);

  return (
    <div className="min-h-screen bg-background">
      {accessToken ? <AppNavbar /> : <TopBar />}
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <Card className="border-border/80 shadow-none">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-semibold text-foreground">
              Workshop discovery is landing next
            </CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              Milestone 1 adds expert cohort management and direct workshop
              detail enrollment. A full browseable workshop catalog is still
              pending.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 border-t border-border/70 pt-6">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
              <Link2 className="mt-0.5 h-4 w-4 text-primary" />
              <p>
                Use direct workshop detail links for now. Experts can manage
                workshops and cohorts from the dashboard today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to={RoutePath.ExpertWorkshops}>
                  Expert workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={RoutePath.Home}>Back home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
