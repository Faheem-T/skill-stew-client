import { Badge } from "@/shared/components/ui/badge";
import type { ExpertApplicationStatus } from "@/features/admin/types/ExpertApplication";

const statusVariantMap: Record<
  ExpertApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

export const ExpertApplicationStatusBadge = ({
  status,
}: {
  status: ExpertApplicationStatus;
}) => {
  return (
    <Badge
      variant={statusVariantMap[status]}
      className={
        status === "pending"
          ? "bg-warning-muted text-foreground border-border capitalize"
          : "capitalize"
      }
    >
      {status}
    </Badge>
  );
};
