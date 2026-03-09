import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { RoutePath } from "@/shared/config/routes";
import { Home } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Big playful 404 */}
        <p className="text-[8rem] md:text-[10rem] font-bold leading-none text-primary/15 select-none">
          404
        </p>

        {/* Emoji + message */}
        <p className="text-4xl mb-2">🍲</p>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          This page got overcooked
        </h1>
        <p className="text-stone-500 mb-8">
          Looks like the recipe for this page is missing from our kitchen.
          Let&apos;s get you back to something tasty.
        </p>

        <Link to={RoutePath.Home}>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 h-11 font-medium">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
