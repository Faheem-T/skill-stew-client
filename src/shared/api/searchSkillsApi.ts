import type { ApiResponseWithData } from "@/shared/api/baseApi";
import { api } from "@/shared/api/baseApi";

interface SearchSkillsParams {
  query: string;
}

interface SearchSkillsResponse {
  data: {
    id: string;
    name: string;
    alternateNames: string[];
  }[];
}

export const searchSkillsApi = (params: SearchSkillsParams) => {
  return api.get<ApiResponseWithData<SearchSkillsResponse>>(
    `/search/skills?query=${params.query}`,
    { params },
  );
};
