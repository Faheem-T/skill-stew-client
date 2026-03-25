import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { approveExpertApplication } from "@/features/admin/api/experts/ApproveExpertApplication";
import { rejectExpertApplication } from "@/features/admin/api/experts/RejectExpertApplication";
import type { ExpertApplicationStatus } from "@/features/admin/types/ExpertApplication";
import type { ApiResponseWithData, PaginatedApiResponse } from "@/shared/api/baseApi";
import type { ExpertApplicationDetails, ExpertApplicationListItem } from "@/features/admin/types/ExpertApplication";
import type { InfiniteData } from "@tanstack/react-query";
import toast from "react-hot-toast";

type Props = {
  applicationId: string;
};

export const ReviewActions = ({ applicationId }: Props) => {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const updateCaches = (
    status: ExpertApplicationStatus,
    extra?: { rejectionReason?: string },
  ) => {
    const reviewedAt = new Date().toISOString();

    queryClient.setQueryData<ApiResponseWithData<ExpertApplicationDetails>>(
      ["expert-application", applicationId],
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            status,
            reviewedAt,
            ...(extra?.rejectionReason !== undefined
              ? { rejectionReason: extra.rejectionReason }
              : {}),
          },
        };
      },
    );

    queryClient.setQueriesData<InfiniteData<PaginatedApiResponse<ExpertApplicationListItem[]>>>(
      { queryKey: ["expert-applications"], exact: false },
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === applicationId ? { ...item, status } : item,
            ),
          })),
        };
      },
    );
  };

  const approveMutation = useMutation({
    mutationFn: () => approveExpertApplication(applicationId),
    onSuccess: () => {
      toast.success("Application approved.");
      updateCaches("approved");
    },
    onError: () => {
      toast.error("Failed to approve application.");
    },
    onSettled: () => setConfirming(null),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectExpertApplication(applicationId, rejectionReason),
    onSuccess: () => {
      toast.success("Application rejected.");
      updateCaches("rejected", { rejectionReason });
    },
    onError: () => {
      toast.error("Failed to reject application.");
    },
    onSettled: () => {
      setConfirming(null);
      setRejectionReason("");
    },
  });

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  if (confirming === "approve") {
    return (
      <div className="bg-card border-border flex items-center gap-2 rounded-lg border p-3">
        <span className="text-sm text-muted-foreground">Approve this application?</span>
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => approveMutation.mutate()}
        >
          {approveMutation.isPending ? "Approving…" : "Confirm"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setConfirming(null)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (confirming === "reject") {
    return (
      <div className="bg-card border-border flex w-full max-w-sm flex-col gap-2 rounded-lg border p-3">
        <Textarea
          placeholder="Rejection reason (optional)"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={3}
          disabled={isPending}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => rejectMutation.mutate()}
          >
            {rejectMutation.isPending ? "Rejecting…" : "Confirm reject"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setConfirming(null);
              setRejectionReason("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        disabled={isPending}
        onClick={() => setConfirming("approve")}
      >
        Approve
      </Button>
      <Button
        type="button"
        variant="destructive"
        disabled={isPending}
        onClick={() => setConfirming("reject")}
      >
        Reject
      </Button>
    </div>
  );
};
