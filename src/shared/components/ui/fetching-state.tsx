import { cn } from "@/shared/lib/utils";

type FetchingStateProps = {
  variant?: "page" | "section" | "inline";
  label?: string;
  className?: string;
  logoClassName?: string;
};

const containerVariants = {
  page: "min-h-screen w-full",
  section: "bg-card border-border w-full min-h-64 rounded-lg border px-6 py-16",
  inline: "w-full py-6",
} as const;

const logoVariants = {
  page: "w-10",
  section: "w-20 md:w-16",
  inline: "w-12",
} as const;

export function FetchingState({
  variant = "section",
  label,
  className,
  logoClassName,
}: FetchingStateProps) {
  const accessibleLabel = label ?? "Loading";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex items-center justify-center",
        containerVariants[variant],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className={cn(
            "animate-live-pulse object-contain",
            logoVariants[variant],
            logoClassName,
          )}
        />
        <span className="sr-only">{accessibleLabel}</span>
        {label ? (
          <p className="text-muted-foreground max-w-sm text-sm">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
