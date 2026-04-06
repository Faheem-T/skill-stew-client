import { useQueries } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Users } from "lucide-react";
import { Link, useParams } from "react-router";
import { getUserProfileRequest } from "@/features/user/api/GetUserProfile";
import { useExpertCohortMembers } from "@/features/cohort/hooks/useExpertCohortMembers";
import { formatDateTime } from "@/features/cohort/lib/cohort";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { RoutePath } from "@/shared/config/routes";

const getCohortPath = (workshopId: string, cohortId: string) =>
  RoutePath.ExpertWorkshopCohortDetail.replace(":workshopId", workshopId).replace(
    ":cohortId",
    cohortId,
  );

export const ExpertCohortMembersPage = () => {
  const { workshopId = "", cohortId = "" } = useParams();
  const { data: members, isLoading, error } = useExpertCohortMembers(cohortId);

  const memberProfiles = useQueries({
    queries: (members ?? []).map((member) => ({
      queryKey: ["publicUserProfile", member.userId],
      queryFn: async () => {
        const response = await getUserProfileRequest({ id: member.userId });
        return response.data;
      },
      retry: false,
      refetchOnWindowFocus: false,
    })),
  });

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={getCohortPath(workshopId, cohortId)}>
              <ArrowLeft className="h-4 w-4" />
              Back to cohort
            </Link>
          </Button>
        </div>

        <Card className="border-border/80 shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Cohort members
            </CardTitle>
          </CardHeader>
          <CardContent className="border-t border-border/70 pt-6">
            {isLoading ? (
              <div className="h-24 animate-pulse rounded bg-muted" />
            ) : null}

            {!isLoading && error ? (
              <p className="text-sm text-muted-foreground">
                {error.response?.data?.errors?.[0]?.message ??
                  "Unable to load cohort members."}
              </p>
            ) : null}

            {!isLoading && !error && members?.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-background px-4 py-10 text-center">
                <Users className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No active members yet
                </p>
              </div>
            ) : null}

            {!isLoading && !error && members && members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Payment reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, index) => {
                    const profile = memberProfiles[index]?.data;
                    const fallback =
                      profile?.name?.slice(0, 2).toUpperCase() ||
                      profile?.username?.slice(0, 2).toUpperCase() ||
                      member.userId.slice(0, 2).toUpperCase();

                    return (
                      <TableRow key={member.membershipId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={profile?.avatarUrl} />
                              <AvatarFallback>{fallback}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {profile?.name || profile?.username || member.userId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {profile?.username ? `@${profile.username}` : member.userId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.joinedAt ? formatDateTime(member.joinedAt) : "Not set"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {member.membershipId}
                        </TableCell>
                        <TableCell>
                          {member.paymentId ? (
                            <span className="inline-flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-primary" />
                              {member.paymentId}
                            </span>
                          ) : (
                            "Free enrollment"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
