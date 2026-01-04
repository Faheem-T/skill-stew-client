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
    accent:
      "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 text-accent",
    secondary:
      "bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30 text-accent",
    primary:
      "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 text-primary",
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-text/70">{label}</div>
      </CardContent>
    </Card>
  );
};
