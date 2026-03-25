import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { RoutePath } from "@/shared/config/routes";
import { Home } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-left">
        <p className="text-primary/15 select-none font-serif text-[8rem] leading-none md:text-[10rem]">
          404
        </p>
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
          Missing page
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          This page is no longer on the menu
        </h1>
        <p className="text-muted-foreground mt-3 mb-8">
          The link may be outdated or the route may have moved. Return to the
          homepage to continue browsing workshops and profiles.
        </p>

        <Link to={RoutePath.Home}>
          <Button className="px-6">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
