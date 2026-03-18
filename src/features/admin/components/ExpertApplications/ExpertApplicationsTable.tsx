import { useExpertApplications } from "@/features/admin/hooks/useExpertApplications";
import type { ExpertApplicationListItem } from "@/features/admin/types/ExpertApplication";
import type { ExpertApplicationQueryFilters } from "@/features/admin/types/ExpertApplicationQueryFilters";
import { ExpertApplicationStatusBadge } from "@/features/admin/components/ExpertApplications/ExpertApplicationStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { FetchingState } from "@/shared/components/ui/fetching-state";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Link } from "react-router";
import { RoutePath } from "@/shared/config/routes";

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const ExpertApplicationsTable = ({
  filters,
}: {
  filters: ExpertApplicationQueryFilters;
}) => {
  const {
    isPending,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useExpertApplications(filters);

  if (isPending) {
    return <FetchingState label="Loading expert applications" />;
  }

  if (isError || !data) {
    return <div>Could not load expert applications.</div>;
  }

  const applications = data.pages.flatMap((page) => page.data);
  console.log(applications);

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 text-sm text-muted-foreground">
        No expert applications found for the current filter.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Teaching</TableHead>
          <TableHead>Proposed Workshop</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <ExpertApplicationRow
            key={application.id}
            application={application}
          />
        ))}
      </TableBody>
      {hasNextPage && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

const ExpertApplicationRow = ({
  application,
}: {
  application: ExpertApplicationListItem;
}) => {
  const detailHref = RoutePath.AdminExpertApplicationDetail.replace(
    ":id",
    application.id,
  );

  return (
    <TableRow>
      <TableCell className="align-top whitespace-normal">
        <div className="font-medium">{application.fullName}</div>
      </TableCell>
      <TableCell>
        <ExpertApplicationStatusBadge status={application.status} />
      </TableCell>
      <TableCell>{formatDate(application.submittedAt)}</TableCell>
      <TableCell>{application.yearsExperience} years</TableCell>
      <TableCell>
        {application.hasTeachingExperience ? "Has experience" : "No"}
      </TableCell>
      <TableCell className="max-w-72 whitespace-normal">
        <div className="font-medium">{application.proposedTitle}</div>
        {application.socialLinks.length > 0 && (
          <div className="text-muted-foreground">
            {application.socialLinks.length} social{" "}
            {application.socialLinks.length === 1 ? "link" : "links"}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Button asChild variant="outline" size="sm">
          <Link to={detailHref}>View</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};
