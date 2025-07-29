import z from "zod";
import { api, type ApiResponseWithData } from "./baseApi";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  active: boolean;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  freeWorkshopHours: number;
  features: string[];
}

export const getSubscriptionPlans = async (): Promise<
  ApiResponseWithData<SubscriptionPlan[]>
> => {
  return api.get("/payments/subscriptions");
};

export const createSubscriptionPlanSchema = z.object({
  name: z.string().trim().nonempty("Name connot be empty"),
  description: z.string().nonempty("A description is required"),
  active: z.boolean().optional(),
  monthlyPrice: z.number(),
  yearlyPrice: z.number(),
  freeWorkshopHours: z.number(),
  currency: z.string().optional(),
  features: z.string().array(),
});

export const createPlan = async (
  data: z.infer<typeof createSubscriptionPlanSchema>,
): Promise<ApiResponseWithData<SubscriptionPlan>> => {
  return api.post("/payments/subscriptions", data);
};

export const editSubscriptionPlanSchema =
  createSubscriptionPlanSchema.partial();
export const editPlan = async (
  id: string,
  data: z.infer<typeof editSubscriptionPlanSchema>,
): Promise<ApiResponseWithData<SubscriptionPlan>> => {
  return api.patch(`/payments/subscriptions/${id}`, data);
};
