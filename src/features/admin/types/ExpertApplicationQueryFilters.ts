import type { ExpertApplicationStatus } from "@/features/admin/types/ExpertApplication";

export type ExpertApplicationQueryFilters = {
  status?: ExpertApplicationStatus;
};

