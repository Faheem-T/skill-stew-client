import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface StatsCardProps {
  value: string | number;
  label: string;
  variant?: "accent" | "secondary" | "primary";
  className?: string;
}

export const StatsCard = ({
  value,
  label,
  variant = "accent",
  className,
}: StatsCardProps) => {
  const variantStyles = {
    accent: "bg-card border-border text-foreground",
    secondary: "bg-secondary/50 border-border text-foreground",
    primary: "bg-card border-primary/20 text-primary",
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-4 text-center">
        <div className="mb-1 text-2xl font-semibold">{value}</div>
        <div className="text-muted-foreground text-sm">{label}</div>
      </CardContent>
    </Card>
  );
};
