import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { User } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export const AdminDashboard = () => {
  return (
    <>
      <div>Dashboard</div>
      <div className="w-200 m-5">
        <UserCountChart />
      </div>
    </>
  );
};

const UserCountData = [
  { month: "January", users: 22 },
  { month: "February", users: 44 },
  { month: "March", users: 203 },
  { month: "April", users: 400 },
];

const chartConfig = {
  users: {
    color: "#2563eb",
    icon: User,
  },
} satisfies ChartConfig;

const UserCountChart = () => {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <LineChart accessibilityLayer data={UserCountData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickMargin={10}
          tickLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="users" />
      </LineChart>
    </ChartContainer>
  );
};
