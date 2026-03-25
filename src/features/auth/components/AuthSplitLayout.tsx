import type React from "react";
import { APP_NAME } from "@/shared/config/constants";
import { RoutePath } from "@/shared/config/routes";
import { Link } from "react-router";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";

type AuthSplitLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const AuthSplitLayout = ({
  eyebrow,
  title,
  description,
  aside,
  children,
  footer,
}: AuthSplitLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="border-border bg-card flex flex-col border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-12">
          <div className="flex items-center justify-between">
            <Link to={RoutePath.Home} className="flex items-center gap-3">
              <img src="/logo.png" className="h-10 w-10 object-contain" />
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
                  Skill Stew
                </p>
                <p className="text-lg font-semibold">{APP_NAME}</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center">
            <div className="max-w-2xl space-y-8 py-10 lg:py-0">
              <div className="space-y-4">
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
                  {eyebrow}
                </p>
                <h1 className="font-serif text-5xl leading-none text-balance text-foreground">
                  {title}
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  {description}
                </p>
              </div>
              {aside}
            </div>
          </div>
        </section>

        <section className="bg-background flex items-center px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            {children}
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
};
