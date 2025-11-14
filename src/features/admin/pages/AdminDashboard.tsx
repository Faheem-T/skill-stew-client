import { AdminTopBar } from "@/features/admin/components/layout/AdminTopbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { useAppStore } from "@/app/store";
import { DollarSign, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const AdminDashboard = () => {
  const user = useAppStore((state) => state.user);
  return (
    <div className="">
      <AdminTopBar mainText={`Welcome back ${user?.username}!`} />
      <div className="flex gap-4">
        <RevenueChart />
      </div>
    </div>
  );
};

// Sample Data
const RevenueData = [
  { month: "2023-01-01", revenue: 22000, users: 120 },
  { month: "2023-02-01", revenue: 44000, users: 240 },
  { month: "2023-03-01", revenue: 203000, users: 600 },
  { month: "2023-04-01", revenue: 400000, users: 1200 },
  { month: "2023-05-01", revenue: 510000, users: 1500 },
  { month: "2023-06-01", revenue: 620000, users: 1800 },
  { month: "2023-07-01", revenue: 710000, users: 2000 },
  { month: "2023-08-01", revenue: 830000, users: 2500 },
  { month: "2023-09-01", revenue: 940000, users: 3000 },
  { month: "2023-10-01", revenue: 1000000, users: 3500 },
  { month: "2023-11-01", revenue: 1050000, users: 3800 },
  { month: "2023-12-01", revenue: 1100000, users: 4000 },
  { month: "2024-01-01", revenue: 1120000, users: 4200 },
  { month: "2024-02-01", revenue: 1180000, users: 4400 },
  { month: "2024-03-01", revenue: 1230000, users: 4600 },
  { month: "2024-04-01", revenue: 1300000, users: 4800 },
  { month: "2024-05-01", revenue: 1350000, users: 5000 },
  { month: "2024-06-01", revenue: 1400000, users: 5300 },
  { month: "2024-07-01", revenue: 1450000, users: 5600 },
  { month: "2024-08-01", revenue: 1500000, users: 5900 },
  { month: "2024-09-01", revenue: 1600000, users: 6000 },
  { month: "2024-10-01", revenue: 1700000, users: 6300 },
  { month: "2024-11-01", revenue: 1750000, users: 6600 },
  { month: "2024-12-01", revenue: 1800000, users: 6900 },
  { month: "2025-01-01", revenue: 1900000, users: 7200 },
];

// Config
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
    icon: DollarSign,
  },
  users: {
    label: "Users",
    color: "#10b981",
    icon: Users,
  },
} satisfies Record<string, { label: string; color: string; icon: any }>;

// Component
const RevenueChart = () => {
  return (
    <Card className="w-full py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="text-foreground" />
            Revenue & Users Growth
          </CardTitle>
          <CardDescription>
            Revenue and active users over the last 25 months
          </CardDescription>
        </div>
        <div className="grid grid-cols-2 divide-x border-t sm:border-t-0 sm:flex sm:gap-6">
          <div className="flex flex-col px-6 py-4 sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              {chartConfig["revenue"].label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              $1,900,000
            </span>
          </div>
          <div className="flex flex-col px-6 py-4 sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              {chartConfig["users"].label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              7,200
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart accessibilityLayer data={RevenueData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickMargin={10}
              tickLine={false}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              }
            />
            <YAxis tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="revenue"
              stroke={chartConfig.revenue.color}
              fill={chartConfig.revenue.color}
              type="natural"
            />
            <Area
              dataKey="users"
              stroke={chartConfig.users.color}
              fill={chartConfig.users.color}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
