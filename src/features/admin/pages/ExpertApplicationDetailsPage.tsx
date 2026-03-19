import type React from "react";
import { useExpertApplicationDetails } from "@/features/admin/hooks/useExpertApplicationDetails";
import { AdminTopBar } from "@/features/admin/components/layout/AdminTopbar";
import { ExpertApplicationStatusBadge } from "@/features/admin/components/ExpertApplications/ExpertApplicationStatusBadge";
import { ReviewActions } from "@/features/admin/components/ExpertApplications/ReviewActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { FetchingState } from "@/shared/components/ui/fetching-state";
import { Button } from "@/shared/components/ui/button";
import { RoutePath } from "@/shared/config/routes";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

const formatDate = (value?: string, withTime = false) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  });
};

const formatBoolean = (value?: boolean) => {
  if (value === undefined) return "N/A";
  return value ? "Yes" : "No";
};

const Field = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
        {value}
      </div>
    </div>
  );
};

export const ExpertApplicationDetailsPage = () => {
  const { id } = useParams();
  const { data, isPending, isError } = useExpertApplicationDetails(id);

  if (isPending) {
    return <FetchingState label="Loading application details" />;
  }

  if (isError || !data) {
    return <div className="p-6">Could not load the expert application.</div>;
  }

  const application = data.data;

  return (
    <div>
      <AdminTopBar
        mainText={application.fullName}
        subText="Review the submitted expert application details."
        sideItems={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to={RoutePath.AdminExpertApplications}>
                <ArrowLeft />
                Back to applications
              </Link>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-6">
        <Card className="py-0">
          <CardHeader className="border-b py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  Review Status
                </CardTitle>
                <CardDescription>
                  Submitted {formatDate(application.submittedAt, true)}
                </CardDescription>
                <ExpertApplicationStatusBadge status={application.status} />
              </div>
              {application.status === "pending" && (
                <ReviewActions applicationId={application.id} />
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 py-6 md:grid-cols-2">
            <Field
              label="Reviewed at"
              value={formatDate(application.reviewedAt, true)}
            />
            <Field
              label="Reviewed by admin"
              value={application.reviewedByAdminId ?? "N/A"}
            />
            <Field
              label="Rejection reason"
              value={application.rejectionReason ?? "N/A"}
            />
          </CardContent>
        </Card>

        <DetailSection
          title="Identity"
          description="Basic contact and profile information."
          fields={[
            { label: "Full name", value: application.fullName },
            { label: "Email", value: application.email },
            { label: "Phone", value: application.phone },
          ]}
        >
          <div className="space-y-2">
            <div className="text-sm font-medium">Social links</div>
            {application.socialLinks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {application.socialLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline break-all"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">N/A</div>
            )}
          </div>
        </DetailSection>

        <DetailSection
          title="Expertise"
          description="Experience and proof of work."
          fields={[
            {
              label: "Years of experience",
              value: `${application.yearsExperience} years`,
            },
            {
              label: "Has teaching experience",
              value: formatBoolean(application.hasTeachingExperience),
            },
            {
              label: "Teaching experience details",
              value: application.teachingExperienceDesc ?? "N/A",
            },
          ]}
        >
          <div className="space-y-2">
            <div className="text-sm font-medium">Evidence links</div>
            {application.evidenceLinks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {application.evidenceLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline break-all"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">N/A</div>
            )}
          </div>
        </DetailSection>

        <DetailSection
          title="Bio"
          description="Applicant background summary."
          fields={[{ label: "", value: application.bio }]}
        />

        <DetailSection
          title="Workshop Intent"
          description="How the applicant wants to teach on the platform."
          fields={[
            { label: "Proposed title", value: application.proposedTitle },
            {
              label: "Proposed description",
              value: application.proposedDescription,
            },
            { label: "Target audience", value: application.targetAudience },
          ]}
        />

        <DetailSection
          title="Technical Readiness"
          description="Self-confirmed technical setup for live teaching."
          fields={[
            {
              label: "Reliable internet",
              value: formatBoolean(application.confirmedInternet),
            },
            {
              label: "Camera available",
              value: formatBoolean(application.confirmedCamera),
            },
            {
              label: "Microphone available",
              value: formatBoolean(application.confirmedMicrophone),
            },
          ]}
        />

        <DetailSection
          title="Legal"
          description="Terms agreement status."
          fields={[
            {
              label: "Terms agreed",
              value: formatBoolean(application.termsAgreed),
            },
            {
              label: "Terms agreed at",
              value: formatDate(application.termsAgreedAt, true),
            },
          ]}
        />
      </div>
    </div>
  );
};

const DetailSection = ({
  title,
  description,
  fields,
  children,
}: {
  title: string;
  description: string;
  fields: { label: string; value: string }[];
  children?: React.ReactNode;
}) => {
  return (
    <Card className="py-0">
      <CardHeader className="border-b py-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
        {children ? (
          <>
            <Separator />
            {children}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
