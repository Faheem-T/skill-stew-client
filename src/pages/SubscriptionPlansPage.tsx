import {
  getSubscriptionPlans,
  type SubscriptionPlan,
} from "@/api/subscriptions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const SubscriptionPlansSection: React.FC = () => {
  const [pricingMode, setPricingMode] = React.useState<"monthly" | "yearly">(
    "monthly",
  );
  const { data, isLoading, isFetching, isError } = useQuery({
    queryFn: getSubscriptionPlans,
    queryKey: ["subscription-plans"],
  });

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  if (!data) {
    return <div>Couldn't fetch data!</div>;
  }

  console.log(data);

  const plans = data.data;
  return (
    <div className="flex flex-col items-center border gap-4">
      <Card className="p-0 w-full flex justify-center items-center max-w-sm">
        <CardContent className="flex w-full gap-4 justify-center items-center border p-1 text-foreground rounded-lg bg-card">
          <div
            className={cn(
              "w-1/2 border rounded-lg text-center text-muted-foreground",
              pricingMode === "monthly"
                ? "text-foreground font-bold bg-accent"
                : "hover:opacity-70 hover:cursor-pointer",
            )}
            onClick={() => {
              setPricingMode("monthly");
            }}
          >
            Monthly
          </div>
          <div
            className={cn(
              "w-1/2 border rounded-lg text-center text-muted-foreground",
              pricingMode === "yearly"
                ? "text-foreground font-bold bg-accent"
                : "hover:opacity-70 hover:cursor-pointer",
            )}
            onClick={() => {
              setPricingMode("yearly");
            }}
          >
            Yearly
          </div>
        </CardContent>
      </Card>
      {plans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          pricingMode={pricingMode}
        />
      ))}
    </div>
  );
};

const BillingToggle: React.FC = () => {
  const [pricingMode, setPricingMode] = React.useState<"monthly" | "yearly">(
    "monthly",
  );
  return (
    <Card className="p-0 w-full flex justify-center items-center max-w-sm">
      <CardContent className="flex w-full gap-4 justify-center items-center border p-1 text-foreground rounded-lg bg-card">
        <div
          className={cn(
            "w-1/2 border rounded-lg text-center text-muted-foreground",
            pricingMode === "monthly"
              ? "text-foreground font-bold bg-accent"
              : "hover:opacity-70 hover:cursor-pointer",
          )}
          onClick={() => {
            setPricingMode("monthly");
          }}
        >
          Monthly
        </div>
        <div
          className={cn(
            "w-1/2 border rounded-lg text-center text-muted-foreground",
            pricingMode === "yearly"
              ? "text-foreground font-bold bg-accent"
              : "hover:opacity-70 hover:cursor-pointer",
          )}
          onClick={() => {
            setPricingMode("yearly");
          }}
        >
          Yearly
        </div>
      </CardContent>
    </Card>
  );
};

const SubscriptionPlanCard: React.FC<{
  plan: SubscriptionPlan;
  pricingMode: "monthly" | "yearly";
}> = ({ plan, pricingMode }) => {
  const { id, name, price, freeWorkshopHours, description, features } = plan;
  const { currency } = price;
  const priceWithSymbol = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(price[pricingMode]);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardTitle>
          <span className="text-3xl">{priceWithSymbol}</span>
          <span className="text-muted-foreground">
            /{pricingMode === "monthly" ? "month" : "year"}
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Free Workshop Hours: {freeWorkshopHours}</div>
      </CardContent>
    </Card>
  );
};
