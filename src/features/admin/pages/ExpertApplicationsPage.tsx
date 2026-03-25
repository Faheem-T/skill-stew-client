import { ExpertApplicationsTable } from "@/features/admin/components/ExpertApplications/ExpertApplicationsTable";
import { AdminTopBar } from "@/features/admin/components/layout/AdminTopbar";
import {
  expertApplicationStatuses,
  type ExpertApplicationStatus,
} from "@/features/admin/types/ExpertApplication";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSearchParams } from "react-router";

const getStatusFromSearchParams = (
  value: string | null,
): ExpertApplicationStatus | undefined => {
  if (!value) return undefined;

  return expertApplicationStatuses.find((status) => status === value);
};

export const ExpertApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = getStatusFromSearchParams(searchParams.get("status"));

  return (
    <div className="bg-background min-h-screen">
      <AdminTopBar
        mainText="Expert Applications"
        subText="Review incoming expert applications submitted by instructors."
        sideItems={
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Select
              value={selectedStatus ?? "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSearchParams({});
                  return;
                }

                setSearchParams({ status: value });
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {expertApplicationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status[0]?.toUpperCase()}
                    {status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        <ExpertApplicationsTable filters={{ status: selectedStatus }} />
      </div>
    </div>
  );
};
