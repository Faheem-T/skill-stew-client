import type { ApiResponseWithData } from "@/shared/api/baseApi";
import { api } from "@/shared/api/baseApi";

interface SearchSkillsParams {
  query: string;
}

type SearchSkillsResponse = {
  id: string;
  name: string;
  alternateNames: string[];
}[];

export const searchSkillsApi = (
  params: SearchSkillsParams,
): Promise<ApiResponseWithData<SearchSkillsResponse>> => {
  return api.get(`/search/skills`, {
    params,
  });
};
