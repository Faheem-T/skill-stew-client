import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useAppStore } from "@/store";
import { DollarSign } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export const AdminDashboard = () => {
  const user = useAppStore((state) => state.user)!;

  return (
    <>
      <div className="font-bold text-3xl">
        Welcome back {user?.username ?? "Jack"}
      </div>
      <RevenueChart />
    </>
  );
};

const RevenueData = [
  { month: "January", revenue: 22 },
  { month: "February", revenue: 44 },
  { month: "March", revenue: 203 },
  { month: "April", revenue: 400 },
];

const chartConfig = {
  revenue: {
    color: "#2563eb",
    icon: DollarSign,
  },
} satisfies ChartConfig;

const RevenueChart = () => {
  return (
    <Card className="w-2/5 p-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="text-foreground" />
          Revenue Growth
        </CardTitle>
        <CardDescription>Revenue growth over the last 4 months</CardDescription>
        {/* <div>
          <div className=>
            <h3 className="text-2xl font-semibold text-foreground">
              Revenue Growth
            </h3>
          </div>
          <h4 className="text-sm text-muted-foreground"></h4>
        </div> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart accessibilityLayer data={RevenueData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickMargin={10}
              tickLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="revenue" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
