import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/theme/theme";
import { cn } from "@/shared/lib/utils";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? (
        <Moon className="size-4" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Sun className="size-4" strokeWidth={1.5} aria-hidden="true" />
      )}
    </Button>
  );
};
