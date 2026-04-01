import { Lock } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { RoutePath } from "@/shared/config/routes";
import { SummaryMetric } from "@/features/workshop/components/WorkshopWizardShared";
import type { Workshop } from "@/features/workshop/types/types";
import type { WizardStatus } from "@/features/workshop/lib/wizard";

export const WorkshopUnavailablePanel = ({
  status,
}: {
  status: Extract<WizardStatus, { kind: "locked" | "forbidden" | "missing" }>;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-warning">
          <Lock className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-[0.08em]">
            Editor unavailable
          </span>
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          {status.kind === "locked"
            ? "Workshop editing is locked"
            : status.kind === "forbidden"
              ? "You do not have access to this workshop"
              : "Workshop not found"}
        </CardTitle>
        <CardDescription className="max-w-2xl leading-6">
          {status.message}
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t border-border/70 pt-6">
        <Button asChild>
          <Link to={RoutePath.ExpertWorkshops}>Return to workshops</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const WorkshopPublishedPanel = ({
  workshop,
}: {
  workshop: Workshop | null;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-3">
        <Badge
          variant="secondary"
          className="w-fit rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
        >
          Published
        </Badge>
        <CardTitle className="text-3xl font-semibold text-foreground">
          {workshop?.title || "Workshop"} is live
        </CardTitle>
        <CardDescription className="max-w-2xl leading-6">
          The workshop has been published successfully. You can return to the
          expert dashboard now while workshop management screens are still being
          built.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 border-t border-border/70 pt-6 md:grid-cols-3">
        <SummaryMetric label="Status" value={workshop?.status ?? "published"} />
        <SummaryMetric label="Timezone" value={workshop?.timezone ?? "Not set"} />
        <SummaryMetric
          label="Sessions"
          value={String(workshop?.sessions.length ?? 0)}
        />
      </CardContent>
      <CardFooter className="border-t border-border/70 pt-6">
        <Button asChild>
          <Link to={RoutePath.ExpertWorkshops}>Back to workshops</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
